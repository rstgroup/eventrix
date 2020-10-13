import {
    useContext,
    useEffect,
} from 'react';
import { EventrixContext } from '../context';

function useEvent(eventName, callback, Context = EventrixContext) {
    const { eventrix } = useContext(Context);
    useEffect(() => {
        eventrix.listen(eventName, callback);
        return () => {
            eventrix.unlisten(eventName, callback);
        };
    });
}

export default useEvent;
