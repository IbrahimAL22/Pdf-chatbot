from django import forms

class PDFUploadForm(forms.Form):
    pdf_file = forms.FileField()
    query = forms.CharField(widget=forms.Textarea, required=False, help_text="Enter your query about the document.")
