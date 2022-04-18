import { useContext, useCallback } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { EventrixContext } from '../context';
import { SetStateI } from '../../interfaces';
import { registerListeners } from '../../helpers';

function useEventrixState<StateI>(stateName: string): [StateI, SetStateI<StateI>] {
    const { eventrix } = useContext(EventrixContext);

    const getState = useCallback((): StateI => eventrix.getState(stateName), [stateName]);

    const subscribe = useCallback((onStoreChange: any) => registerListeners(eventrix, stateName, onStoreChange), [eventrix, stateName]);

    const setEventrixState = useCallback(
        (value: StateI) => {
            eventrix.emit('setState', { stateName, value });
        },
        [eventrix.emit, stateName],
    );

    const state = useSyncExternalStore<StateI>(subscribe, getState, getState);

    return [state, setEventrixState];
}

export default useEventrixState;
