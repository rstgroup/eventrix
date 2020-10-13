import { useContext } from 'react';
import { EventrixContext } from '../context';

function useEventrixEmit(stateName, Context = EventrixContext) {
    console.warn('useEventrixEmit is deprecated please use useEmit');
    const { eventrix } = useContext(Context);
    return eventrix.emit;
}

export default useEventrixEmit;
