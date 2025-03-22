import React, { useContext } from 'react';
import { TaskContext } from '../App';
import { formatDate } from '../utils';
import { CheckCircle, Circle, Star, Trash } from 'lucide-react';

function TaskItem({ task }) {
  const { toggleTaskStatus, updateTaskDifficulty, deleteTask } = useContext(TaskContext);

  const handleDifficultyChange = (change) => {
    const newDifficulty = Math.max(0, Math.min(10, task.difficulty + change));
    updateTaskDifficulty(task.id, newDifficulty);
  };

  const getStatusClass = () => {
    switch(task.status) {
      case "wykonane":
        return "status-completed";
      case "przeterminowane":
        return "status-overdue";
      default:
        return "status-pending";
    }
  };

  // To rozbija tekst na linie i wstawia odpowiednie <br> - inaczej enter się gubi
  const formatDetails = (text) => {
    if (!text) return null;
    
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Możemy edytować trudność tylko dla zadań oczekujących
  const canChangeDifficulty = task.status === "oczekujące";
  // Usuwamy tylko wykonane lub przeterminowane
  const canDelete = task.status === "wykonane" || task.status === "przeterminowane";

  const handleDelete = () => {
    // Debug info - do usunięcia przed produkcją
    console.log("Próba usunięcia zadania:", task.id, "Status:", task.status);
    deleteTask(task.id);
  };

  return (
    <div className={`task-item ${getStatusClass()}`}>
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-actions" style={{ display: 'flex', alignItems: 'center' }}>
          {/* Dodany span wyświetlający "Wykonane" obok przycisku dla zadań o statusie "oczekujące" */}
          {task.status === "oczekujące" && (
            <span style={{ 
              marginRight: "8px", 
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              height: "100%"
            }}>
              Wykonane
            </span>
          )}
          <button 
            className="status-button"
            onClick={() => toggleTaskStatus(task.id)}
            title={task.status === "wykonane" ? "Oznacz jako niewykonane" : "Oznacz jako wykonane"}
          >
            {task.status === "wykonane" ? 
              <CheckCircle size={20} /> : 
              <Circle size={20} />
            }
          </button>
          
          {canDelete && (
            <button 
              className="delete-button"
              onClick={handleDelete}
              title="Usuń zadanie"
            >
              <Trash size={20} />
            </button>
          )}
        </div>
      </div>
      
      <div className="task-details">
        <p className="details-text">{formatDetails(task.details)}</p>
        <p className="due-date">
          Termin: {formatDate(task.dueDate)}
        </p>
        <div className="task-difficulty">
          <span>Trudność: </span>
          <div className="stars-container">
            {[...Array(10)].map((_, index) => (
              <Star
                key={index}
                size={16}
                className={index < task.difficulty ? "star-filled" : "star-empty"}
              />
            ))}
          </div>
          {canChangeDifficulty && (
            <div className="difficulty-controls">
              <button 
                onClick={() => handleDifficultyChange(-1)}
                disabled={task.difficulty === 0}
              >
                -
              </button>
              <span>{task.difficulty}</span>
              <button 
                onClick={() => handleDifficultyChange(1)}
                disabled={task.difficulty === 10}
              >
                +
              </button>
            </div>
          )}
        </div>
        <div className="task-status">
          <span>Status: </span>
          <span className={`status-badge ${getStatusClass()}`}>{task.status}</span>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;