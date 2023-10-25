import { useContext, useEffect } from 'react';
import { EventrixContext } from '../context';
import { ReceiverI } from '../../interfaces';
import EventsReceiver from '../../EventsReceiver';

function useReceiver<EventDataI>(eventName: string, receiverMethod: ReceiverI<EventDataI>): void {
    const { eventrix } = useContext(EventrixContext);

    useEffect(() => {
        const eventNameWithScope = eventrix.getEventNameWithScope(eventName);
        const receiver = new EventsReceiver(eventNameWithScope, receiverMethod);
        eventrix.useReceiver(receiver);
        return () => {
            eventrix.removeReceiver(receiver);
        };
    }, [eventName, receiverMethod]);
}

export default useReceiver;
