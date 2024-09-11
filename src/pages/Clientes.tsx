import React, { useState, useEffect } from 'react';
import Menu from '../components/Menu';
import { Button, Form, Dropdown, Row, Col, Modal } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import api from '../api/axios';
import '../styles/Cliente.css';
import InputMask from 'react-input-mask'; // Importar InputMask

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
  const [showModal, setShowModal] = useState(false); // Estado para o modal de mensagens
  const [modalMessage, setModalMessage] = useState(''); // Mensagem do modal
  const [showCadastroModal, setShowCadastroModal] = useState(false); // Modal para cadastrar cliente
  const [novoCliente, setNovoCliente] = useState({
    clienteNome: '',
    clienteCpf: '',
    clienteEndereco: '',
    clienteTelefone: ''
  }); // Estado do formulário de novo cliente

  const [formErrors, setFormErrors] = useState({
    clienteNome: '',
    clienteCpf: '',
    clienteEndereco: '',
    clienteTelefone: ''
  }); // Estado para mensagens de erro de validação

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
    // Limpa o formulário e as mensagens de erro ao fechar o modal
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
      
      // Define a mensagem do backend para o modal
      setModalMessage(response.data.message); 
      setShowModal(true);
  
      // Se a operação foi bem-sucedida, remove o cliente da lista
      if (response.data.success) {
        setClientes(clientes.filter(cliente => cliente.clienteId !== id));
      }
    } catch (error: any) {
      // Caso o backend envie uma mensagem de erro no formato de resposta esperada
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
            // Atualizar a lista de clientes após o cadastro
            const clienteAdicionado: Cliente = {
                clienteId: Date.now(), // Simulação de ID gerado
                ...novoCliente,
            };
            setClientes([...clientes, clienteAdicionado]);

            // Fecha o modal de cadastro após o sucesso
            setShowCadastroModal(false);
        }
    } catch (error) {
        // Verifica se o erro é uma instância de AxiosError
        if (error.response) {
            // O backend retornou uma resposta de erro
            setModalMessage(error.response.data.message || 'Erro ao cadastrar cliente.');
            setShowCadastroModal(false);
        } else {
          
            // Erro sem resposta (ex: problema de rede)
            setModalMessage('Erro ao cadastrar cliente.');
        }
        // Mostra o modal de mensagem de erro
        setShowModal(true);
        // Garante que o modal de cadastro permaneça aberto
        setShowCadastroModal(true);
    }
};


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovoCliente({
      ...novoCliente,
      [e.target.name]: e.target.value
    });
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

                    <Dropdown.Item>
                      Editar
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal para exibir mensagens */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Informação</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para cadastrar novo cliente */}
      <Modal show={showCadastroModal} onHide={() => setShowCadastroModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Novo Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="clienteNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="clienteNome"
                value={novoCliente.clienteNome}
                onChange={handleInputChange}
                placeholder="Digite o nome do cliente"
                className={formErrors.clienteNome ? 'is-invalid' : ''}
              />
              {formErrors.clienteNome && (
                <div className="invalid-feedback">{formErrors.clienteNome}</div>
              )}
            </Form.Group>

            <Form.Group controlId="clienteCpf">
              <Form.Label>CPF/CNPJ</Form.Label>
              <InputMask
                mask={novoCliente.clienteCpf.length > 14 ? '99.999.999/9999-99' : '999.999.999-99'}
                value={novoCliente.clienteCpf}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNovoCliente({
                  ...novoCliente,
                  clienteCpf: e.target.value
                })}
                placeholder="Digite o CPF ou CNPJ"
                className={`form-control ${formErrors.clienteCpf ? 'is-invalid' : ''}`}
              />
              {formErrors.clienteCpf && (
                <div className="invalid-feedback">{formErrors.clienteCpf}</div>
              )}
            </Form.Group>

            <Form.Group controlId="clienteEndereco">
              <Form.Label>Endereço</Form.Label>
              <Form.Control
                type="text"
                name="clienteEndereco"
                value={novoCliente.clienteEndereco}
                onChange={handleInputChange}
                placeholder="Digite o endereço"
                className={formErrors.clienteEndereco ? 'is-invalid' : ''}
              />
              {formErrors.clienteEndereco && (
                <div className="invalid-feedback">{formErrors.clienteEndereco}</div>
              )}
            </Form.Group>

            <Form.Group controlId="clienteTelefone">
              <Form.Label>Telefone</Form.Label>
              <InputMask
                mask="(99) 99999-9999"
                value={novoCliente.clienteTelefone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNovoCliente({
                  ...novoCliente,
                  clienteTelefone: e.target.value
                })}
                placeholder="Digite o telefone"
                className={`form-control ${formErrors.clienteTelefone ? 'is-invalid' : ''}`}
              />
              {formErrors.clienteTelefone && (
                <div className="invalid-feedback">{formErrors.clienteTelefone}</div>
              )}
            </Form.Group>

            <Button variant="primary" onClick={handleCadastrarCliente}>
              Cadastrar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Clientes;
