import React from 'react';
import './ActionBar.css'; // Vamos criar este CSS em seguida

import { FaSearch, FaPlus, FaSortAmountDown, FaFilter, FaEllipsisH } from 'react-icons/fa';
import { BsThreeDotsVertical } from "react-icons/bs";

function ActionBar({ onOpenModal, onFilterChange, onSortChange ,searchTerm, onSearchChange }) {
  return (
    <div className="action-bar-container">
      
      {/* --- Left side: search --- */}
      <div className="action-bar-search" >
        <FaSearch className="action-bar-icon" />
        <input 
          type="text" 
          placeholder="Buscar" 
          value={searchTerm} 
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* --- Right side: Buttons --- */}
      <div className="action-bar-right" >
        <button className="action-btn-primary" disabled title='Não implementado'>
          <FaPlus /> Novo quadro
        </button>
        
     <label htmlFor="sort-select" className="action-group-label">
          <FaSortAmountDown className="action-bar-icon-small" />
          <span className="action-label">Ordenar</span>
          
          <select 
            id="sort-select"
            className="action-select" 
            onChange={(e) => onSortChange(e.target.value)} 
          >
            <option value="Nenhum">Nenhum</option>
            <option value="priority_desc">Prioridade (Alta-Baixa)</option>
            <option value="priority_asc">Prioridade (Baixa-Alta)</option>
          </select>
        </label>

        <label htmlFor="filter-select" className="action-group-label">
          <FaFilter className="action-bar-icon-small" />
          <span className="action-label">Filtrar</span>

          <select 
            id="filter-select"
            className="action-select" 
            onChange={(e) => onFilterChange(e.target.value)} 
          >
            <option value="Todas">Todas</option>
            <option value="Alta">Prioridade: Alta</option>
            <option value="Média">Prioridade: Média</option>
            <option value="Baixa">Prioridade: Baixa</option>
          </select>
        </label>
        
        <button className="action-btn-icon">
            <BsThreeDotsVertical />
        </button>
      </div>

    </div>
  );
}



export default ActionBar;