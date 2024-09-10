import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import ParcelaItem from './ParcelaItem';
import ModalReceberParcela from '../components/Modal/ModalReceberParcela';
import ModalCriarParcela from '../components/Modal/ModalCriarParcelas';
import ModalDetalhes from '../components/Modal/ModalDetalhes';
import ModalEditarParcela from '../components/Modal/ModalEditarParcela';
import ModalConfirmacaoExclusao from '../components/Modal/ModalConfirmacaoExclusao'; // Importar o ModalConfirmacaoExclusao
import ModalRenegociacao from '../components/Modal/ModalRenegociacao'; // Importar o novo ModalRenegociacao
import api from '../api/axios';
import '../styles/ParcelaList.css';

const ParcelaList: React.FC = () => {
  const [parcelas, setParcelas] = useState<any[]>([]);
  const [showReceberModal, setShowReceberModal] = useState<boolean>(false);
  const [showCriarModal, setShowCriarModal] = useState<boolean>(false);
  const [showDetalhesModal, setShowDetalhesModal] = useState<boolean>(false);
  const [showEditarModal, setShowEditarModal] = useState<boolean>(false);
  const [showConfirmacaoExclusao, setShowConfirmacaoExclusao] = useState<boolean>(false); // Estado para o modal de confirmação de exclusão
  const [showRenegociacaoModal, setShowRenegociacaoModal] = useState<boolean>(false); // Estado para o modal de renegociação
  const [parcelaId, setParcelaId] = useState<number | null>(null);
  const [selectedParcela, setSelectedParcela] = useState<any | null>(null);
  const [search, setSearch] = useState<string>('');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchParcelas();
  }, [itemsPerPage, currentPage]);

  const fetchParcelas = async () => {
    try {
      const response = await api.get('/parcelas');
      setParcelas(response.data);
    } catch (error) {
      console.error('Erro ao buscar parcelas', error);
    }
  };

  const handleReceber = (id: number) => {
    setParcelaId(id);
    setShowReceberModal(true);
  };

  const handleCriarNovaParcela = () => {
    setParcelaId(null);
    setShowCriarModal(true);
  };

  const handleDetalhes = (id: number) => {
    const parcela = parcelas.find(p => p.parcelaId === id);
    setSelectedParcela(parcela);
    setShowDetalhesModal(true);
  };

  const handleEditar = (id: number) => {
    setParcelaId(id);
    setShowEditarModal(true);
  };

  const handleConfirmacaoExclusao = (id: number) => {
    setParcelaId(id);
    setShowConfirmacaoExclusao(true);
  };

  const handleExcluir = async () => {
    if (parcelaId === null) return;

    try {
      await api.delete(`/parcelas/${parcelaId}`);
      setParcelas(prevParcelas => prevParcelas.filter(parcela => parcela.parcelaId !== parcelaId));
      setShowConfirmacaoExclusao(false);
    } catch (error) {
      console.error('Erro ao excluir parcela', error);
    }
  };

  const handleRenegociar = (id: number) => {
    setParcelaId(id);
    setShowRenegociacaoModal(true);
  };

  const handleModalClose = () => {
    setShowReceberModal(false);
    setShowCriarModal(false);
    setShowDetalhesModal(false);
    setShowEditarModal(false);
    setShowConfirmacaoExclusao(false); // Fechar o modal de confirmação de exclusão
    setShowRenegociacaoModal(false); // Fechar o modal de renegociação
    setParcelaId(null);
    fetchParcelas();
  };

  const filteredParcelas = parcelas.filter(parcela => {
    const clienteNome = parcela.cliente.clienteNome || '';
    return clienteNome.toLowerCase().includes(search.toLowerCase());
  });

  const sortedParcelas = filteredParcelas.sort((a, b) => {
    if (a.paga !== b.paga) {
      return a.paga ? 1 : -1;
    }
    const dateA = new Date(a.dataVencimento);
    const dateB = new Date(b.dataVencimento);
    return dateA.getTime() - dateB.getTime();
  });

  const paginatedParcelas = sortedParcelas.slice(0, currentPage * itemsPerPage);

  const parcelaItems = paginatedParcelas.map(parcela => (
    <ParcelaItem
      key={parcela.parcelaId}
      parcela={parcela}
      onReceber={handleReceber}
      onEditar={() => handleEditar(parcela.parcelaId)}
      onExcluir={() => handleConfirmacaoExclusao(parcela.parcelaId)}
      onDetalhes={handleDetalhes}
      onRenegociar={() => handleRenegociar(parcela.parcelaId)} // Adicionar função de renegociação
      onGerarRecibo={() => {}}
    />
  ));

  return (
    <div className='parcela-list-container'>
      <div className='parcela-list-header'>
        <h1>Lista de Parcelas</h1>
        <Row className='align-items-center mb-3'>
          <Col md={6}>
            <Form.Control
              className='form-clientes'
              type='text'
              placeholder='Buscar cliente'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              as='select'
              value={itemsPerPage}
              onChange={e => setItemsPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Form.Control>
          </Col>
          <Col md={3} className='text-end'>
            <Button variant='primary' onClick={handleCriarNovaParcela}>
              Criar Nova Parcela
            </Button>
          </Col>
        </Row>
      </div>
      <div className='parcelas-list'>{parcelaItems}</div>
      <ModalReceberParcela
        show={showReceberModal}
        onClose={handleModalClose}
        parcelaId={parcelaId || 0}
      />
      <ModalCriarParcela
        show={showCriarModal}
        onClose={handleModalClose}
      />
      <ModalDetalhes
        show={showDetalhesModal}
        onClose={handleModalClose}
        parcela={selectedParcela}
      />
      <ModalEditarParcela
        show={showEditarModal}
        onClose={handleModalClose}
        parcelaId={parcelaId || 0}
      />
      <ModalConfirmacaoExclusao
        show={showConfirmacaoExclusao}
        onClose={() => setShowConfirmacaoExclusao(false)}
        onConfirm={handleExcluir}
      />
      <ModalRenegociacao
        show={showRenegociacaoModal}
        onClose={handleModalClose}
        parcelaId={parcelaId || 0}
      />
    </div>
  );
};

export default ParcelaList;
