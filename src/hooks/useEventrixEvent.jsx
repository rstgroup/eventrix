import {
    useState,
    useContext,
    useEffect,
} from 'react';
import { EventrixContext } from '../context';

function useEventrixEvent(eventName, Context = EventrixContext) {
    const { eventrix } = useContext(Context);
    const [eventData, setEventData] = useState();
    useEffect(() => {
        function listener(data) {
            setEventData(data);
        }
        eventrix.listen(eventName, listener);
        return () => {
            eventrix.unlisten(eventName, listener);
        };
    });
    return [eventData, setEventData];
}

export default useEventrixEvent;
