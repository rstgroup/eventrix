import { useContext } from 'react';
import { EventrixContext } from '../context';

function useEventrixEmit(stateName, Context = EventrixContext) {
    const { eventrix } = useContext(Context);
    return eventrix.emit;
}

export default useEventrixEmit;
