import React from 'react';
import './ActionBar.css'; // Vamos criar este CSS em seguida

import { FaSearch, FaPlus, FaSortAmountDown, FaFilter, FaEllipsisH } from 'react-icons/fa';
import { BsThreeDotsVertical } from "react-icons/bs";

function ActionBar({ onOpenModal, onFilterChange, onSortChange }) {
  return (
    <div className="action-bar-container">
      
      {/* --- Left side: search --- */}
      <div className="action-bar-search">
        <FaSearch className="action-bar-icon" />
        <input type="text" placeholder="Search" />
      </div>

      {/* --- Right side: Buttons --- */}
      <div className="action-bar-right">
        <button className="action-btn-primary" >
          <FaPlus /> New Board
        </button>
        
        <button className="action-btn-text">
          <FaSortAmountDown className="action-bar-icon-small" /> Ordenar
          <select 
            className="action-select" 
            onChange={(e) => onSortChange(e.target.value)} 
          >
            <option value="Nenhum">Nenhum</option>
            <option value="priority_desc">Prioridade (Alta-Baixa)</option>
            <option value="priority_asc">Prioridade (Baixa-Alta)</option>

          </select>
        </button>

        <button className="action-btn-text">
          <FaFilter className="action-bar-icon-small" /> Filtrar
          <select 
            className="action-select" 
            onChange={(e) => onFilterChange(e.target.value)} 
          >
            <option value="Todas">Todas</option>
            <option value="Alta">Prioridade: Alta</option>
            <option value="Média">Prioridade: Média</option>
            <option value="Baixa">Prioridade: Baixa</option>
          </select>
        </button>
        
        <button className="action-btn-icon">
            <BsThreeDotsVertical />
        </button>
      </div>

    </div>
  );
}



export default ActionBar;