import {
    useContext,
    useEffect,
} from 'react';
import { EventrixContext } from '../context';
import { EventsListenerI } from "../../interfaces";

function useEvent(eventName: string, callback: EventsListenerI, Context? = EventrixContext): void {
    const { eventrix } = useContext(Context);
    useEffect(() => {
        eventrix.listen(eventName, callback);
        return () => {
            eventrix.unlisten(eventName, callback);
        };
    }, [eventName, callback]);
}

export default useEvent;
