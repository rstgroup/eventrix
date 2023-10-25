import React from 'react';
import Eventrix from '../../Eventrix';
import { EventrixI } from '../../interfaces';

export const defaultEventrixInstance = new Eventrix({});

type EventrixContextType = {
    eventrix: EventrixI;
};

const EventrixContext = React.createContext<EventrixContextType>({
    eventrix: defaultEventrixInstance,
});

export default EventrixContext;
