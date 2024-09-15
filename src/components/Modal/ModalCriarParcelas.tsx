import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import { NumericFormat } from 'react-number-format';
import api from '../../api/axios';
import '../../styles/ModalCriarParcelas.css';

interface ModalCriarParcelaProps {
  show: boolean;
  onClose: () => void;
}

interface ClienteOption {
  value: number;
  label: string;
}

interface ProdutoOption {
  value: number;
  label: string;
}

const ModalCriarParcela: React.FC<ModalCriarParcelaProps> = ({
  show,
  onClose,
}) => {
  const [novoIntervalo, setNovoIntervalo] = useState<string>('MENSAL');
  const [numeroParcelas, setNumeroParcelas] = useState<number>(1);
  const [valorTotalProduto, setValorTotalProduto] = useState<number>(0);
  const [clientes, setClientes] = useState<ClienteOption[]>([]);
  const [produtos, setProdutos] = useState<ProdutoOption[]>([]);
  const [clienteSelecionado, setClienteSelecionado] =
    useState<ClienteOption | null>(null);
  const [produtoSelecionado, setProdutoSelecionado] =
    useState<ProdutoOption | null>(null);
  const [dataVencimento, setDataVencimento] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [documento, setDocumento] = useState<string>('');

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get('/clientes');
        const options = response.data.map((cliente: any) => ({
          value: cliente.clienteId,
          label: cliente.clienteNome,
        }));
        setClientes(options);
      } catch (error) {
        console.error('Erro ao buscar clientes', error);
      }
    };

    const fetchProdutos = async () => {
      try {
        const response = await api.get('/produtos');
        const options = response.data.map((produto: any) => ({
          value: produto.produtoId,
          label: produto.produtoNome,
        }));
        setProdutos(options);
      } catch (error) {
        console.error('Erro ao buscar produtos', error);
      }
    };

    fetchClientes();
    fetchProdutos();
  }, []);

  useEffect(() => {
    const fetchProdutoDetalhes = async () => {
      if (produtoSelecionado) {
        try {
          const response = await api.get(
            `/produtos/${produtoSelecionado.value}`
          );
          const produto = response.data;
          setValorTotalProduto(produto.produtoValorTotal);
        } catch (error) {
          console.error('Erro ao buscar detalhes do produto', error);
        }
      }
    };

    fetchProdutoDetalhes();
  }, [produtoSelecionado]);

  useEffect(() => {
    if (!show) {
      setNovoIntervalo('MENSAL');
      setNumeroParcelas(1);
      setDataVencimento(new Date().toISOString().split('T')[0]);
      setValorTotalProduto(0);
      setClienteSelecionado(null);
      setProdutoSelecionado(null);
      setDocumento('');
    }
  }, [show]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!clienteSelecionado) errors.cliente = 'Cliente é obrigatório';
    if (!produtoSelecionado) errors.produto = 'Produto é obrigatório';
    if (valorTotalProduto <= 0)
      errors.valorTotalProduto = 'Valor Total do Produto é obrigatório';
    if (!dataVencimento)
      errors.dataVencimento = 'Data de Vencimento é obrigatória';
    if (!documento) errors.documento = 'Documento é obrigatório';
    return errors;
  };

  const handleCriarParcela = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await api.post('/parcelas', {
        clienteId: clienteSelecionado?.value,
        produtoId: produtoSelecionado?.value,
        valorTotalProduto,
        numeroParcelas,
        intervalo: novoIntervalo,
        dataCriacao: new Date().toISOString().split('T')[0],
        dataVencimento,
        emitenteId: 1,
        documento,
      });
      onClose();
    } catch (error) {
      console.error('Erro ao criar parcela', error);
    }
  };

  const handleClienteChange = (selectedOption: any) => {
    setClienteSelecionado(selectedOption);
    setFormErrors(prevErrors => ({ ...prevErrors, cliente: '' }));
  };

  const handleProdutoChange = (selectedOption: any) => {
    setProdutoSelecionado(selectedOption);
    setFormErrors(prevErrors => ({ ...prevErrors, produto: '' }));
  };

  const handleValorTotalProdutoChange = (values: any) => {
    const valorEmReais = values.floatValue || 0;
    setValorTotalProduto(Math.round(valorEmReais * 100));
    setFormErrors(prevErrors => ({ ...prevErrors, valorTotalProduto: '' }));
  };

  const handleDataVencimentoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDataVencimento(e.target.value);
    setFormErrors(prevErrors => ({ ...prevErrors, dataVencimento: '' }));
  };

  const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumento(e.target.value);
    setFormErrors(prevErrors => ({ ...prevErrors, documento: '' }));
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Criar Parcela</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId='formDocumento'>
            <Form.Label>Documento</Form.Label>
            <Form.Control
              type='text'
              value={documento}
              onChange={handleDocumentoChange}
              placeholder='Digite o documento'
              className={formErrors.documento ? 'is-invalid' : ''}
            />
            {formErrors.documento && (
              <Form.Text className='text-danger'>
                {formErrors.documento}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId='formCliente'>
            <Form.Label>Cliente</Form.Label>
            <Select
              value={clienteSelecionado}
              onChange={handleClienteChange}
              options={clientes}
              placeholder='Digite o nome do cliente'
              noOptionsMessage={() => 'Nenhum cliente encontrado'}
              classNamePrefix='react-select'
              className={formErrors.cliente ? 'select-error' : ''}
            />
            {formErrors.cliente && (
              <Form.Text className='text-danger'>
                {formErrors.cliente}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId='formProduto'>
            <Form.Label>Produto</Form.Label>
            <Select
              value={produtoSelecionado}
              onChange={handleProdutoChange}
              options={produtos}
              placeholder='Selecione o produto'
              noOptionsMessage={() => 'Nenhum produto encontrado'}
              classNamePrefix='react-select'
              className={formErrors.produto ? 'select-error' : ''}
            />
            {formErrors.produto && (
              <Form.Text className='text-danger'>
                {formErrors.produto}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId='formValorTotalProduto'>
            <Form.Label>Valor Total do Produto</Form.Label>
            <NumericFormat
              value={valorTotalProduto / 100}
              thousandSeparator='.'
              decimalSeparator=','
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              prefix='R$ '
              onValueChange={handleValorTotalProdutoChange}
              placeholder='Digite o valor total do produto'
              className={`form-control ${
                formErrors.valorTotalProduto ? 'is-invalid' : ''
              }`}
            />
            {formErrors.valorTotalProduto && (
              <Form.Text className='text-danger'>
                {formErrors.valorTotalProduto}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId='formIntervalo'>
            <Form.Label>Intervalo</Form.Label>
            <Form.Control
              as='select'
              value={novoIntervalo}
              onChange={e => setNovoIntervalo(e.target.value)}
            >
              <option value='MENSAL'>Mensal</option>
              <option value='ANUAL'>Anual</option>
              <option value='OUTRO'>Outro</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='formNumeroParcelas'>
            <Form.Label>Número de Parcelas</Form.Label>
            <Form.Control
              type='number'
              value={numeroParcelas}
              onChange={e => setNumeroParcelas(Number(e.target.value))}
            />
          </Form.Group>

          <Form.Group controlId='formDataVencimento'>
            <Form.Label>Data de Vencimento</Form.Label>
            <Form.Control
              type='date'
              value={dataVencimento}
              onChange={handleDataVencimentoChange}
            />
            {formErrors.dataVencimento && (
              <Form.Text className='text-danger'>
                {formErrors.dataVencimento}
              </Form.Text>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onClose}>
          Cancelar
        </Button>
        <Button variant='primary' onClick={handleCriarParcela}>
          Criar Parcela
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCriarParcela;
