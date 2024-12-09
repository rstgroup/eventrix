import React from 'react';
import { EventrixProvider } from 'eventrix';
import eventrix from './eventrix/index';
import './index.css';
import Logo from './components/Logo';
import CreateTaskForm from './components/CreateTaskForm/CreateTaskForm';
import TodoList from './components/TodoList/TodoList';
import TodoFooter from './components/TodoFooter';

export default function App() {
    return (
        <EventrixProvider eventrix={eventrix}>
            <div className="App">
                <Logo />
                <h1>TO DO LIST</h1>
                <div className="todo-app">
                    <CreateTaskForm />
                    <TodoList />
                    <TodoFooter />
                </div>
            </div>
        </EventrixProvider>
    );
}
