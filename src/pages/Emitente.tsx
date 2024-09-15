// src/pages/Emitente.tsx
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Menu from '../components/Menu';
import api from '../api/axios';
import '../styles/Emitente.css'

const Emitente: React.FC = () => {
  const [emitente, setEmitente] = useState<any>({});
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    emitenteNome: '',
    emitenteCpf: '',
    emitenteEndereco: '',
    emitenteTelefone: '',
  });

  const emitenteId = 1; // ID do emitente, ajuste conforme necessário

  // Função para buscar dados do emitente
  useEffect(() => {
    api
      .get(`/emitentes/${emitenteId}`)
      .then(response => {
        setEmitente(response.data);
        setFormData({
          emitenteNome: response.data.emitenteNome,
          emitenteCpf: response.data.emitenteCpf,
          emitenteEndereco: response.data.emitenteEndereco,
          emitenteTelefone: response.data.emitenteTelefone,
        });
      })
      .catch(error => {
        console.error('Erro ao buscar emitente:', error);
      });
  }, [emitenteId]);

  // Função para abrir o modal
  const handleShowModal = () => setShowModal(true);

  // Função para fechar o modal
  const handleCloseModal = () => setShowModal(false);

  // Função para lidar com a mudança de input no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Função para enviar os dados atualizados
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api
      .patch(`/emitentes/${emitenteId}`, formData)
      .then(response => {
        // Atualiza os dados na tela após a edição
        setEmitente(response.data);
        handleCloseModal();
      })
      .catch(error => {
        console.error('Erro ao atualizar emitente:', error);
      });
  };

  return (
    <div className='d-flex'>
      <div className='col-md-3'>
        <Menu />
      </div>
      <div className='col-md-9 emitente-content'>
        <div>
          <h1>Emitente</h1>

          {/* Exibe os dados do emitente */}
          <div>
            <p>
              <strong>Nome:</strong> {emitente.emitenteNome}
            </p>
            <p>
              <strong>CPF:</strong> {emitente.emitenteCpf}
            </p>
            <p>
              <strong>Endereço:</strong> {emitente.emitenteEndereco}
            </p>
            <p>
              <strong>Telefone:</strong> {emitente.emitenteTelefone}
            </p>

            <Button variant='primary' onClick={handleShowModal}>
              Editar Emitente
            </Button>
          </div>
        </div>

        {/* Modal para Edição */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Emitente</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditSubmit}>
              <Form.Group controlId='formNome'>
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type='text'
                  name='emitenteNome'
                  value={formData.emitenteNome}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId='formCpf'>
                <Form.Label>CPF</Form.Label>
                <Form.Control
                  type='text'
                  name='emitenteCpf'
                  value={formData.emitenteCpf}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId='formEndereco'>
                <Form.Label>Endereço</Form.Label>
                <Form.Control
                  type='text'
                  name='emitenteEndereco'
                  value={formData.emitenteEndereco}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId='formTelefone'>
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  type='text'
                  name='emitenteTelefone'
                  value={formData.emitenteTelefone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button variant='primary' type='submit'>
                Salvar Alterações
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Emitente;
