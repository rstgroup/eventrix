import { EventrixContext } from '../context';
import useEvent from './useEvent';

function useEventrixEvent(eventName, callback, Context = EventrixContext) {
    console.warn('useEventrixEvent is deprecated please use useEventState');
    return useEvent(eventName, callback, Context);
}

export default useEventrixEvent;
