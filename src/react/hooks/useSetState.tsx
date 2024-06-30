import { useContext, useCallback } from 'react';
import { EventrixContext } from '../context';
import { SetStateI } from '../../interfaces';

function useSetState<StateI>(stateName: string): SetStateI<StateI> {
    const { eventrix } = useContext(EventrixContext);
    const stateNameWithScope = eventrix.getStatePathWithScope(stateName) as string;

    const setEventrixState = useCallback(
        (value: StateI) => {
            const firstEventrixInstance = eventrix.getFirstParent();
            return firstEventrixInstance.emit('setState', { stateName: stateNameWithScope, value });
        },
        [eventrix, stateName],
    );

    return setEventrixState;
}

export default useSetState;
