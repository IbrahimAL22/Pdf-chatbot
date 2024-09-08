import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f4f7f9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: 90vh;
  justify-content: center;
  align-items: center;
`;

const Header = styled.div`
  background-color: #000000;
  color: #fff;
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  margin: 20px 0;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: #000000;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #BED3AB;
  }
`;

function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const response = await axios.post('http://localhost:8000/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Redirect to the chat page with the PDF name
      navigate(`/chat/${response.data.pdf_name}`);
    } catch (error) {
      setError('Failed to upload PDF');
      console.error('Upload error:', error);
    }
  };

  return (
    <Container>
      <Header>
        <h1>Upload Your PDF</h1>
        <p>Upload your PDF and start a chat with your document</p>
      </Header>
      <Input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
      />
      <Button onClick={handleUpload}>Upload</Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </Container>
  );
}

export default UploadPage;
