import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import { NumericFormat } from 'react-number-format';
import api from '../../api/axios';
import { format, parse, isValid } from 'date-fns'; // Importar funções para manipulação de data
import '../../styles/ModalCriarParcelas.css';

interface ModalEditarParcelaProps {
  show: boolean;
  onClose: () => void;
  parcelaId: number;
}

interface ClienteOption {
  value: number;
  label: string;
}

interface ProdutoOption {
  value: number;
  label: string;
}

const ModalEditarParcela: React.FC<ModalEditarParcelaProps> = ({
  show,
  onClose,
  parcelaId,
}) => {
  const [novoIntervalo, setNovoIntervalo] = useState<string>('MENSAL');
  const [numeroParcelas, setNumeroParcelas] = useState<number>(1);
  const [valorParcela, setValorParcela] = useState<number>(0);
  const [clientes, setClientes] = useState<ClienteOption[]>([]);
  const [produtos, setProdutos] = useState<ProdutoOption[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteOption | null>(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoOption | null>(null);
  const [dataVencimento, setDataVencimento] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

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
    const fetchParcelaDetalhes = async () => {
      if (parcelaId) {
        try {
          const response = await api.get(`/parcelas/${parcelaId}`);
          const parcela = response.data;
          setNovoIntervalo(parcela.intervalo);
          setNumeroParcelas(1);
          setValorParcela(parcela.valorParcela);
          // Converter a data do formato yyyy-MM-dd para dd/MM/yyyy
          setDataVencimento(format(new Date(parcela.dataVencimento), 'dd/MM/yyyy'));
          setClienteSelecionado({ value: parcela.cliente.clienteId, label: parcela.cliente.clienteNome });
          setProdutoSelecionado({ value: parcela.produto.produtoId, label: parcela.produto.produtoNome });
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
      setNovoIntervalo('MENSAL');
      setNumeroParcelas(1);
      setDataVencimento('');
      setValorParcela(0);
      setClienteSelecionado(null);
      setProdutoSelecionado(null);
    }
  }, [show]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (valorParcela <= 0) errors.valorParcela = 'Valor da Parcela é obrigatório';
    if (!dataVencimento) errors.dataVencimento = 'Data de Vencimento é obrigatória';
    return errors;
  };

  const handleEditarParcela = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Converter a data do formato dd/MM/yyyy para yyyy-MM-dd
      const dataVencimentoFormatada = format(parse(dataVencimento, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd');

      await api.patch(`/parcelas/${parcelaId}`, {
        clienteId: clienteSelecionado?.value,
        produtoId: produtoSelecionado?.value,
        valorParcela,
        numeroParcelas,
        intervalo: novoIntervalo,
        dataVencimento: dataVencimentoFormatada,
      });
      onClose(); // Fecha o modal
    } catch (error) {
      console.error('Erro ao editar parcela', error);
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

  const handleValorParcelaChange = (values: any) => {
    const valorEmReais = values.floatValue || 0;
    setValorParcela(Math.round(valorEmReais * 100));
    setFormErrors(prevErrors => ({ ...prevErrors, valorParcela: '' }));
  };

  const handleDataVencimentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataVencimento(e.target.value);
    setFormErrors(prevErrors => ({ ...prevErrors, dataVencimento: '' }));
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Parcela</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId='formCliente'>
            <Form.Label>Cliente</Form.Label>
            <Select
              value={clienteSelecionado}
              onChange={handleClienteChange}
              options={clientes}
              isDisabled
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
              isDisabled
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

          <Form.Group controlId='formValorParcela'>
            <Form.Label>Valor da Parcela</Form.Label>
            <NumericFormat
              value={valorParcela / 100} // Exibindo em reais
              thousandSeparator='.'
              decimalSeparator=','
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              prefix='R$ '
              onValueChange={handleValorParcelaChange}
              placeholder='Digite o valor da parcela.'
              className={`form-control ${
                formErrors.valorParcela ? 'is-invalid' : ''
              }`}
            />
            {formErrors.valorParcela && (
              <Form.Text className='text-danger'>
                {formErrors.valorParcela}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId='formDataVencimento'>
            <Form.Label>Data de Vencimento</Form.Label>
            <Form.Control
              type='text'
              value={dataVencimento}
              onChange={handleDataVencimentoChange}
              placeholder='dd/MM/yyyy'
              className={formErrors.dataVencimento ? 'is-invalid' : ''}
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
          Fechar
        </Button>
        <Button variant='primary' onClick={handleEditarParcela}>
          Salvar Alterações
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditarParcela;
