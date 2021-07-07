import {
    useContext,
    useEffect,
    useCallback,
} from 'react';
import { EventrixContext } from '../context';
import { fetchToStateReceiver } from '../../EventsReceiver';
import { FetchMethodI, EmitFetchI } from "../../interfaces";

function useFetchToState<EventDataI>(eventName: string, statePath: string, fetchMethod: FetchMethodI): [EmitFetchI<EventDataI>] {
    const { eventrix } = useContext(EventrixContext);
    const emitFetch = useCallback(
        data => eventrix.emit(eventName, data),
        [eventrix.emit, eventName],
    );

    useEffect(() => {
        const fetchReceiver = fetchToStateReceiver(eventName, statePath, fetchMethod);
        eventrix.useReceiver(fetchReceiver);
        return () => {
            eventrix.removeReceiver(fetchReceiver);
        };
    }, [eventName, statePath, fetchMethod]);

    return [emitFetch];
}

export default useFetchToState;
