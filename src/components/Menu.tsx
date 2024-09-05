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
    <div>
      {!isOpen && (
        <button className="hamburger-btn" onClick={toggleMenu}>
          ☰ {/* Ícone de menu */}
        </button>
      )}
      <div 
        className={`menu-overlay ${isOpen ? 'open' : ''}`} 
        onClick={handleOverlayClick}
      >
        <nav className="menu-nav" onClick={(e) => e.stopPropagation()}>
          <ul>
            <li className={getLinkClassName('/')}><Link to="/" onClick={handleOverlayClick}>Parcelas</Link></li>
            <li className={getLinkClassName('/clientes')}><Link to="/clientes" onClick={handleOverlayClick}>Clientes</Link></li>
            <li className={getLinkClassName('/produtos')}><Link to="/produtos" onClick={handleOverlayClick}>Produtos</Link></li>
            <li className={getLinkClassName('/emitente')}><Link to="/emitente" onClick={handleOverlayClick}>Emitente</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Menu;
