import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #000000;
  color: white;
  text-align: center;
  padding: 10px;
  position: relative;
  width: 100%;
`;

const FooterText = styled.p`
  margin: 0;
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterText>© 2024 Aloui Ibrahim - All Rights Reserved</FooterText>
    </FooterContainer>
  );
}

export default Footer;
