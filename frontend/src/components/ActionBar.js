import React from 'react';
import './ActionBar.css'; // Vamos criar este CSS em seguida

import { FaSearch, FaPlus, FaSortAmountDown, FaFilter, FaEllipsisH } from 'react-icons/fa';
import { BsThreeDotsVertical } from "react-icons/bs";

function ActionBar() {
  return (
    <div className="action-bar-container">
      
      {/* --- Left side: search --- */}
      <div className="action-bar-search">
        <FaSearch className="action-bar-icon" />
        <input type="text" placeholder="Search" />
      </div>

      {/* --- Right side: Buttons --- */}
      <div className="action-bar-right">
        <button className="action-btn-primary">
          <FaPlus /> New Board
        </button>
        
        <button className="action-btn-text">
          <FaSortAmountDown className="action-bar-icon-small" /> Sort
        </button>

        <button className="action-btn-text">
          <FaFilter className="action-bar-icon-small" /> Filter
        </button>
        
        <button className="action-btn-icon">
            <BsThreeDotsVertical />
        </button>
      </div>

    </div>
  );
}



export default ActionBar;