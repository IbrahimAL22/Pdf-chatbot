import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Dashboard from './Dashboard';
import UploadPage from './UploadPage';
import ChatPage from './ChatPage';
import styled from 'styled-components';

const AppContainer = styled.div`
  background: linear-gradient(135deg, #1f4037, #99f2c8); /* A beautiful gradient */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

/* Adding abstract shapes as part of the background design */
const BackgroundShape1 = styled.div`
  position: absolute;
  top: -100px;
  right: -150px;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  filter: blur(100px);
`;

const BackgroundShape2 = styled.div`
  position: absolute;
  bottom: -100px;
  left: -150px;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  filter: blur(75px);
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Navbar />
        {/* Adding the background abstract shapes */}
        <BackgroundShape1 />
        <BackgroundShape2 />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/chat/:pdfName" element={<ChatPage />} />
          </Routes>
        </div>
        <Footer />
      </AppContainer>
    </Router>
  );
}

export default App;
