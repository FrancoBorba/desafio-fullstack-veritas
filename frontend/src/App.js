// Em frontend/src/App.js

import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import './App.css';
import TaskCollumn from './components/TaskCollumn'; 
import Navbar from './components/Navbar'; 
import ActionBar from './components/ActionBar';
import TaskModal from './components/TaskModal'; 



// The columns with fix name  
const columnTitles = ['A Fazer', 'Em Progresso', 'Concluídas']; 

const API_URL = 'http://localhost:8080';

function App() {

  //Saves task cards coming from the back
  const [tasks, setTasks] = useState();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //To control Modal
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Opened
  const handleOpenModal = () => setIsModalOpen(true);
  
  // Closed
  const handleCloseModal = () => setIsModalOpen(false);

  const handleTaskCreated = (novaTarefa) => {
    setTasks(currentTasks => [...currentTasks, novaTarefa]);
  };

  // Search in the api all tasks
  useEffect( () =>{
    const fetchTasks = async () => {
      try{
        setLoading(true)
        // call the endpoint getAllTasks
        const response = await axios.get(`${API_URL}/tasks`);

        setTasks(response.data || []); 
        setError(null);
      }catch (err) {
        console.error("Erro ao buscar tarefas:", err);
        setError("Não foi possível carregar as tarefas."); 
      } finally {
        setLoading(false); 
      }
    };
    fetchTasks();
    
  } , []);

  const renderContent = () => {
    if (loading) {
      return <p className="loading-message">Carregando tarefas...</p>;
    }
    if (error) {
      return <p className="error-message">{error}</p>;
    }

    //If there is no loading or error, renders the board
    return (
      <main className="kanban-board">
        {columnTitles.map(title => {
          const tasksForColumn = tasks.filter(task => task.status === title);
          return (
            <TaskCollumn
              key={title}
              title={title}
              tasks={tasksForColumn}
              onOpenModal={handleOpenModal}
            />
          );
        })}
      </main>
    );
  };

  return (
    <div className="App">
      <Navbar /> 
      <ActionBar onOpenModal={handleOpenModal} />
      {renderContent()} 
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );



}

export default App;