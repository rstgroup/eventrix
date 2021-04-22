import { EventrixContext } from '../context';
import useEmit from './useEmit';
import { EmitI } from "../../interfaces";

function useEventrixEmit<EventDataI>(Context? = EventrixContext): EmitI<EventDataI> {
    console.warn('useEventrixEmit is deprecated please use useEmit');
    return useEmit<EventDataI>(Context);
}

export default useEventrixEmit;
