import React, { useContext, useEffect, useCallback } from 'react';
import { EventrixContext } from '../context';
import { ReceiverI } from '../../interfaces';
import EventsReceiver from '../../EventsReceiver';

function useReceiver<EventDataI>(
    eventName: string,
    receiverMethod: ReceiverI<EventDataI>,
    receiverDependenciesList: React.DependencyList,
): void {
    const { eventrix } = useContext(EventrixContext);
    const receiverCallback = useCallback(receiverMethod, receiverDependenciesList);

    useEffect(() => {
        const receiver = new EventsReceiver(eventName, receiverCallback);
        eventrix.useReceiver(receiver);
        return () => {
            eventrix.removeReceiver(receiver);
        };
    }, [eventName, receiverCallback]);
}

export default useReceiver;
