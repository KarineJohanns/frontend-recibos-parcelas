// src/components/ParcelaList.tsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import ParcelaItem from './ParcelaItem';
import ModalParcela from '../components/Modal/ModalParcela';
import ModalDetalhes from '../components/Modal/ModalDetalhes';
import api from '../api/axios';
import '../styles/ParcelaList.css';

const ParcelaList: React.FC = () => {
  const [parcelas, setParcelas] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDetalhesModal, setShowDetalhesModal] = useState<boolean>(false);
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
    setShowModal(true);
  };

  const handleDetalhes = (id: number) => {
    const parcela = parcelas.find(p => p.parcelaId === id);
    setSelectedParcela(parcela);
    setShowDetalhesModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setParcelaId(null);
  };

  const handleDetalhesModalClose = () => {
    setShowDetalhesModal(false);
    setSelectedParcela(null);
  };

  // Filtro de busca
  const filteredParcelas = parcelas.filter(parcela => {
    const clienteNome = parcela.cliente.clienteNome || '';
    return clienteNome.toLowerCase().includes(search.toLowerCase());
  });

  // Ordenação por status de pagamento e data de vencimento
  const sortedParcelas = filteredParcelas.sort((a, b) => {
    // Ordenar por status de pagamento: não pagas antes de pagas
    if (a.paga !== b.paga) {
      return a.paga ? 1 : -1;
    }

    // Se ambos têm o mesmo status, ordenar por data de vencimento
    const dateA = new Date(a.dataVencimento);
    const dateB = new Date(b.dataVencimento);
    return dateA.getTime() - dateB.getTime();
  });

  // Paginação
  const paginatedParcelas = sortedParcelas.slice(0, currentPage * itemsPerPage);

  const parcelaItems = paginatedParcelas.map(parcela => (
    <ParcelaItem
      key={parcela.parcelaId}
      parcela={parcela}
      onReceber={handleReceber}
      onEditar={() => {}}
      onExcluir={() => {}}
      onDetalhes={handleDetalhes}
      onRenegociar={() => {}}
      onGerarRecibo={() => {}}
    />
  ));

  return (
    <div className="parcela-list-container">
      <h1>Lista de Parcelas</h1>
      <Row className="align-items-center mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar cliente"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            as="select"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Form.Control>
        </Col>
        <Col md={3} className="text-end">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Criar Nova Parcela
          </Button>
        </Col>
      </Row>
      <div className="parcelas-list">
        {parcelaItems}
      </div>
      <ModalParcela
        show={showModal}
        onClose={handleModalClose}
        parcelaId={parcelaId || 0}
      />
      <ModalDetalhes
        show={showDetalhesModal}
        onClose={handleDetalhesModalClose}
        parcela={selectedParcela}
      />
    </div>
  );
};

export default ParcelaList;
