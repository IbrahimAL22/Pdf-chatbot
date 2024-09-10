import os
import fitz  # PyMuPDF
import spacy
import torch
from django.shortcuts import render
from django.http import JsonResponse
from .forms import PDFUploadForm
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForCausalLM
from django.views.decorators.csrf import csrf_exempt

# Load necessary models
embedding_model = SentenceTransformer("all-mpnet-base-v2", device="cpu")
nlp = spacy.load("en_core_web_sm")
tokenizer = AutoTokenizer.from_pretrained("C:/Users/Ibrahim/Desktop/rag/Qwen1.5-1.8B-Chat")
llm_model = AutoModelForCausalLM.from_pretrained(
    "C:/Users/Ibrahim/Desktop/rag/Qwen1.5-1.8B-Chat", torch_dtype=torch.float16, device_map="auto" if torch.cuda.is_available() else "cpu"
)

@csrf_exempt
def text_formatter(text: str) -> str:
    return text.replace("\n", " ").strip()

@csrf_exempt
def open_and_read_pdf(pdf_path: str) -> list:
    doc = fitz.open(pdf_path)
    pages_and_texts = []
    for page_number, page in enumerate(doc):
        text = page.get_text()
        text = text_formatter(text)
        pages_and_texts.append({"page_number": page_number, "text": text})
    return pages_and_texts

@csrf_exempt
def split_list(input_list: list, slice_size: int) -> list:
    return [input_list[i:i + slice_size] for i in range(0, len(input_list), slice_size)]

@csrf_exempt
def retrieve_relevant_resources(query: str, embeddings: torch.Tensor, model: SentenceTransformer, n_resources_to_return: int = 5):
    query_embedding = model.encode(query, convert_to_tensor=True)
    dot_scores = torch.matmul(query_embedding, embeddings.T)
    scores, indices = torch.topk(dot_scores, k=n_resources_to_return)
    return scores, indices

@csrf_exempt
def ask(query: str, pages_and_chunks: list, embeddings: torch.Tensor, model: SentenceTransformer, llm_model, tokenizer, temperature: float = 0.7, max_new_tokens: int = 512, relevance_threshold: float = 0.3):
    scores, indices = retrieve_relevant_resources(query, embeddings, model)
    
    if scores[0].item() < relevance_threshold:
        return "I don't know the answer to that question based on the provided document."

    context_items = [pages_and_chunks[i] for i in indices]
    context = "\n\n".join([f"- {item['sentence_chunk']}" for item in context_items])
    
    base_prompt = f"""Based on the following context items, please answer the query.
    If the query is not related to the context items, don't answer it or say 'I don't know'.
    Answer in detail and with technical accuracy.

    Context:
    {context}

    User query: {query}
    Answer:"""
    
    input_ids = tokenizer(base_prompt, return_tensors="pt").to("cuda" if torch.cuda.is_available() else "cpu")
    outputs = llm_model.generate(**input_ids, temperature=temperature, do_sample=True, max_new_tokens=max_new_tokens)
    output_text = tokenizer.decode(outputs[0])

    output_text = output_text.replace("<|im_end|>", "").strip()
    return output_text.replace(base_prompt, "").strip()

@csrf_exempt
def main(pdf_path: str, query: str):
    pages_and_texts = open_and_read_pdf(pdf_path)
    for item in pages_and_texts:
        item["sentences"] = list(nlp(item["text"]).sents)
        item["sentences"] = [str(sentence) for sentence in item["sentences"]]
        item["sentence_chunks"] = split_list(item["sentences"], 10)

    pages_and_chunks = []
    for item in pages_and_texts:
        for sentence_chunk in item["sentence_chunks"]:
            chunk_dict = {
                "page_number": item["page_number"],
                "sentence_chunk": "".join(sentence_chunk).replace("  ", " ").strip(),
                "chunk_token_count": len("".join(sentence_chunk)) / 4
            }
            pages_and_chunks.append(chunk_dict)

    text_chunks = [item["sentence_chunk"] for item in pages_and_chunks if item["chunk_token_count"] > 50]
    embeddings = embedding_model.encode(text_chunks, batch_size=32, convert_to_tensor=True)

    response = ask(query, pages_and_chunks, embeddings, embedding_model, llm_model, tokenizer)
    return response

@csrf_exempt
def upload_pdf(request):
    if request.method == 'POST':
        if 'pdf' in request.FILES:
            pdf = request.FILES['pdf']
            pdf_path = os.path.join('temp_files', pdf.name)
            
            # Save the uploaded PDF
            with open(pdf_path, 'wb+') as destination:
                for chunk in pdf.chunks():
                    destination.write(chunk)
            
            # Return the file name as JSON response
            return JsonResponse({'pdf_name': pdf.name})

    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def chat(request):
    # Render the React app's HTML
    return render(request, 'frontend/build/index.html')

import json

@csrf_exempt
def handle_query(request):
    if request.method == 'POST':
        try:
            # Parse JSON data
            data = json.loads(request.body)
            query = data.get('query')
            pdf_name = data.get('pdf_name')
            
            # Check for missing parameters
            if not query or not pdf_name:
                return JsonResponse({'error': 'Missing query or pdf_name parameter'}, status=400)
            
            pdf_path = os.path.join('temp_files', pdf_name)
            
            # Check if the file exists
            if not os.path.isfile(pdf_path):
                return JsonResponse({'error': 'PDF file not found'}, status=404)

            # Call the main function to process the query and return the answer
            response = main(pdf_path, query)
            return JsonResponse({'response': response})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)
