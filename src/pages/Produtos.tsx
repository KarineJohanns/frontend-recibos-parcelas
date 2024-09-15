import React, { useState, useEffect } from 'react';
import Menu from '../components/Menu';
import api from '../api/axios';
import { Button, Modal, Form, Card } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';
import '../styles/Produtos.css'; // Arquivo CSS para estilização das divs

interface Produto {
  produtoid: number;
  produtoNome: string;
  produtoDescricao: string;
  produtoValorTotal: number;
}

const Produtos: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduto, setEditProduto] = useState<Produto | null>(null);
  const [newProduto, setNewProduto] = useState({
    produtoNome: '',
    produtoDescricao: '',
    produtoValorTotal: 0,
  });

  // Carrega a lista de produtos ao montar o componente
  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  // Função para abrir o modal de criação
  const abrirAddModal = () => {
    setNewProduto({
      produtoNome: '',
      produtoDescricao: '',
      produtoValorTotal: 0,
    });
    setShowAddModal(true);
  };

  // Função para fechar o modal de criação
  const fecharAddModal = () => {
    setShowAddModal(false);
  };

  // Função para abrir o modal de edição
  const abrirEditModal = (produto: Produto) => {
    setEditProduto(produto); // Define o produto a ser editado
    setNewProduto({
      produtoNome: produto.produtoNome,
      produtoDescricao: produto.produtoDescricao,
      produtoValorTotal: produto.produtoValorTotal,
    });
    setShowEditModal(true);
  };

  // Função para fechar o modal de edição
  const fecharEditModal = () => {
    setShowEditModal(false);
    setEditProduto(null); // Limpa o estado de edição
  };

  // Função para lidar com a criação de um produto
  const criarProduto = async () => {
    try {
      await api.post('/produtos', newProduto);
      carregarProdutos();
      fecharAddModal();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
    }
  };

  // Função para lidar com a edição de um produto
  const editarProduto = async () => {
    try {
      if (editProduto && editProduto.id) {
        await api.patch(`/produtos/${editProduto.id}`, newProduto);
        carregarProdutos();
        fecharEditModal();
      } else {
        console.error('ID do produto não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao editar produto:', error);
    }
  };

  // Função para excluir um produto
  const excluirProduto = async (id: number) => {
    try {
      await api.delete(`/produtos/${id}`);
      carregarProdutos();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  return (
    <div className='d-flex'>
      <div className='col-md-3'>
        <Menu />
      </div>
      <div className='produto-list-container'>
        <div className='produto-list-header'>
          <div className='produto-list-title'>
            <h1>Produtos</h1>
            <Button variant='primary' onClick={abrirAddModal}>
              Adicionar Produto
            </Button>
          </div>
          <div className='produto-container mt-4'>
            {produtos.map(produto => (
              <Card key={produto.id} className='produto-card'>
                <Card.Body>
                  <Card.Title>{produto.produtoNome}</Card.Title>
                  <Card.Text>{produto.produtoDescricao}</Card.Text>
                  <Card.Text>
                    <strong>Valor: </strong>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(produto.produtoValorTotal / 100)}
                  </Card.Text>
                  <Button
                    variant='warning'
                    onClick={() => abrirEditModal(produto)}
                  >
                    Editar
                  </Button>{' '}
                  <Button
                    variant='danger'
                    onClick={() => excluirProduto(produto.id)}
                  >
                    Excluir
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Modal para adição de produtos */}
      <Modal show={showAddModal} onHide={fecharAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nome do Produto</Form.Label>
              <Form.Control
                type='text'
                value={newProduto.produtoNome}
                onChange={e =>
                  setNewProduto({ ...newProduto, produtoNome: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descrição do Produto</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                value={newProduto.produtoDescricao}
                onChange={e =>
                  setNewProduto({
                    ...newProduto,
                    produtoDescricao: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Valor do Produto (R$)</Form.Label>
              <NumericFormat
                value={newProduto.produtoValorTotal / 100}
                thousandSeparator='.'
                decimalSeparator=','
                decimalScale={2}
                fixedDecimalScale
                prefix='R$ '
                onValueChange={values =>
                  setNewProduto({
                    ...newProduto,
                    produtoValorTotal: values.floatValue
                      ? Math.round(values.floatValue * 100)
                      : 0,
                  })
                }
                className='form-control'
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={fecharAddModal}>
            Cancelar
          </Button>
          <Button variant='primary' onClick={criarProduto}>
            Adicionar Produto
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para edição de produtos */}
      <Modal show={showEditModal} onHide={fecharEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nome do Produto</Form.Label>
              <Form.Control
                type='text'
                value={newProduto.produtoNome}
                onChange={e =>
                  setNewProduto({ ...newProduto, produtoNome: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descrição do Produto</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                value={newProduto.produtoDescricao}
                onChange={e =>
                  setNewProduto({
                    ...newProduto,
                    produtoDescricao: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Valor do Produto (R$)</Form.Label>
              <NumericFormat
                value={newProduto.produtoValorTotal / 100}
                thousandSeparator='.'
                decimalSeparator=','
                decimalScale={2}
                fixedDecimalScale
                prefix='R$ '
                onValueChange={values =>
                  setNewProduto({
                    ...newProduto,
                    produtoValorTotal: values.floatValue
                      ? Math.round(values.floatValue * 100)
                      : 0,
                  })
                }
                className='form-control'
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={fecharEditModal}>
            Cancelar
          </Button>
          <Button variant='primary' onClick={editarProduto}>
            Salvar Alterações
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Produtos;
