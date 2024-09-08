import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f4f7f9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: 90vh;
  overflow: hidden;
`;

const Header = styled.div`
  background-color: #000000;
  color: #fff;
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  position: relative;
`;

const PDFName = styled.h2`
  margin: 0;
  font-size: 1.2rem;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
`;

const ChatBubble = styled.div`
  max-width: 60%;
  padding: 10px;
  margin: 5px 0;
  border-radius: 20px;
  background-color: ${props => props.type === 'user' ? '#000000' : '#fff'};
  color: ${props => props.type === 'user' ? '#fff' : '#333'};
  align-self: ${props => props.type === 'user' ? 'flex-end' : 'flex-start'}; /* Ensures user messages are right-aligned */
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid ${props => props.type === 'user' ? '#000000' : '#ddd'};
`;



const ChatIcon = styled(FontAwesomeIcon)`
  font-size: 1.5rem;
`;

const InputContainer = styled.div`
  display: flex;
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ddd;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 20px;
  background-color: #000000;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #BED3AB;
  }
`;

function ChatPage() {
  const { pdfName } = useParams();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (!query) return;

    // Add user message to chat
    setMessages(prevMessages => [
      ...prevMessages, 
      { text: `You: ${query}`, type: 'user' }
    ]);

    // Send query to backend
    axios.post('http://localhost:8000/handle_query/', {
      query: query,
      pdf_name: pdfName
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      // Add bot response to chat
      setMessages(prevMessages => [
        ...prevMessages, 
        { text: `Bot: ${response.data.response}`, type: 'bot' }
      ]);
    })
    .catch(error => {
      console.error('Chat error:', error);
    });

    // Clear the query input
    setQuery('');
  };

  return (
    <Container>
      <Header>
        <PDFName>Chatting with: {pdfName}</PDFName>
        <p>Engage in Intelligent Conversations</p>
      </Header>
      <ChatContainer>
        {messages.map((message, index) => (
          <ChatBubble key={index} type={message.type}>
            <ChatIcon icon={message.type === 'user' ? faUser : faRobot} />
            {message.text}
          </ChatBubble>
        ))}
      </ChatContainer>
      <InputContainer>
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
        />
        <Button onClick={handleSend}>Send</Button>
      </InputContainer>
    </Container>
  );
}

export default ChatPage;
