import { useContext, useEffect, useCallback } from 'react';
import { EventrixContext } from '../context';
import { fetchToStateReceiver } from '../../EventsReceiver';
import { FetchMethodI, EmitFetchI } from '../../interfaces';

function useFetchToState<EventDataI>(eventName: string, statePath: string, fetchMethod: FetchMethodI): [EmitFetchI<EventDataI>] {
    const { eventrix } = useContext(EventrixContext);
    const emitFetch = useCallback((data: EventDataI) => eventrix.emit(eventName, data), [eventrix.emit, eventName]);

    useEffect(() => {
        const statePathWithScope = eventrix.getStatePathWithScope(statePath) as string;
        const eventNameWithScope = eventrix.getEventNameWithScope(eventName);
        const fetchReceiver = fetchToStateReceiver(eventNameWithScope, statePathWithScope, fetchMethod);
        eventrix.useReceiver(fetchReceiver);
        return () => {
            eventrix.removeReceiver(fetchReceiver);
        };
    }, [eventName, statePath, fetchMethod]);

    return [emitFetch];
}

export default useFetchToState;
