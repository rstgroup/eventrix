import React from 'react';
import { EventrixProvider } from 'eventrix';
import eventrix from './services/Eventrix';
import Logo from './Logo';
import './index.css';
import UsersModule from './modules/Users/Users';

export default function App() {
    return (
        <EventrixProvider eventrix={eventrix}>
            <div className="App">
                <Logo />
                <UsersModule />
            </div>
        </EventrixProvider>
    );
}
