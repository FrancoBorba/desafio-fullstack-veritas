// Em frontend/src/App.js

import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import './App.css';
import TaskCollumn from './components/TaskCollumn'; 
import Navbar from './components/Navbar'; 
import ActionBar from './components/ActionBar';
import TaskModal from './components/TaskModal'; 
import { DragDropContext } from '@hello-pangea/dnd'; 



// The columns with fix name  
const columnTitles = ['A Fazer', 'Em Progresso', 'Concluídas']; 

const API_URL = 'http://localhost:8080';

function App() {

  //Saves task cards coming from the back
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //To control Modal
  const [isModalOpen, setIsModalOpen] = useState(false);


  const [taskToEdit, setTaskToEdit] = useState(null);

  // Opened
  const handleOpenModal = (task = null) => {
    setTaskToEdit(task); 
    setIsModalOpen(true); 
  };
  
  // Closed
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null); 
  };

  // Open Modal to a post
  const handleTaskCreated = (novaTarefa) => {
    setTasks(currentTasks => [...currentTasks, novaTarefa]);
  };

  // Open Modal to a update
  const handleTaskUpdated = (updatedTask) => {
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleDeleteTask = (taskId) =>{
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      return; 
    }

    axios.delete(`${API_URL}/tasks/${taskId}`)
      .then(
        () =>{
          setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId))
        }
      ).catch(err => {
        console.error("Erro ao deletar tarefa:", err);
      });
  }

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
      // ---  Put it in the context of Drag and Drop ---
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <main className="kanban-board">
          {columnTitles.map(title => {
            const tasksForColumn = tasks.filter(task => task.status === title);
            return (
              <TaskCollumn
                key={title}
                title={title}     
                tasks={tasksForColumn}
                onOpenModal={handleOpenModal}
                onDeleteTask={handleDeleteTask}
              />
            );
          })}
        </main>
      </DragDropContext>
    );
  };

  const handleOnDragEnd = (result) =>{
    const {source , destination , draggableId} = result;

    //If you dont have a target, it returns
    if(!destination){
      return
    }


    const task = tasks.find(t => t.id === draggableId);
    const newStatus = destination.droppableId;

    if (task.status !== newStatus) {
      
      const updatePayload = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: newStatus 
      };

 
      const updatedTasks = tasks.map(t => 
        t.id === draggableId ? { ...t, status: newStatus } : t
      );
      setTasks(updatedTasks); 

      // Chamada de API
      axios.put(`${API_URL}/tasks/${draggableId}`, updatePayload)
        .then(response => {
          handleTaskUpdated(response.data);
        })
        .catch(err => {
          console.error("Erro ao atualizar status:", err);
          setTasks(tasks); // Reverte a mudança
        });
    }
  }


  return (
    <div className="App">
      <Navbar /> 
      <ActionBar onOpenModal={handleOpenModal} />
      {renderContent()} 
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onTaskCreated={handleTaskCreated}
        onTaskUpdated={handleTaskUpdated} 
        taskToEdit={taskToEdit}
      />
    </div>
  );



}

export default App;