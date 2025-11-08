
import React from 'react';
import './Navbar.css'; 
import logo from '../assets/LogoVeritas.png';
import { FaInfoCircle, FaRegBell, FaUserCircle } from 'react-icons/fa';

function Navbar() {
 return (
    <header className="navbar-container">
      
     
      <div className="navbar-left">
         {/* --  LOGO GROUP (LOGO + TEXT) -- */}
            <div className="navbar-logo-group">
            <img src={logo} className="navbar-logo" alt="Logo Kanban" />
            <span className="navbar-logo-text">Kanban</span>
        </div>

        {/* --  VERTICAL DIVIDER -- */}
        <div className="navbar-divider" />
            {/* --  > -- */}
        <span className="navbar-divider-arrow">&gt;</span>

        {/* --- Project name --- */}
        <span className="navbar-project-name">Nome do Projeto</span>
      </div>

      <div className="navbar-center">
        <nav className="nav-tabs">
          <button className="nav-tab active">Kanban</button>
          <button className="nav-tab">Home</button>
          <button className="nav-tab">Soluções</button>
          <button className="nav-tab">Conteúdo</button>
          <button className="nav-tab">Ecossistema</button>
          <button className="nav-tab">Trabalhe Conosco</button>
        </nav>
      </div>

      <div className="navbar-right">
        <button className="nav-btn-icon">
          <FaInfoCircle />
        </button>
        <button className="nav-btn-icon">
          <FaRegBell />
        </button>
        <FaUserCircle className="navbar-avatar" />
      </div>
     
    </header>
  );
}

export default Navbar;