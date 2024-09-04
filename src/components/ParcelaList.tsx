// src/components/ParcelaList.tsx
import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import ParcelaItem from './ParcelaItem';
import ModalParcela from './ModalParcela';
import api from '../api/axios';

const ParcelaList: React.FC = () => {
  const [parcelas, setParcelas] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [parcelaId, setParcelaId] = useState<number | null>(null);
  const [search, setSearch] = useState<string>('');
  
  // Fetch parcelas
  useEffect(() => {
    fetchParcelas();
  }, []);

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

  const handleModalClose = () => {
    setShowModal(false);
    setParcelaId(null);
  };

  // Filtragem das parcelas
  const filteredParcelas = parcelas.filter(parcela => {
    const clienteNome = parcela.clienteNome || ''; // Verifica se clienteNome é undefined e define como string vazia
    return clienteNome.toLowerCase().includes(search.toLowerCase());
  });

  const parcelaItems = filteredParcelas.map(parcela => (
    <ParcelaItem
      key={parcela.parcelaId}
      parcela={parcela}
      onReceber={handleReceber}
      onEditar={() => {}}
      onExcluir={() => {}}
      onDetalhes={() => {}}
      onRenegociar={() => {}}
      onGerarRecibo={() => {}}
    />
  ));

  return (
    <div>
      <h1>Lista de Parcelas</h1>
      <Form className="mb-3">
        <Form.Group controlId="search">
          <Form.Control
            type="text"
            placeholder="Buscar cliente"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Criar Nova Parcela
        </Button>
      </Form>
      {parcelaItems}
      <ModalParcela
        show={showModal}
        onClose={handleModalClose}
        parcelaId={parcelaId || 0}
      />
    </div>
  );
};

export default ParcelaList;
