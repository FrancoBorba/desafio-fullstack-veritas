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

  // Filters  
  const [filterPriority, setFilterPriority] = useState('Todas'); // 'Todas', 'Alta', 'Média', 'Baixa'
  const [sortOrder, setSortOrder] = useState('Nenhum'); // 'Nenhum', 'priority_desc', 'priority_asc'

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
   // setTasks(currentTasks => [...currentTasks, novaTarefa]);
   fetchTasks();
  };

  // Open Modal to a update
  const handleTaskUpdated = (updatedTask) => {
  /*  setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    ); */
    fetchTasks();

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
  
  const fetchTasks = async () => {
      try{
        setLoading(true)

        const params = new URLSearchParams();

        if (filterPriority !== 'Todas') {
      params.append('priority', filterPriority);
    }
    if (sortOrder !== 'Nenhum') {
      params.append('sort', sortOrder);
    }
    const queryString = params.toString();

      // call the endpoint getAllTasks
      axios.get(`${API_URL}/tasks?${queryString}`)
      .then(response => {
        setTasks(response.data || []); 
        setError(null);
      })
      }catch (err) {
        console.error("Erro ao buscar tarefas:", err);
        setError("Não foi possível carregar as tarefas."); 
      } finally {
        setLoading(false); 
      }
    };

  // Search in the api all tasks
  useEffect( () =>{
 
    fetchTasks();
    
  } ,[filterPriority, sortOrder]);


 

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
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) return;


    const task = tasks.find(t => t.id === draggableId);
    const newStatus = destination.droppableId;

    if (destination.droppableId !== source.droppableId) {
      const newStatus = destination.droppableId;
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

      // Call api
      axios.put(`${API_URL}/tasks/${draggableId}`, updatePayload)
        .then(response => {
          fetchTasks();
        })
        .catch(err => {
          console.error("Erro ao atualizar status:", err);
          fetchTasks(); 
        });
    } else {
    //Internal reorganization
      const tasksInThisColumn = tasks.filter(t => t.status === source.droppableId);
      const otherTasks = tasks.filter(t => t.status !== source.droppableId);
      
      const [reorderedItem] = tasksInThisColumn.splice(source.index, 1);
      tasksInThisColumn.splice(destination.index, 0, reorderedItem);

      setTasks([...otherTasks, ...tasksInThisColumn]);
    }
  }


  return (
    <div className="App">
      <Navbar /> 
      <ActionBar onOpenModal={handleOpenModal}
      onFilterChange={setFilterPriority} 
        onSortChange={setSortOrder}
      />
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