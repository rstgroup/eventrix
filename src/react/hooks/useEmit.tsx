import { useContext } from 'react';
import { EventrixContext } from '../context';
import { EmitI } from '../../interfaces';

function useEmit<EventDataI>(): EmitI<EventDataI> {
    const { eventrix } = useContext(EventrixContext);
    return eventrix.emit;
}

export default useEmit;
