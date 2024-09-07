import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../api/axios';

interface ModalReceberParcelaProps {
  show: boolean;
  onClose: () => void;
  parcelaId: number;
}

const ModalReceberParcela: React.FC<ModalReceberParcelaProps> = ({ show, onClose, parcelaId }) => {
  const [valorPago, setValorPago] = useState<number>(0);
  const [dataPagamento, setDataPagamento] = useState<string>('');

  // Função handleReceber
  const handleReceber = async () => {
    try {
      const response = await api.post(`/parcelas/${parcelaId}/receber`, {
        valorPago,
        dataPagamento
      });

      if (valorPago < response.data.valorTotalParcela) {
        // Lógica para mostrar novo modal ou atualizar estado
      } else {
        onClose();
        window.location.reload(); // Recarregar a página
      }
    } catch (error) {
      console.error('Erro ao receber parcela', error);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Receber Parcela</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formValorPago">
            <Form.Label>Valor Pago</Form.Label>
            <Form.Control
              type="number"
              value={valorPago}
              onChange={(e) => setValorPago(Number(e.target.value))}
            />
          </Form.Group>
          <Form.Group controlId="formDataPagamento">
            <Form.Label>Data de Pagamento</Form.Label>
            <Form.Control
              type="date"
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleReceber}>
            Receber
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalReceberParcela;
