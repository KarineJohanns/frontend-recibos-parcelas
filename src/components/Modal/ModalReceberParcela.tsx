import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';
import api from '../../api/axios';

interface ModalReceberParcelaProps {
  show: boolean;
  onClose: () => void;
  parcelaId: number;
}

const ModalReceberParcela: React.FC<ModalReceberParcelaProps> = ({
  show,
  onClose,
  parcelaId
}) => {
  const [valorTotalParcela, setValorTotalParcela] = useState<number>(0);
  const [valorPago, setValorPago] = useState<number>(0);
  const [dataPagamento, setDataPagamento] = useState<string>('');
  const [escolhaNecessaria, setEscolhaNecessaria] = useState<boolean>(false);
  const [mensagemEscolha, setMensagemEscolha] = useState<string>('');
  const [showConfirmacao, setShowConfirmacao] = useState<boolean>(false);
  const [mensagemConfirmacao, setMensagemConfirmacao] = useState<string>('');

  useEffect(() => {
    const fetchParcelaDetalhes = async () => {
      try {
        const response = await api.get(`/parcelas/${parcelaId}`);
        const parcela = response.data;
        setValorTotalParcela(parcela.valorParcela);
        setValorPago(parcela.valorParcela);
        setDataPagamento(new Date().toISOString().split('T')[0]); // Data atual
      } catch (error) {
        console.error('Erro ao buscar detalhes da parcela', error);
      }
    };

    if (parcelaId) {
      fetchParcelaDetalhes();
    }
  }, [parcelaId]);

  const handleValorPagoChange = (values: any) => {
    const valorEmReais = values.floatValue || 0;
    setValorPago(Math.round(valorEmReais * 100));
  };

  const handleReceber = async () => {
    try {
      const response = await api.patch(`/parcelas/${parcelaId}/pagar`, {
        valorPago,
        dataPagamento
      });

      const { escolhaNecessaria, mensagem } = response.data;

      if (escolhaNecessaria) {
        setEscolhaNecessaria(true);  // Exibe o modal de escolha
        setMensagemEscolha(mensagem); // Define a mensagem
      } else {
        setMensagemConfirmacao(mensagem); // Mensagem de confirmação de pagamento completo
        setShowConfirmacao(true); // Exibe o modal de confirmação
      }
    } catch (error) {
      console.error('Erro ao receber parcela', error);
    }
  };

  const handleAplicarDesconto = async () => {
    try {
      const response = await api.patch(`/parcelas/${parcelaId}/escolha`, {
        gerarNovasParcelas: false
      });

      const { mensagem } = response.data;

      setEscolhaNecessaria(false); // Fecha o modal de escolha
      setMensagemConfirmacao(mensagem); // Mensagem de confirmação de desconto aplicado
      setShowConfirmacao(true); // Exibe o modal de confirmação
    } catch (error) {
      console.error('Erro ao aplicar desconto', error);
    }
  };

  const handleCloseConfirmacao = () => {
    setShowConfirmacao(false);
    onClose(); // Fecha o modal de pagamento
  };

  return (
    <>
      {/* Modal de Pagar Parcela */}
      <Modal show={show && !escolhaNecessaria && !showConfirmacao} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Receber Parcela</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='formValorPago'>
              <Form.Label>Valor Pago</Form.Label>
              <NumericFormat
                value={valorPago / 100} // Exibindo em reais
                thousandSeparator='.'
                decimalSeparator=','
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                prefix='R$ '
                onValueChange={handleValorPagoChange}
                placeholder='Digite o valor pago'
                className='form-control'
              />
            </Form.Group>

            <Form.Group controlId='formDataPagamento'>
              <Form.Label>Data de Pagamento</Form.Label>
              <Form.Control
                type='date'
                value={dataPagamento}
                onChange={(e) => setDataPagamento(e.target.value)}
              />
            </Form.Group>

            <Button variant='primary' onClick={handleReceber}>
              Receber
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de Escolha Necessária */}
      <Modal show={escolhaNecessaria} onHide={() => setEscolhaNecessaria(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Escolha Necessária</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{mensagemEscolha}</p>
          <Button variant='primary' onClick={handleAplicarDesconto}>
            Aplicar Desconto
          </Button>
          <Button variant='secondary' onClick={() => setEscolhaNecessaria(false)}>
            Gerar Novas Parcelas
          </Button>
        </Modal.Body>
      </Modal>

      {/* Modal de Confirmação */}
      <Modal show={showConfirmacao} onHide={handleCloseConfirmacao}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação de Pagamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{mensagemConfirmacao}</p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalReceberParcela;
