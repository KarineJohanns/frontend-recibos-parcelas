// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import Produtos from './pages/Produtos';
import Emitente from './pages/Emitente';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/emitente" element={<Emitente />} />
    </Routes>
  </Router>
);

export default App;
