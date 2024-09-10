import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../api/axios';

interface ModalRenegociarParcelaProps {
  show: boolean;
  onClose: () => void;
  parcelaId: number;
  onRenegociacaoFinalizada: (mensagem: string) => void;
}

const ModalRenegociarParcela: React.FC<ModalRenegociarParcelaProps> = ({
  show,
  onClose,
  parcelaId,
  onRenegociacaoFinalizada
}) => {
  const [numeroParcelas, setNumeroParcelas] = useState<number>(1);
  const [intervalo, setIntervalo] = useState<string>('MENSAL');
  const [dataPrimeiraParcela, setDataPrimeiraParcela] = useState<string>('');

  useEffect(() => {
    if (show) {
      const dataAtual = new Date().toISOString().split('T')[0];
      setDataPrimeiraParcela(dataAtual);
    }
  }, [show]);

  const handleRenegociar = async () => {
    try {
      const response = await api.patch(`/parcelas/${parcelaId}/escolha`, {
        gerarNovasParcelas: true,
        numeroParcelasRenegociacao: numeroParcelas,
        novoIntervalo: intervalo,
        dataPrimeiraParcela
      });

      const { mensagem } = response.data;

      onRenegociacaoFinalizada(mensagem); // Retorna a mensagem de sucesso para o modal de confirmação
    } catch (error) {
      console.error('Erro ao renegociar parcelas', error);
    }
  };

  const handleClose = () => {
    onClose(); // Fecha o modal de renegociação e chama a função de fechamento do pai
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Renegociar Parcelas</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId='formNumeroParcelas'>
            <Form.Label>Número de Parcelas</Form.Label>
            <Form.Control
              type='number'
              value={numeroParcelas}
              onChange={(e) => setNumeroParcelas(parseInt(e.target.value))}
              min={1}
            />
          </Form.Group>

          <Form.Group controlId='formIntervalo'>
            <Form.Label>Intervalo</Form.Label>
            <Form.Control
              as='select'
              value={intervalo}
              onChange={(e) => setIntervalo(e.target.value)}
            >
              <option value='MENSAL'>Mensal</option>
              <option value='SEMANAL'>Semanal</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='formDataPrimeiraParcela'>
            <Form.Label>Data da Primeira Parcela</Form.Label>
            <Form.Control
              type='date'
              value={dataPrimeiraParcela}
              onChange={(e) => setDataPrimeiraParcela(e.target.value)}
            />
          </Form.Group>

          <Button variant='primary' onClick={handleRenegociar}>
            Renegociar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalRenegociarParcela;
