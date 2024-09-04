// src/pages/Emitente.tsx
import React from 'react';
import Menu from '../components/Menu';

const Emitente: React.FC = () => {
  return (
    <div className="d-flex">
    <div className="col-md-3">
      <Menu />
    </div>
    <div className="col-md-9">
      <div>
      <h1>Emitente</h1>
      <p>Esta é a página de Emitente. Adicione o conteúdo aqui.</p>
    </div>
    </div>
  </div>
    
  );
};

export default Emitente;
