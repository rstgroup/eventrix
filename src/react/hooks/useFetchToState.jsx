import {
    useContext,
    useEffect,
} from 'react';
import { EventrixContext } from '../context';
import { fetchToStateReceiver } from '../../EventsReceiver';

function useFetchToState(eventName, statePath, fetchMethod, Context = EventrixContext) {
    const { eventrix } = useContext(Context);
    function emitFetch(data) {
        eventrix.emit(eventName, data);
    }
    useEffect(() => {
        const fetchReceiver = fetchToStateReceiver(eventName, statePath, fetchMethod);
        eventrix.useReceiver(fetchReceiver);
        return () => {
            eventrix.removeReceiver(fetchReceiver);
        };
    }, [eventName]);
    return [emitFetch];
}

export default useFetchToState;
