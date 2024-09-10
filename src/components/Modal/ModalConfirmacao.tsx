import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ModalConfirmacaoProps {
  show: boolean;
  mensagem: string;
  onClose: () => void;
}

const ModalConfirmacao: React.FC<ModalConfirmacaoProps> = ({ show, mensagem, onClose }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmação</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{mensagem}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={onClose}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConfirmacao;
