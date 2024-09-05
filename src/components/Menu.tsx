import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Menu.css'; // Adicione um arquivo de estilo para o menu

const Menu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  // Função para determinar se um link é o link atual
  const getLinkClassName = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      {!isOpen && (
        <button className="hamburger-btn" onClick={toggleMenu}>
          ☰ {/* Ícone de menu */}
        </button>
      )}

      {/* Menu lateral para telas maiores */}
      <nav className="menu-nav menu-tela-grande">
        <ul>
          <li className={getLinkClassName('/')}><Link to="/" onClick={() => setIsOpen(false)}>Parcelas</Link></li>
          <li className={getLinkClassName('/clientes')}><Link to="/clientes" onClick={() => setIsOpen(false)}>Clientes</Link></li>
          <li className={getLinkClassName('/produtos')}><Link to="/produtos" onClick={() => setIsOpen(false)}>Produtos</Link></li>
          <li className={getLinkClassName('/emitente')}><Link to="/emitente" onClick={() => setIsOpen(false)}>Emitente</Link></li>
        </ul>
      </nav>

      {/* Overlay e menu hambúrguer para telas menores */}
      <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={handleOverlayClick}>
        <nav className="menu-nav menu-tela-pequena" onClick={(e) => e.stopPropagation()}>
          <ul>
            <li className={getLinkClassName('/')}><Link to="/" onClick={handleOverlayClick}>Parcelas</Link></li>
            <li className={getLinkClassName('/clientes')}><Link to="/clientes" onClick={handleOverlayClick}>Clientes</Link></li>
            <li className={getLinkClassName('/produtos')}><Link to="/produtos" onClick={handleOverlayClick}>Produtos</Link></li>
            <li className={getLinkClassName('/emitente')}><Link to="/emitente" onClick={handleOverlayClick}>Emitente</Link></li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Menu;
