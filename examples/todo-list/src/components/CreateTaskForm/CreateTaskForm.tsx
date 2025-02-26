import React, { FormEvent, useState } from 'react';
import { makeid } from '../../utils/helpers';
import './CreateTaskForm.css';
import { useEmit } from 'eventrix';
import { CREATE_TASK_EVENT_NAME } from '../../taskEvents';

const CreateTaskForm: React.FC = () => {
    const emit = useEmit();
    const [title, setTitle] = useState('');

    const onSubmit = (e: FormEvent) => {
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
