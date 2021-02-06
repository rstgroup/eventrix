import {
    useState,
    useContext,
    useEffect,
    useCallback,
} from 'react';
import { EventrixContext } from '../context';

function useEventState(eventName, Context = EventrixContext) {
    const { eventrix } = useContext(Context);
    const [eventState, setEventState] = useState();

    const listener = useCallback(
        data => setEventState(data),
        [setEventState],
    );

    useEffect(() => {
        eventrix.listen(eventName, listener);
        return () => {
            eventrix.unlisten(eventName, listener);
        };
    }, [eventName, listener]);

    return [eventState, setEventState];
}

export default useEventState;
