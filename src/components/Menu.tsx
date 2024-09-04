// src/components/Menu.tsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Menu.css'; // Importa o arquivo CSS

const Menu: React.FC = () => (
  <Nav className="flex-column menu-container"> {/* Adiciona a classe do container */}
    <Nav.Link as={Link} to="/" className="menu-link">Parcelas</Nav.Link> {/* Adiciona a classe do link */}
    <Nav.Link as={Link} to="/clientes" className="menu-link">Clientes</Nav.Link>
    <Nav.Link as={Link} to="/produtos" className="menu-link">Produtos</Nav.Link>
    <Nav.Link as={Link} to="/emitente" className="menu-link">Emitente</Nav.Link>
  </Nav>
);

export default Menu;
