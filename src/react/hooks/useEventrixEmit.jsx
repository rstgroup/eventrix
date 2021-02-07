import { EventrixContext } from '../context';
import useEmit from './useEmit';

function useEventrixEmit(stateName, Context = EventrixContext) {
    console.warn('useEventrixEmit is deprecated please use useEmit');
    return useEmit(stateName, Context);
}

export default useEventrixEmit;
