// src/components/ParcelaItem.tsx
import React from 'react';
import { Dropdown } from 'react-bootstrap';

interface ParcelaItemProps {
  parcela: {
    numeroParcela: number;
    numeroParcelas: number;
    valorParcela: number;
    dataVencimento: string;
    clienteNome: string;
    paga: boolean; // Modificado para 'paga' como booleano
    parcelaId: number;
  };
  onReceber: (id: number) => void;
  onEditar: (id: number) => void;
  onExcluir: (id: number) => void;
  onDetalhes: (id: number) => void;
  onRenegociar: (id: number) => void;
  onGerarRecibo: (id: number) => void;
}

const ParcelaItem: React.FC<ParcelaItemProps> = ({
  parcela,
  onReceber,
  onEditar,
  onExcluir,
  onDetalhes,
  onRenegociar,
  onGerarRecibo
}) => {
  // Status baseado no booleano paga
  const statusClass = parcela.paga ? 'bg-success' : 'bg-warning';

  return (
    <div className="d-flex justify-content-between align-items-center mb-2 p-2 border">
      <div>
        <div>{`Parcela ${parcela.numeroParcela}/${parcela.numeroParcelas}`}</div>
        <div>Valor: R${parcela.valorParcela.toFixed(2)}</div>
        <div>Vencimento: {parcela.dataVencimento}</div>
        <div>Cliente: {parcela.clienteNome}</div>
      </div>
      <div className={`badge ${statusClass} text-white`}>
        {parcela.paga ? 'Paga' : 'Pendente'}
      </div>
      <Dropdown>
        <Dropdown.Toggle variant="link" id="dropdown-basic">
          &#x22EE;
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => onDetalhes(parcela.parcelaId)}>Detalhes</Dropdown.Item>
          <Dropdown.Item onClick={() => onEditar(parcela.parcelaId)}>Editar</Dropdown.Item>
          <Dropdown.Item onClick={() => onReceber(parcela.parcelaId)}>Receber</Dropdown.Item>
          <Dropdown.Item onClick={() => onExcluir(parcela.parcelaId)}>Excluir</Dropdown.Item>
          <Dropdown.Item onClick={() => onRenegociar(parcela.parcelaId)}>Renegociar</Dropdown.Item>
          <Dropdown.Item onClick={() => onGerarRecibo(parcela.parcelaId)}>Gerar Recibo</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default ParcelaItem;
