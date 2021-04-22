import { useContext } from 'react';
import { EventrixContext } from '../context';
import { EmitI } from "../../interfaces";

function useEmit<EventDataI>(Context? = EventrixContext): EmitI<EventDataI> {
    const { eventrix } = useContext(Context);
    return eventrix.emit;
}

export default useEmit;
