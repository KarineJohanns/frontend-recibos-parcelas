// src/pages/Clientes.tsx
import React from 'react';
import Menu from '../components/Menu';

const Clientes: React.FC = () => {
  return (
    <div className="d-flex">
    <div className="col-md-3">
      <Menu />
    </div>
    <div className="col-md-9">
      <div>
      <h1>Clientes</h1>
      <p>Esta é a página de Clientes. Adicione o conteúdo aqui.</p>
    </div>
    </div>
  </div>
    
  );
};

export default Clientes;
