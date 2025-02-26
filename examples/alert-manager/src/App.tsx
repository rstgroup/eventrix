import Alerts from './components/Alerts';
import Logo from './components/Logo';
import Buttons from './components/Buttons';
import './index.css';
import React from 'react';

export default function App() {
    return (
        <div className="App">
            <Logo />
            <h1>Alerts manager</h1>
            <Buttons />
            <Alerts />
        </div>
    );
}
