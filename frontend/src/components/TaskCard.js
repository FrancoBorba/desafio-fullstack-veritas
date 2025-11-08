import React from "react";
import './TaskCard.css'; 
import { FaUsers, FaRegCommentDots } from 'react-icons/fa';


function TaskCard({task}){
    
    const prioridadeClass = task.prioridade ? task.prioridade.toLowerCase() : '';

return (
    <div className="task-card">
      
      {/* ---  THE PRIORITY TAG --- */}
      {task.prioridade && (
        <div className="card-header">
          <span className={`task-priority ${prioridadeClass}`}>
            {task.prioridade.toUpperCase()}
          </span>
        </div>
      )}

      {/*  TITLE AND DESCRIPTION */}
      <div className="card-body">
        <h4>{task.title}</h4>
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
      </div>

    </div>
  );
}

export default TaskCard;