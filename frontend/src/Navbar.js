import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from './assets/logo.png'; // Ensure this path is correct

const Nav = styled.nav`
  background-color: #000000;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

const Logo = styled.img`
  height: 40px;
`;

const SiteName = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  margin-left: 20px;
  &:hover {
    text-decoration: underline;
    cursor: pointer; /* Ensure it looks clickable */
  }
`;

function Navbar() {
  return (
    <Nav>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Logo src={logo} alt="logo" />
        <SiteName>ChatterGPT</SiteName>
      </div>
      <div>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/upload">Upload PDF</NavLink>

      </div>
    </Nav>
  );
}

export default Navbar;
