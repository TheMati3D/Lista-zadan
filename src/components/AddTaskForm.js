import React, { useState, useContext } from 'react';
import { TaskContext } from '../App';

function AddTaskForm() {
  const { addTask } = useContext(TaskContext);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [dateError, setDateError] = useState('');
  const [titleError, setTitleError] = useState('');
  
  // Max 50 znaków w tytule - żeby się nie rozjeżdżało w UI
  const MAX_TITLE_LENGTH = 50;

  // Zwraca aktualną datę i czas w formacie kompatybilnym z input type="datetime-local"
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDueDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const now = new Date();
    
    // Sprawdzamy czy data nie jest z przeszłości
    if (selectedDate < now) {
      setDateError('Nie można wybrać daty z przeszłości');
    } else {
      setDateError('');
      setDueDate(e.target.value);
    }
  };
  
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    
    // Sprawdzamy czy tytuł nie jest za długi
    if (newTitle.length > MAX_TITLE_LENGTH) {
      setTitleError(`Tytuł może zawierać maksymalnie ${MAX_TITLE_LENGTH} znaków`);
      setTitle(newTitle.substring(0, MAX_TITLE_LENGTH));
    } else {
      setTitleError('');
      setTitle(newTitle);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Sprawdzamy czy wszystkie wymagane pola są wypełnione
    if (!title.trim() || !dueDate) {
      alert('Proszę wypełnić wszystkie wymagane pola');
      return;
    }

    // Sprawdzamy czy data nie jest z przeszłości
    const selectedDate = new Date(dueDate);
    const now = new Date();
    if (selectedDate < now) {
      setDateError('Nie można wybrać daty z przeszłości');
      return;
    }

    const newTask = {
      title,
      details,
      dueDate,
      difficulty: parseInt(difficulty),
    };

    addTask(newTask);
    
    // Czyścimy wszystko po zapisaniu
    setTitle('');
    setDetails('');
    setDueDate('');
    setDifficulty(1);
    setDateError('');
    setTitleError('');
    setIsFormVisible(false);
  };

  return (
    <div className="add-task-section">
      {!isFormVisible ? (
        <button 
          className="show-form-button"
          onClick={() => setIsFormVisible(true)}
        >
          Dodaj nowe zadanie
        </button>
      ) : (
        <form className="add-task-form" onSubmit={handleSubmit}>
          <h2>Dodaj nowe zadanie</h2>
          
          <div className="form-group">
            <label>Tytuł zadania* (max. {MAX_TITLE_LENGTH} znaków):</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              maxLength={MAX_TITLE_LENGTH}
              required
            />
            {titleError && <div className="error-message" style={{color: 'red', fontSize: '0.8rem', marginTop: '5px'}}>{titleError}</div>}
            <div style={{fontSize: '0.8rem', textAlign: 'right', color: title.length > MAX_TITLE_LENGTH * 0.8 ? 'orange' : 'gray'}}>
              {title.length}/{MAX_TITLE_LENGTH} znaków
            </div>
          </div>
          
          <div className="form-group">
            <label>Szczegóły:</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Termin wykonania*:</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={handleDueDateChange}
              min={getCurrentDateTime()}
              required
            />
            {dateError && <div className="error-message" style={{color: 'red', fontSize: '0.8rem', marginTop: '5px'}}>{dateError}</div>}
          </div>
          
          <div className="form-group">
            <label>Poziom trudności (1-10):</label>
            <input
              type="number"
              min="0"
              max="10"
              value={difficulty}
              onChange={(e) => {
                // Pilnujemy żeby były tylko cyfry i wartość max 10
                const value = e.target.value;
                if (/^\d*$/.test(value) && (value === '' || parseInt(value, 10) <= 10)) {
                  setDifficulty(value);
                }
              }}
              onKeyDown={(e) => {
                // Blokujemy litery i inne niepotrzebne znaki w polu numerycznym
                if (e.key === 'e' || e.key === '+' || e.key === '-' || e.key === '.') {
                  e.preventDefault();
                }
              }}
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit">Dodaj zadanie</button>
            <button 
              type="button" 
              onClick={() => {
                setIsFormVisible(false);
                setDateError('');
                setTitleError('');
              }}
              className="cancel-button"
            >
              Anuluj
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AddTaskForm;