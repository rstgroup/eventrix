import { useCallback } from 'react';
import { useEmit } from '../react';
import { DISPATCH_EVENT_NAME } from './events';
import { ActionI, DispatchI } from '../interfaces';

function useDispatch(): DispatchI {
    const emit = useEmit();
    const dispatch = useCallback(
        (action: ActionI) => {
            emit(DISPATCH_EVENT_NAME, action);
        },
        [emit],
    );
    return dispatch;
}

export default useDispatch;
