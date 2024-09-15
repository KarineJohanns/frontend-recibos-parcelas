import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';
import api from '../../api/axios';
import { format, parse, isValid } from 'date-fns'; // Importar funções para manipulação de data

interface ModalRenegociacaoProps {
  show: boolean;
  onClose: () => void;
  parcelaId: number;
}

const ModalRenegociacao: React.FC<ModalRenegociacaoProps> = ({
  show,
  onClose,
  parcelaId,
}) => {
  const [numeroParcelas, setNumeroParcelas] = useState<number>(1);
  const [novoIntervalo, setNovoIntervalo] = useState<string>('MENSAL');
  const [dataPrimeiraParcela, setDataPrimeiraParcela] = useState<Date | null>(null);
  const [valorTotalParcela, setValorTotalParcela] = useState<number>(0);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchParcelaDetalhes = async () => {
      if (parcelaId) {
        try {
          const response = await api.get(`/parcelas/${parcelaId}`);
          const parcela = response.data;
          console.log('Detalhes da parcela:', parcela);
          setNumeroParcelas(1); // Ajustar conforme a lógica
          setNovoIntervalo(parcela.intervalo);
          setValorTotalParcela(parcela.valorParcela);
          setDataPrimeiraParcela(format(new Date(parcela.dataVencimento), 'yyyy-MM-dd'));
        } catch (error) {
          console.error('Erro ao buscar detalhes da parcela', error);
        }
      }
    };

    fetchParcelaDetalhes();
  }, [parcelaId]);

  useEffect(() => {
    if (!show) {
      // Resetar os estados quando o modal for fechado
      setNumeroParcelas(1);
      setNovoIntervalo('MENSAL');
      setDataPrimeiraParcela(null);
      setValorTotalParcela(0);
    }
  }, [show]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (valorTotalParcela <= 0) errors.valorTotalParcela = 'Valor Total da Parcela é obrigatório';
    if (!dataPrimeiraParcela) errors.dataPrimeiraParcela = 'Data da Primeira Parcela é obrigatória';
    return errors;
  };

  const handleRenegociar = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {

      await api.patch(`/parcelas/${parcelaId}/escolha`, {
        gerarNovasParcelas: true,
        numeroParcelasRenegociacao: numeroParcelas,
        novoIntervalo,
        dataPrimeiraParcela,
        valorTotalParcela, // Incluir o valor total da parcela na requisição
      });
      onClose(); // Fecha o modal após a renegociação
    } catch (error) {
      console.error('Erro ao renegociar parcela', error);
    }
  };

  const handleValorTotalParcelaChange = (values: any) => {
    const valorEmReais = values.floatValue || 0;
    setValorTotalParcela(Math.round(valorEmReais * 100));
    setFormErrors(prevErrors => ({ ...prevErrors, valorTotalParcela: '' }));
  };

  const handleDataPrimeiraParcelaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataPrimeiraParcela(e.target.value);
    setFormErrors(prevErrors => ({ ...prevErrors, dataPrimeiraParcela: '' }));
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Renegociar Parcela</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId='formNumeroParcelas'>
            <Form.Label>Número de Parcelas</Form.Label>
            <Form.Control
              type='number'
              min='1'
              value={numeroParcelas}
              onChange={e => setNumeroParcelas(Number(e.target.value))}
            />
          </Form.Group>

          <Form.Group controlId='formNovoIntervalo'>
            <Form.Label>Intervalo</Form.Label>
            <Form.Control
              as='select'
              value={novoIntervalo}
              onChange={e => setNovoIntervalo(e.target.value)}
            >
              <option value='MENSAL'>Mensal</option>
              <option value='ANUAL'>Anual</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='formDataPrimeiraParcela'>
            <Form.Label>Data da Primeira Parcela</Form.Label>
            <Form.Control
            type='date'
              onChange={handleDataPrimeiraParcelaChange}
              value={dataPrimeiraParcela}
              className={`form-control ${formErrors.dataPrimeiraParcela ? 'is-invalid' : ''}`}
            />
            {formErrors.dataPrimeiraParcela && (
              <Form.Text className='text-danger'>
                {formErrors.dataPrimeiraParcela}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId='formValorTotalParcela'>
            <Form.Label>Valor Total da Parcela</Form.Label>
            <NumericFormat
              value={valorTotalParcela / 100} // Exibindo em reais
              thousandSeparator='.'
              decimalSeparator=','
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              prefix='R$ '
              onValueChange={handleValorTotalParcelaChange}
              placeholder='Digite o valor total da parcela.'
              className={`form-control ${formErrors.valorTotalParcela ? 'is-invalid' : ''}`}
            />
            {formErrors.valorTotalParcela && (
              <Form.Text className='text-danger'>
                {formErrors.valorTotalParcela}
              </Form.Text>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onClose}>
          Fechar
        </Button>
        <Button variant='primary' onClick={handleRenegociar}>
          Renegociar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRenegociacao;
