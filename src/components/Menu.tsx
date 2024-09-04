// src/components/Menu.tsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Menu: React.FC = () => (
  <Nav className="flex-column">
    <Nav.Link as={Link} to="/">Parcelas</Nav.Link>
    <Nav.Link as={Link} to="/clientes">Clientes</Nav.Link>
    <Nav.Link as={Link} to="/produtos">Produtos</Nav.Link>
    <Nav.Link as={Link} to="/emitente">Emitente</Nav.Link>
  </Nav>
);

export default Menu;
