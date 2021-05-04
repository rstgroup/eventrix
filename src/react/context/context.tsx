import React from 'react';
import Eventrix from '../../Eventrix';
import { EventrixI } from "../../interfaces";

const EventrixContext = React.createContext<{ eventrix: EventrixI }>({
    eventrix: new Eventrix({}),
});

export default EventrixContext;
