import {
    useState,
    useContext,
    useEffect,
    useCallback,
} from 'react';
import { EventrixContext } from '../context';

function useEventrixState(stateName, Context = EventrixContext) {
    const { eventrix } = useContext(Context);
    const [state, setState] = useState(eventrix.getState(stateName));

    const onSetEventrixState = useCallback(
        value => setState(value),
        [setState],
    );

    const setEventrixState = useCallback(
        (value) => { eventrix.emit('setState', { stateName, value }); },
        [eventrix.emit, stateName],
    );

    useEffect(() => {
        const stateEventName = `setState:${stateName}`;
        eventrix.listen(stateEventName, onSetEventrixState);
        onSetEventrixState(eventrix.getState(stateName));
        return () => {
            eventrix.unlisten(stateEventName, onSetEventrixState);
        };
    }, [stateName]);

    return [state, setEventrixState];
}

export default useEventrixState;
