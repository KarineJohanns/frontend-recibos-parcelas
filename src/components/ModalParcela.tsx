// src/components/ModalParcela.tsx
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../api/axios';

interface ModalParcelaProps {
  show: boolean;
  onClose: () => void;
  parcelaId: number;
}

const ModalParcela: React.FC<ModalParcelaProps> = ({ show, onClose, parcelaId }) => {
  const [valorPago, setValorPago] = useState<number>(0);
  const [dataPagamento, setDataPagamento] = useState<string>('');
  const [showNovoModal, setShowNovoModal] = useState<boolean>(false);
  const [novoIntervalo, setNovoIntervalo] = useState<string>('MENSAL');
  const [numeroParcelas, setNumeroParcelas] = useState<number>(1);
  const [dataPrimeiraParcela, setDataPrimeiraParcela] = useState<string>('');

  const handleReceber = async () => {
    try {
      const response = await api.post(`/parcelas/${parcelaId}/receber`, {
        valorPago,
        dataPagamento
      });

      if (valorPago < response.data.valorTotalParcela) {
        setShowNovoModal(true);
      } else {
        onClose();
        window.location.reload(); // Recarregar a página
      }
    } catch (error) {
      console.error('Erro ao receber parcela', error);
    }
  };

  const handleGerarNovasParcelas = async () => {
    try {
      await api.post(`/parcelas/${parcelaId}/renegociar`, {
        numeroParcelas,
        novoIntervalo,
        dataPrimeiraParcela
      });
      onClose();
      window.location.reload(); // Recarregar a página
    } catch (error) {
      console.error('Erro ao gerar novas parcelas', error);
    }
  };

  return (
    <>
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

      {/* Modal para gerar novas parcelas */}
      <Modal show={showNovoModal} onHide={() => setShowNovoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Gerar Novas Parcelas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNumeroParcelas">
              <Form.Label>Número de Parcelas</Form.Label>
              <Form.Control
                type="number"
                value={numeroParcelas}
                onChange={(e) => setNumeroParcelas(Number(e.target.value))}
              />
            </Form.Group>
            <Form.Group controlId="formNovoIntervalo">
              <Form.Label>Intervalo</Form.Label>
              <Form.Control
                as="select"
                value={novoIntervalo}
                onChange={(e) => setNovoIntervalo(e.target.value)}
              >
                <option value="SEMANAL">Semanal</option>
                <option value="MENSAL">Mensal</option>
                <option value="BIMESTRAL">Bimestral</option>
                <option value="TRIMESTRAL">Trimestral</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formDataPrimeiraParcela">
              <Form.Label>Data da Primeira Parcela</Form.Label>
              <Form.Control
                type="date"
                value={dataPrimeiraParcela}
                onChange={(e) => setDataPrimeiraParcela(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleGerarNovasParcelas}>
              Gerar Novas Parcelas
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalParcela;
