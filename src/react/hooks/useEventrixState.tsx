import { useState, useContext, useEffect, useCallback } from 'react';
import { EventrixContext } from '../context';
import { SetStateI } from '../../interfaces';
import { registerListeners } from '../../helpers';

function useEventrixState<StateI>(stateName: string): [StateI, SetStateI<StateI>] {
    const { eventrix } = useContext(EventrixContext);
    const stateNameWithScope = eventrix.getStatePathWithScope(stateName) as string;
    const [state, setState] = useState<StateI>(eventrix.getState<StateI>(stateName));

    const onSetEventrixState = useCallback(() => setState(eventrix.getState(stateName)), [setState, stateName]);

    const setEventrixState = useCallback(
        (value: StateI) => {
            const firstEventrixInstance = eventrix.getFirstParent();
            firstEventrixInstance.emit('setState', { stateName: stateNameWithScope, value });
        },
        [eventrix, stateName],
    );

    useEffect(() => {
        const unregisterListeners = registerListeners(eventrix, stateName, onSetEventrixState);
        onSetEventrixState();
        return () => {
            unregisterListeners();
        };
    }, [stateNameWithScope]);

    return [state, setEventrixState];
}

export default useEventrixState;
