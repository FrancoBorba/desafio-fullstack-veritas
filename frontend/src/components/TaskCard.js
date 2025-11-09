import React from "react";
import './TaskCard.css'; 
import { FaUsers, FaRegCommentDots, FaPencilAlt, FaTrash } from 'react-icons/fa';

function TaskCard({ task, onOpenModal, onDeleteTask }){
    
const prioridadeClass = task.priority ? task.priority.toLowerCase() : '';

return (
    <div className="task-card">
      
      {/* ---  THE PRIORITY TAG --- */}
      {task.priority && (
        <div className="card-header">
          <span className={`task-priority ${prioridadeClass}`}>
            {task.priority.toUpperCase()}
          </span>
        </div>
      )}

      {/*  TITLE AND DESCRIPTION */}
      <div className="card-body">
        <h4 className="card-title-clickable" 
          onClick={() => onOpenModal(task)}
         >{task.title}</h4>
        <p>{task.description}</p>
      </div>

      {/* -- THE FOOTER WITH ICONS  */}
      <div className="card-footer">
        <div className="footer-left">
          <span className="icon-group">
            <FaUsers />
            <span>1</span> 
          </span>
          <span className="icon-group">
            <FaRegCommentDots /> 
          </span>
        </div>

        <div className="footer-right">
          <button className="card-icon-btn" onClick={() => onOpenModal(task)}>
            <FaPencilAlt /> 
          </button>
          <button className="card-icon-btn delete-btn" onClick={() => onDeleteTask(task.id)}>
            <FaTrash />
          </button>
        </div>
      </div>

    </div>
  );
}

export default TaskCard;