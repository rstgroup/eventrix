import {
    useState,
    useContext,
    useEffect,
} from 'react';
import { EventrixContext } from '../context';

function useEventrixState(stateName, Context = EventrixContext) {
    const { eventrix } = useContext(Context);
    const [state, setState] = useState(eventrix.getState(stateName));
    useEffect(() => {
        function onSetEventrixState(value) {
            setState(value);
        }
        eventrix.listen(`setState:${stateName}`, onSetEventrixState);
        onSetEventrixState(eventrix.getState(stateName));
        return () => {
            eventrix.unlisten(`setState:${stateName}`, onSetEventrixState);
        };
    }, [stateName]);
    const setEventrixState = (value) => {
        eventrix.emit('setState', { stateName, value });
    };
    return [state, setEventrixState];
}

export default useEventrixState;
