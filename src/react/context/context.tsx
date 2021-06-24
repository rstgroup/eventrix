import React from 'react';
import Eventrix from '../../Eventrix';
import { EventrixI } from "../../interfaces";

export const defaultEventrixInstance = new Eventrix({});

const EventrixContext = React.createContext<{ eventrix: EventrixI }>({
    eventrix: defaultEventrixInstance,
});

export default EventrixContext;
