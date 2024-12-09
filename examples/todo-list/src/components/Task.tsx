import React from 'react';
import { MARK_TASK_AS_DONE_EVENT_NAME, MARK_TASK_AS_TODO_EVENT_NAME, REMOVE_TASK_EVENT_NAME } from '../eventrix/tasks';
import { useEmit } from 'eventrix';

interface TaskProps {
    task: {
        id: string;
        title: string;
        status: string;
    };
}

const Task: React.FC<TaskProps> = ({ task }) => {
    const emit = useEmit();
    return (
        <div className="list-item">
            <input
                type="checkbox"
                checked={task.status === 'done'}
                onChange={() => emit(task.status === 'todo' ? MARK_TASK_AS_DONE_EVENT_NAME : MARK_TASK_AS_TODO_EVENT_NAME, { id: task.id })}
            />
            <div className="task-title">{task.title}</div>
            <div className={`status ${task.status}`}>{task.status}</div>
            <button onClick={() => emit(REMOVE_TASK_EVENT_NAME, { id: task.id })} className="removeButton">
                X
            </button>
        </div>
    );
};

export default Task;
