import { useState, useContext, useEffect, useCallback } from 'react';
import { EventrixContext } from '../context';
import { SetStateI } from '../../interfaces';

function useEventState<EventStateI>(eventName: string): [EventStateI | undefined, SetStateI<EventStateI>] {
    const { eventrix } = useContext(EventrixContext);
    const [eventState, setEventState] = useState<EventStateI>();

    const listener = useCallback((data: EventStateI) => setEventState(data), [setEventState]);

    useEffect(() => {
        eventrix.listen(eventName, listener);
        return () => {
            eventrix.unlisten(eventName, listener);
        };
    }, [eventName, listener]);

    return [eventState, setEventState];
}

export default useEventState;
