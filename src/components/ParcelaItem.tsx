// src/components/ParcelaItem.tsx
import React from 'react';
import '../styles/ParcelaItem.css';
import { Dropdown } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';

interface ParcelaItemProps {
  parcela: {
    numeroParcela: number;
    numeroParcelas: number;
    valorParcela: number;
    dataVencimento: string;
    cliente: {
      clienteNome: string;
    };
    paga: boolean;
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
  const hoje = new Date();
  const dataVencimento = new Date(parcela.dataVencimento);

  let statusClass = 'bg-warning'; // Default status
  let statusText = 'Pendente';

  if (parcela.paga) {
    statusClass = 'bg-success';
    statusText = 'Paga';
  } else if (dataVencimento < hoje) {
    statusClass = 'bg-danger';
    statusText = 'Atrasada';
  }

  return (
    <div className="parcela-item d-flex justify-content-between align-items-center mb-2 p-3">
      <div className="info">
        <div>{`Parcela ${parcela.numeroParcela}/${parcela.numeroParcelas}`}</div>
        <div>Valor: R${parcela.valorParcela.toFixed(2)}</div>
        <div>Vencimento: {dataVencimento.toLocaleDateString('pt-BR')}</div>
        <div>Cliente: {parcela.cliente.clienteNome}</div>
      </div>
      <div className={`badge ${statusClass} text-white`}>
        {statusText}
      </div>
      <Dropdown>
        <Dropdown.Toggle className="custom-dropdown-toggle" variant="link" id="dropdown-basic">
          <ThreeDotsVertical size={24} />
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
