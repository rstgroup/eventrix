import React from 'react';
import EventrixContext from './context';
import { EventrixI } from "../../interfaces";

export interface EventrixProviderPropsI {
    eventrix: EventrixI;
}

const EventrixProvider: React.FC<EventrixProviderPropsI> = ({ eventrix, children }): JSX.Element => {
    if (!eventrix) {
        return <EventrixContext.Provider>{children}</EventrixContext.Provider>;
    }
    return <EventrixContext.Provider value={{ eventrix }}>{ children }</EventrixContext.Provider>;
};

export default EventrixProvider;
