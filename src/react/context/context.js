import React from 'react';
import Eventrix from '../../Eventrix';

const EventrixContext = React.createContext({
    eventrix: new Eventrix({}),
});

export default EventrixContext;
