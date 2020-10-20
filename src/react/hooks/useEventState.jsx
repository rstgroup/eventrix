import {
    useState,
    useContext,
    useEffect,
} from 'react';
import { EventrixContext } from '../context';

function useEventState(eventName, Context = EventrixContext) {
    const { eventrix } = useContext(Context);
    const [eventState, setEventState] = useState();
    useEffect(() => {
        function listener(data) {
            setEventState(data);
        }
        eventrix.listen(eventName, listener);
        return () => {
            eventrix.unlisten(eventName, listener);
        };
    }, [eventName]);
    return [eventState, setEventState];
}

export default useEventState;
