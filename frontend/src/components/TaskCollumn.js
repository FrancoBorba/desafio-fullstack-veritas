import React from 'react';
import TaskCard from './TaskCard'; 
import './TaskCollumn.css';
import Modal from 'react-modal';


import { BsThreeDotsVertical } from "react-icons/bs";
import { TiPlus } from "react-icons/ti";



function TaskCollumn({title , tasks , onOpenModal}) {
    
    return(
      <div className="task-collumn" data-status={title}>
        <div className="collumn-header">

          {/* Right side of header */}
        <div className="collumn-title-group"> 
            <h3>{title}</h3>
            <span className="task-count">{tasks.length}</span>
        </div >
          {/* Left side of header */}
        <div className="collumn-buttons">
          <button className="collumn-btn" onClick={onOpenModal} > <TiPlus /></button> {/*Now open the pop up */}
           <button className="collumn-btn"><BsThreeDotsVertical /></button>
        </div>
        </div>
      
  

      {/* Transforms a list of data into a list of components */}
      <div className="task-list">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>

    <button className="add-task-btn">
              <TiPlus /> New
            </button>
      </div>
    )
}

export default TaskCollumn;