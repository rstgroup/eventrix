import { EventrixContext } from '../context';
import useEvent from './useEvent';
import {EventsListenerI} from "../../interfaces";

function useEventrixEvent(eventName: string, callback: EventsListenerI, Context = EventrixContext): void {
    console.warn('useEventrixEvent is deprecated please use useEventState');
    useEvent(eventName, callback, Context);
}

export default useEventrixEvent;
