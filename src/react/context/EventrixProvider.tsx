import React from 'react';
import EventrixContext, { defaultEventrixInstance } from './context';
import { EventrixI } from '../../interfaces';

export interface EventrixProviderPropsI {
    eventrix: EventrixI;
    children: React.ReactNode;
}

const EventrixProvider: React.FC<EventrixProviderPropsI> = ({ eventrix, children }): JSX.Element => {
    if (!eventrix) {
        return <EventrixContext.Provider value={{ eventrix: defaultEventrixInstance }}>{children}</EventrixContext.Provider>;
    }
    return <EventrixContext.Provider value={{ eventrix }}>{children}</EventrixContext.Provider>;
};

export default EventrixProvider;
