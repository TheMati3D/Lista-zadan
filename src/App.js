import React, { useState, useEffect, createContext } from 'react';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';
import FileUploader from './components/FileUploader';
import './App.css';

// Kontekst do współdzielenia stanu zadań między komponentami
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
    // Funkcja sprawdzająca czy nie ma przeterminowanych zadań
    const checkOverdueTasks = () => {
      const now = new Date();
      setTasks(prevTasks => 
        prevTasks.map(task => {
          // Jeśli zadanie jest oczekujące i termin minął, oznacz jako przeterminowane
          if (task.status === "oczekujące" && new Date(task.dueDate) < now) {
            return { ...task, status: "przeterminowane" };
          }
          return task;
        })
      );
    };

    // Sprawdź zadania od razu przy ładowaniu aplikacji
    checkOverdueTasks();
    
    // Ustawienie timera na sprawdzanie co minutę - żeby status się aktualizował na bieżąco
    const intervalId = setInterval(checkOverdueTasks, 60000);
    
    
    return () => clearInterval(intervalId);
  }, []); 

  const handleFileUpload = (fileContent) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Parsujemy zawartość pliku
      const parsedTasks = JSON.parse(fileContent);
      
      // Sprawdzamy czy plik zawiera tablicę zadań
      if (!Array.isArray(parsedTasks)) {
        throw new Error("Zawartość pliku nie jest poprawną tablicą zadań.");
      }
      
      // Max długość tytułu - taka sama jak w formularzu
      const MAX_TITLE_LENGTH = 50;
      
      // Sprawdzamy każde zadanie i dostosowujemy do naszego formatu
      const validatedTasks = parsedTasks.map(task => {
        // Sprawdzamy czy zadanie zawiera wymagane pola
        if (!task.title || !task.dueDate) {
          throw new Error(`Zadanie musi zawierać tytuł i termin wykonania.`);
        }
        
        // Przytnij tytuł jak za długi
        const trimmedTitle = task.title.substring(0, MAX_TITLE_LENGTH);
        
        // Zwracamy obiekt z domyślnymi wartościami tam gdzie brakuje danych
        return {
          id: task.id || Date.now() + Math.random().toString(36).substr(2, 9), // Unikalny ID
          title: trimmedTitle,
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
          // Zmieniamy sattus tylko dla zadań oczekujących
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
        // Zmieniamy trudność tylko dla zadań oczekujących
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
      id: Date.now() + Math.random().toString(36).substr(2, 9), // Generujemy losowy ID
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