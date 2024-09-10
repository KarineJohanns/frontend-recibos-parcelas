import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';
import api from '../../api/axios';
import ModalRenegociarParcela from './ModalRenegociarParcela';
import ModalConfirmacao from './ModalConfirmacao';

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
  const [showRenegociarModal, setShowRenegociarModal] = useState<boolean>(false);

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
        setEscolhaNecessaria(true); // Exibe o modal de escolha
        setMensagemEscolha(mensagem); // Define a mensagem
      } else {
        setMensagemConfirmacao(mensagem); // Mensagem de confirmação de pagamento completo
        setShowConfirmacao(true); // Exibe o modal de confirmação
      }
    } catch (error) {
      console.error('Erro ao receber parcela', error);
    }
  };

  const handleCancelarEscolha = async () => {
    try {
      await api.patch(`/parcelas/${parcelaId}/desfazer`);
    } catch (error) {
      console.error('Erro ao desfazer escolha da parcela', error);
    }
  };

  const handleHide = async () => {
    try {
      // Chama a função assíncrona para desfazer a escolha
      await handleCancelarEscolha();
      
      // Atualiza o estado
      setEscolhaNecessaria(false);
    } catch (error) {
      console.error('Erro ao manipular o modal', error);
    }
  };
  
  const handleAplicarDesconto = async () => {
    console.log("parcela: ", parcelaId);
    try {
      const response = await api.patch(`/parcelas/${parcelaId}/escolha`, {        
        gerarNovasParcelas: false
        
      });
      console.log(parcelaId);

      const { mensagem } = response.data;

      setEscolhaNecessaria(false); // Fecha o modal de escolha
      setMensagemConfirmacao(mensagem); // Mensagem de confirmação de desconto aplicado
      setShowConfirmacao(true); // Exibe o modal de confirmação
    } catch (error) {
      console.error('Erro ao aplicar desconto', error);
    }
  };

  // Função para fechar o modal e cancelar a escolha
  const handleClose = async () => {
    try {
      await handleCancelarEscolha(); // Chama a função para desfazer a escolha
    } catch (error) {
      console.error('Erro ao manipular o modal', error);
    }
    onClose(); // Fecha o modal
  };

  const handleCloseConfirmacao = () => {
    setShowConfirmacao(false);
    onClose(); // Fecha o modal de pagamento
  };

  const handleGerarNovasParcelas = () => {
    setEscolhaNecessaria(false); // Fecha o ModalEscolhaNecessária
    setShowRenegociarModal(true); // Abre o ModalRenegociarParcela
  };

  const handleRenegociacaoFinalizada = (mensagem: string) => {
    setShowRenegociarModal(false); // Fecha o modal de renegociação
    setMensagemConfirmacao(mensagem); // Define a mensagem de confirmação
    setShowConfirmacao(true); // Abre o modal de confirmação
  };

  const handleCloseRenegociarModal = () => {
    setShowRenegociarModal(false);
    setEscolhaNecessaria(false);
    
  };

  return (
    <>
      {/* Modal de Pagar Parcela */}
      <Modal show={show && !escolhaNecessaria && !showConfirmacao} onHide={handleClose}>
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
      <Modal show={escolhaNecessaria} onHide={handleHide}>
        <Modal.Header closeButton>
          <Modal.Title>Escolha Necessária</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{mensagemEscolha}</p>
          <Button variant='primary' onClick={handleAplicarDesconto}>
            Aplicar Desconto
          </Button>
          <Button variant='secondary' onClick={handleGerarNovasParcelas}>
            Gerar Novas Parcelas
          </Button>
        </Modal.Body>
      </Modal>

      {/* Modal de Confirmação */}
      <ModalConfirmacao
        show={showConfirmacao}
        mensagem={mensagemConfirmacao}
        onClose={handleCloseConfirmacao}
      />

      {/* Modal de Renegociar Parcelas */}
      <ModalRenegociarParcela
        show={showRenegociarModal}
        onClose={handleCloseRenegociarModal}
        parcelaId={parcelaId}
        onRenegociacaoFinalizada={handleRenegociacaoFinalizada}
      />
    </>
  );
};

export default ModalReceberParcela;
