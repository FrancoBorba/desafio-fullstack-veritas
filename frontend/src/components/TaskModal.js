import React, { useState } from 'react';
import Modal from 'react-modal';
import './TaskModal.css'; 
import axios from 'axios';


function TaskModal({isOpen , onClose, onTaskCreated}){

  // Formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Baixa'); 
  const [error, setError] = useState(null); 

  const API_URL = 'http://localhost:8080';

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setPriority('Baixa');
    setError(null);
  };

const handleSubmit = (e) => {
    e.preventDefault(); 

    if (!title) {
      setError('O título é obrigatório.');
      return;
    }



    // The"Body"
     const novaTarefa = {
       title: title,
       description: description,
       priority: priority
     };

     setError(null); // Clean the error por a paste error
    
     axios.post(`${API_URL}/tasks`, novaTarefa)
      .then(response => {
        onTaskCreated(response.data); 
        clearForm(); 
        onClose(); 
      })
      .catch(err => {
        console.error(err);
        setError("Não foi possível criar a tarefa.");
      });
    

  };

  const handleClose = () => {
    clearForm();
    onClose();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
      appElement={document.getElementById('root')} 
    >
      <form onSubmit={handleSubmit}>
        <h2>Nova Tarefa</h2>
                <div className="form-group">
          <label htmlFor="title">Título <span>(Obrigatório)</span></label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {error && <p className="form-error">{error}</p>}
        </div>

        {/* --- For the user set the priority --- */}
        <div className="form-group">
          <label>Prioridade</label>
          <div className="priority-selector">
            <button
              type="button"
              className={`task-priority alta ${priority === 'Alta' ? 'active' : ''}`}
              onClick={() => setPriority('Alta')}
            >
              ALTA
            </button>
            <button
              type="button"
              className={`task-priority média ${priority === 'Média' ? 'active' : ''}`}
              onClick={() => setPriority('Média')}
            >
              MÉDIA
            </button>
            <button
              type="button"
              className={`task-priority baixa ${priority === 'Baixa' ? 'active' : ''}`}
              onClick={() => setPriority('Baixa')}
            >
              BAIXA
            </button>
          </div>
        </div>

        {/* --- Description --- */}
        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* --- BUTTONS --- */}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-save">
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default TaskModal;