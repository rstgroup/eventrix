import React, { useState } from 'react';
import { CREATE_TASK_EVENT_NAME } from '../../eventrix/tasks';
import { makeid } from '../../utils/helpers';
import './CreateTaskForm.css';
import { useEmit } from 'eventrix';

const CreateTaskForm: React.FC = () => {
    const emit = useEmit();
    const [title, setTitle] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        if (title) {
            const task = {
                id: makeid(),
                title,
                status: 'todo',
            };
            emit(CREATE_TASK_EVENT_NAME, { task });
            setTitle('');
            return;
        }
    };

    return (
        <div className="taskFormWrapper">
            <form onSubmit={onSubmit}>
                <input name="title" onChange={(e) => setTitle(e.target.value)} value={title} />
                <button type="submit">Add task</button>
            </form>
        </div>
    );
};

export default CreateTaskForm;
