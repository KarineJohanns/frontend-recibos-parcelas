// src/components/ModalDetalhes.tsx
import React from 'react';
import { Modal } from 'react-bootstrap';
import '../../styles/ModalDetalhes.css';

interface ModalDetalhesProps {
  show: boolean;
  onClose: () => void;
  parcela: {
    numeroParcela: number;
    numeroParcelas: number;
    valorParcela: number;
    dataVencimento: string;
    dataCriacao: string;
    cliente: {
      clienteNome: string;
      clienteCpf: string;
      clienteEndereco: string;
      clienteTelefone: string;
    };
    paga: boolean;
  } | null;
}

const ModalDetalhes: React.FC<ModalDetalhesProps> = ({
  show,
  onClose,
  parcela,
}) => {
  if (!parcela) return null;

  const hoje = new Date();
  const dataVencimento = new Date(parcela.dataVencimento);

  let statusClass = 'bg-warning text-dark'; // Default status
  let statusText = 'Pendente';

  if (parcela.paga) {
    statusClass = 'bg-success text-white';
    statusText = 'Paga';
  } else if (dataVencimento < hoje) {
    statusClass = 'bg-danger text-white';
    statusText = 'Vencida';
  }

  return (
    <Modal show={show} onHide={onClose} size='xl'>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes da Parcela</Modal.Title>
      </Modal.Header>
      <Modal.Body className='principal'>
        <div className='mb-3 filho1'>
          <div className='row filho2'>
            {/* Colocar status e parcela lado a lado */}
            <div className='col-lg-6 col-md-12 mb-2'>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`badge ${statusClass}`}>{statusText}</span>
              </p>
            </div>
            <div className='col-lg-6 col-md-12 mb-2'>
              <p>
                <strong>Parcela:</strong> {parcela.numeroParcela}/
                {parcela.numeroParcelas}
              </p>
            </div>
          </div>
        </div>

        <div className='mb-3 filho1'>
          <h5 className="p-3 bg-light">Informações</h5>
          <div className='row filho2'>
            <div className='col-lg-4 col-md-6 mb-2 filho3'>
              <p>
                <strong>Emissão: </strong>
                {new Date(parcela.dataCriacao).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className='col-lg-4 col-md-6 mb-2 filho3'>
              <p>
                <strong>Vencimento: </strong>
                {new Date(parcela.dataVencimento).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className='col-lg-4 col-md-6 mb-2 filho3'>
              <p>
                <strong>Valor: </strong>R$
                {parcela.valorParcela.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className='filho1'>
          <h5 className="p-3 bg-light">Cliente</h5>
          <div className='row filho2'>
            <div className='col-lg-4 col-md-6 mb-2 filho3'>
              <p>
                <strong>Nome: </strong>
                {parcela.cliente.clienteNome}
              </p>
            </div>
            <div className='col-lg-4 col-md-6 mb-2 filho3'>
              <p>
                <strong>CPF: </strong>
                {parcela.cliente.clienteCpf}
              </p>
            </div>
            <div className='col-lg-4 col-md-6 mb-2 filho3'>
              <p>
                <strong>Endereço: </strong>
                {parcela.cliente.clienteEndereco}
              </p>
            </div>
            <div className='col-lg-4 col-md-6 mb-2 filho3'>
              <p>
                <strong>Telefone: </strong>
                {parcela.cliente.clienteTelefone}
              </p>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalDetalhes;
