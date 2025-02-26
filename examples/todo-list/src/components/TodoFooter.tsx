import React from 'react';
import './TodoList/TodoList.css';
import { useEventrixState } from 'eventrix';

const TodoFooter: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [tasks] = useEventrixState<any[]>('tasks');
    const [statusFilter] = useEventrixState('filter.status');
    const tasksList = statusFilter ? tasks.filter((task) => task.status === statusFilter) : tasks;
    return <div className="todo-footer">Tasks count: {tasksList.length}</div>;
};

export default TodoFooter;
