// src/components/Modal/ModalConfirmacaoExclusao.tsx

import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ModalConfirmacaoExclusaoProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ModalConfirmacaoExclusao: React.FC<ModalConfirmacaoExclusaoProps> = ({ show, onClose, onConfirm }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Exclusão</Modal.Title>
      </Modal.Header>
      <Modal.Body>Tem certeza que deseja excluir esta parcela?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Excluir
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConfirmacaoExclusao;
