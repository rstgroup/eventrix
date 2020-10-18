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
            if (Array.isArray(value)) {
                return setState([...value]);
            }
            if (typeof value === 'object' && value !== null) {
                return setState({ ...value });
            }
            return setState(value);
        }
        eventrix.listen(`setState:${stateName}`, onSetEventrixState);
        if (state === undefined) {
            onSetEventrixState(eventrix.getState(stateName));
        }
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
