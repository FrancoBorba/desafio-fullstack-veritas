// Em frontend/src/App.js

import React, { useState } from 'react'; 
import './App.css';
import TaskCollumn from './components/TaskCollumn'; 
import Navbar from './components/Navbar'; 
import LogoVeritas from "./assets/LogoVeritas.png"

// Create fake cards to test and improve the design
const mockTasks = [
  { id: 'task-1', title: 'MVP - Backend Go', description: 'Criar endpoints CRUD e Docker.', status: 'Concluídas' },
  { id: 'task-2', title: 'MVP - Frontend React', description: 'Criar colunas e cards.', status: 'Em Progresso' },
  { id: 'task-3', title: 'Bônus - Swagger', description: 'Documentar a API.', status: 'Concluídas' },
  { id: 'task-4', title: 'Bônus - Drag and Drop', description: 'Implementar o bônus do desafio.', status: 'A Fazer' },
  { id: 'task-5', title: 'Aplicar meu Design', description: 'Usar o UI que criei.', status: 'A Fazer' },
];

// The columns with fix name  
const columnTitles = ['A Fazer', 'Em Progresso', 'Concluídas']; // 

function App() {

  const [tasks, setTasks] = useState(mockTasks);

  return (
    <div className="App">



 
      <main className="kanban-board">

     
        {columnTitles.map(title => {
          
          const tasksForColumn = tasks.filter(task => task.status === title);


          return (
            <TaskCollumn
              key={title}    
              title={title}       
              tasks={tasksForColumn} 
            />
          );
        })}

      </main>
    </div>
  );
}

export default App;