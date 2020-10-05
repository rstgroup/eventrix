import {
    useState,
    useContext,
    useEffect,
} from 'react';
import { EventrixContext } from '../context';

function useEventrixEvent(eventName, Context = EventrixContext) {
    const { eventrix } = useContext(Context);
    const [eventData, setState] = useState();
    useEffect(() => {
        function listener(data) {
            setState(data);
        }
        eventrix.listen(eventName, listener);
        return () => {
            eventrix.unlisten(eventName, listener);
        };
    });
    return eventData;
}

export default useEventrixEvent;
