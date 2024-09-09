import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ModalEscolhaProps {
  show: boolean;
  mensagem: string;
  onClose: () => void;
  onAplicarDesconto: () => void;
  onCriarNovasParcelas: () => void;
}

const ModalEscolha: React.FC<ModalEscolhaProps> = ({
  show,
  mensagem,
  onClose,
  onAplicarDesconto,
  onCriarNovasParcelas
}) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Escolha uma Ação</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{mensagem}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onClose}>
          Fechar
        </Button>
        <Button variant='primary' onClick={onAplicarDesconto}>
          Aplicar Desconto
        </Button>
        <Button variant='primary' onClick={onCriarNovasParcelas}>
          Criar Novas Parcelas
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEscolha;
