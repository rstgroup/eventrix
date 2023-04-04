import React, { useContext, useMemo } from 'react';
import EventrixContext from './context';
import EventrixProvider from './EventrixProvider';

export interface EventrixProviderPropsI {
    event?: string;
    state?: string;
    eventSeparator?: string;
    children: React.ReactNode;
}

const EventrixScope: React.FC<EventrixProviderPropsI> = ({ event = '', eventSeparator = ':', state = '', children }): JSX.Element => {
    const { eventrix } = useContext(EventrixContext);
    const scopedEventrixInstance = useMemo(() => {
        return eventrix.create({
            stateScope: state,
            eventScope: event,
            eventSeparator,
        });
    }, [eventrix, event, eventSeparator, state]);
    return <EventrixProvider eventrix={scopedEventrixInstance}>{children}</EventrixProvider>;
};

export default EventrixScope;
