import React, { useState, useEffect } from 'react';
import Menu from '../components/Menu';
import { Button, Form, Dropdown, Row, Col, Modal } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import api from '../api/axios';
import '../styles/Cliente.css';
import InputMask from 'react-input-mask';

interface Cliente {
  clienteId: number;
  clienteNome: string;
  clienteCpf: string;
  clienteEndereco: string;
  clienteTelefone: string;
}

interface ApiResponse {
  message: string;
  success: boolean;
}

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showCadastroModal, setShowCadastroModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [novoCliente, setNovoCliente] = useState({
    clienteNome: '',
    clienteCpf: '',
    clienteEndereco: '',
    clienteTelefone: ''
  });
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [formErrors, setFormErrors] = useState({
    clienteNome: '',
    clienteCpf: '',
    clienteEndereco: '',
    clienteTelefone: ''
  });

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get('/clientes');
        setClientes(response.data);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    if (!showCadastroModal) {
      setNovoCliente({
        clienteNome: '',
        clienteCpf: '',
        clienteEndereco: '',
        clienteTelefone: ''
      });
      setFormErrors({
        clienteNome: '',
        clienteCpf: '',
        clienteEndereco: '',
        clienteTelefone: ''
      });
    }
  }, [showCadastroModal]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await api.delete<ApiResponse>(`/clientes/${id}`);
      setModalMessage(response.data.message);
      setShowModal(true);

      if (response.data.success) {
        setClientes(clientes.filter(cliente => cliente.clienteId !== id));
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setModalMessage(error.response.data.message);
      } else {
        setModalMessage('Erro ao excluir cliente.');
      }
      setShowModal(true);
    }
  };

  const validateForm = () => {
    const errors = {
      clienteNome: novoCliente.clienteNome ? '' : 'Nome é obrigatório',
      clienteCpf: novoCliente.clienteCpf ? '' : 'CPF/CNPJ é obrigatório',
      clienteEndereco: novoCliente.clienteEndereco ? '' : 'Endereço é obrigatório',
      clienteTelefone: novoCliente.clienteTelefone ? '' : 'Telefone é obrigatório'
    };
    setFormErrors(errors);
    return Object.values(errors).every(error => error === '');
  };

  const handleCadastrarCliente = async () => {
    if (!validateForm()) return;

    try {
      const response = await api.post<ApiResponse>('/clientes', novoCliente);
      setModalMessage(response.data.message);
      setShowModal(true);

      if (response.data.success) {
        const clienteAdicionado: Cliente = {
          clienteId: Date.now(),
          ...novoCliente,
        };
        setClientes([...clientes, clienteAdicionado]);
        setShowCadastroModal(false);
      }
    } catch (error) {
      if (error.response) {
        setModalMessage(error.response.data.message || 'Erro ao cadastrar cliente.');
        setShowCadastroModal(false);
      } else {
        setModalMessage('Erro ao cadastrar cliente.');
      }
      setShowModal(true);
      setShowCadastroModal(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovoCliente({
      ...novoCliente,
      [e.target.name]: e.target.value
    });
  };

  const handleEditClick = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setShowEditModal(true);
  };

  const handleUpdateCliente = async () => {
    if (!clienteEditando) return;

    try {
      const response = await api.patch<ApiResponse>(`/clientes/${clienteEditando.clienteId}`, clienteEditando);
      setModalMessage(response.data.message);
      setShowModal(true);

      if (response.data.success) {
        setClientes(clientes.map(cliente =>
          cliente.clienteId === clienteEditando.clienteId ? clienteEditando : cliente
        ));
        setShowEditModal(false);
      }
    } catch (error) {
      if (error.response) {
        setModalMessage(error.response.data.message || 'Erro ao editar cliente.');
      } else {
        setModalMessage('Erro ao editar cliente.');
      }
      setShowModal(true);
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.clienteNome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className=''>
      <div className='col-md-3'>
        <Menu />
      </div>
      <div className='col-md-9'>
        <div className='cliente-list-container'>
          <div className='cliente-list-header'>
            <h1>Clientes</h1>
            <Row className='align-items-center mb-3'>
              <Col md={6}>
                <Form.Control
                  className='form-clientes'
                  type='text'
                  placeholder='Buscar por nome'
                  value={search}
                  onChange={handleSearchChange}
                />
              </Col>
              <Col md={3} className='text-end'>
                <Button variant='primary' onClick={() => setShowCadastroModal(true)}>
                  Criar Novo Cliente
                </Button>
              </Col>
            </Row>
          </div>
          <div className='clientes-list'>
            {filteredClientes.map(cliente => (
              <div key={cliente.clienteId} className='cliente-item d-flex justify-content-between align-items-center mb-2 p-3'>
                <div className='info'>
                  <h5 className='cliente-nome'>{cliente.clienteNome}</h5>
                  <div>Telefone: {cliente.clienteTelefone}</div>
                  <div>CPF/CNPJ: {cliente.clienteCpf}</div>
                  <div>Endereço: {cliente.clienteEndereco}</div>
                </div>
                <Dropdown>
                  <Dropdown.Toggle
                    className='custom-dropdown-toggle'
                    variant='link'
                    id='dropdown-basic'
                  >
                    <ThreeDotsVertical size={24} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleDelete(cliente.clienteId)}>
                      Excluir
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleEditClick(cliente)}>
                      Editar
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal show={showCadastroModal} onHide={() => setShowCadastroModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Novo Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3' controlId='formClienteNome'>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type='text'
                name='clienteNome'
                value={novoCliente.clienteNome}
                onChange={handleInputChange}
                isInvalid={!!formErrors.clienteNome}
              />
              <Form.Control.Feedback type='invalid'>
                {formErrors.clienteNome}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formClienteCpf'>
              <Form.Label>CPF/CNPJ</Form.Label>
              <InputMask
                mask='999.999.999-99'
                value={novoCliente.clienteCpf}
                onChange={handleInputChange}
                name='clienteCpf'
              >
                {inputProps => <Form.Control {...inputProps} />}
              </InputMask>
              <Form.Control.Feedback type='invalid'>
                {formErrors.clienteCpf}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formClienteEndereco'>
              <Form.Label>Endereço</Form.Label>
              <Form.Control
                type='text'
                name='clienteEndereco'
                value={novoCliente.clienteEndereco}
                onChange={handleInputChange}
                isInvalid={!!formErrors.clienteEndereco}
              />
              <Form.Control.Feedback type='invalid'>
                {formErrors.clienteEndereco}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formClienteTelefone'>
              <Form.Label>Telefone</Form.Label>
              <InputMask
                mask='(99) 99999-9999'
                value={novoCliente.clienteTelefone}
                onChange={handleInputChange}
                name='clienteTelefone'
              >
                {inputProps => <Form.Control {...inputProps} />}
              </InputMask>
              <Form.Control.Feedback type='invalid'>
                {formErrors.clienteTelefone}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant='primary' onClick={handleCadastrarCliente}>
              Cadastrar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {clienteEditando && (
            <Form>
              <Form.Group className='mb-3' controlId='formClienteNomeEdit'>
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type='text'
                  value={clienteEditando.clienteNome}
                  onChange={(e) => setClienteEditando({ ...clienteEditando, clienteNome: e.target.value })}
                />
              </Form.Group>
              <Form.Group className='mb-3' controlId='formClienteCpfEdit'>
                <Form.Label>CPF/CNPJ</Form.Label>
                <InputMask
                  mask='999.999.999-99'
                  value={clienteEditando.clienteCpf}
                  onChange={(e) => setClienteEditando({ ...clienteEditando, clienteCpf: e.target.value })}
                >
                  {inputProps => <Form.Control {...inputProps} />}
                </InputMask>
              </Form.Group>
              <Form.Group className='mb-3' controlId='formClienteEnderecoEdit'>
                <Form.Label>Endereço</Form.Label>
                <Form.Control
                  type='text'
                  value={clienteEditando.clienteEndereco}
                  onChange={(e) => setClienteEditando({ ...clienteEditando, clienteEndereco: e.target.value })}
                />
              </Form.Group>
              <Form.Group className='mb-3' controlId='formClienteTelefoneEdit'>
                <Form.Label>Telefone</Form.Label>
                <InputMask
                  mask='(99) 99999-9999'
                  value={clienteEditando.clienteTelefone}
                  onChange={(e) => setClienteEditando({ ...clienteEditando, clienteTelefone: e.target.value })}
                >
                  {inputProps => <Form.Control {...inputProps} />}
                </InputMask>
              </Form.Group>
              <Button variant='primary' onClick={handleUpdateCliente}>
                Atualizar
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Mensagem</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Clientes;
