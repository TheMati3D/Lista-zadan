import React, { useState, useEffect, createContext } from 'react';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';
import FileUploader from './components/FileUploader';
import './App.css';

// Kontekst dla zadań
export const TaskContext = createContext({
  tasks: [],
  toggleTaskStatus: () => {},
  updateTaskDifficulty: () => {},
  addTask: () => {},
  deleteTask: () => {}
});

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Sprawdzanie przeterminowanych zadań
    const checkOverdueTasks = () => {
      const now = new Date();
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.status === "oczekujące" && new Date(task.dueDate) < now) {
            return { ...task, status: "przeterminowane" };
          }
          return task;
        })
      );
    };

    // Uruchom sprawdzenie od razu
    checkOverdueTasks();
    
    // Ustawienie interwału do sprawdzania co minutę
    const intervalId = setInterval(checkOverdueTasks, 60000);
    
    return () => clearInterval(intervalId);
  }, []); // Pusta tablica zależności aby uniknąć nieskończonej pętli

  const handleFileUpload = (fileContent) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Parsowanie zawartości pliku JSON
      const parsedTasks = JSON.parse(fileContent);
      
      // Sprawdzenie, czy parsedTasks jest tablicą
      if (!Array.isArray(parsedTasks)) {
        throw new Error("Zawartość pliku nie jest poprawną tablicą zadań.");
      }
      
      // Walidacja każdego zadania
      const validatedTasks = parsedTasks.map(task => {
        // Sprawdzenie wymaganych pól
        if (!task.title || !task.dueDate) {
          throw new Error(`Zadanie musi zawierać tytuł i termin wykonania.`);
        }
        
        // Ustawienie domyślnych wartości dla opcjonalnych pól
        return {
          id: task.id || Date.now() + Math.random().toString(36).substr(2, 9),
          title: task.title,
          details: task.details || "",
          dueDate: task.dueDate,
          status: task.status || "oczekujące",
          difficulty: task.difficulty || 1
        };
      });
      
      setTasks(validatedTasks);
      setIsLoading(false);
    } catch (err) {
      setError(`Błąd podczas wczytywania pliku: ${err.message}`);
      setIsLoading(false);
    }
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newStatus = task.status === "wykonane" ? "oczekujące" : "wykonane";
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const updateTaskDifficulty = (taskId, newDifficulty) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId && task.status === "oczekujące") {
          return { ...task, difficulty: newDifficulty };
        }
        return task;
      })
    );
  };

  const addTask = (newTask) => {
    const taskWithId = {
      ...newTask,
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      status: "oczekujące"
    };
    setTasks(prevTasks => [...prevTasks, taskWithId]);
  };

  const deleteTask = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.filter(task => task.id !== taskId)
    );
  };
  

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      toggleTaskStatus, 
      updateTaskDifficulty, 
      addTask, 
      deleteTask 
    }}>
      <div className="app-container">
        <h1>Lista zadań do wykonania</h1>
        
        <FileUploader onFileUpload={handleFileUpload} />
        
        {error && <div className="error-message">{error}</div>}
        
        {isLoading ? (
          <p>Wczytywanie zadań...</p>
        ) : (
          <>
            <AddTaskForm />
            <TaskList />
          </>
        )}
      </div>
    </TaskContext.Provider>
  );
}

export default App;