import React, { useContext } from 'react';
import { TaskContext } from '../App';
import TaskItem from './TaskItem';

function TaskList() {
  const { tasks } = useContext(TaskContext);

  // Dodaj sprawdzenie, czy tasks istnieje
  if (!tasks) {
    return <div>Ładowanie zadań...</div>;
  }

  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <p>Brak zadań do wyświetlenia</p>
      ) : (
        tasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))
      )}
    </div>
  );
}

export default TaskList;