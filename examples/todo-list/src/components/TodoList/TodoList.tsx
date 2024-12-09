import React from 'react';
import Task from '../Task';
import './TodoList.css';
import { useEventrixState } from 'eventrix';

const TodoList: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [tasks] = useEventrixState<any[]>('tasks');
    const [statusFilter, setStatusFilter] = useEventrixState('filter.status');
    const tasksList = statusFilter ? tasks.filter((task) => task.status === statusFilter) : tasks;
    return (
        <div>
            <div className="filters">
                <div className={`status-button ${!statusFilter ? 'active' : ''}`} onClick={() => setStatusFilter('')}>
                    All
                </div>
                <div className={`status-button ${statusFilter === 'todo' ? 'active' : ''}`} onClick={() => setStatusFilter('todo')}>
                    To do
                </div>
                <div className={`status-button ${statusFilter === 'done' ? 'active' : ''}`} onClick={() => setStatusFilter('done')}>
                    Done
                </div>
            </div>
            <div className="list">
                {tasksList.length === 0 && <div className="list-placeholder">Tasks list empty</div>}
                {tasksList.map((task) => (
                    <Task key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
};

export default TodoList;
