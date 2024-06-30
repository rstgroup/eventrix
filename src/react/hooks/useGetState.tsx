import { useContext, useCallback } from 'react';
import { EventrixContext } from '../context';

function useGetState<StateI>(stateName: string): () => StateI | undefined {
    const { eventrix } = useContext(EventrixContext);

    const getState = useCallback(() => {
        return eventrix.getState<StateI>(stateName);
    }, [eventrix, stateName]);

    return getState;
}

export default useGetState;
