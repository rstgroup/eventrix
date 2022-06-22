import { useCallback, useContext, useState } from 'react';
import { EventrixContext, useEvent } from '../react';
import { mapStateToPropsType } from '../interfaces';

function useSelector<StateI = any, ReducedStateI = any>(selector: mapStateToPropsType<StateI, ReducedStateI>): ReducedStateI {
    const { eventrix } = useContext(EventrixContext);
    const getSelectorValue = useCallback((): ReducedStateI => selector(eventrix.getState()), [selector, eventrix]);
    const [value, setValue] = useState<ReducedStateI>(getSelectorValue);
    const stateUpdateListener = useCallback(() => {
        const newValue = getSelectorValue();
        if (newValue !== value) {
            setValue(newValue);
        }
    }, [setValue, value, getSelectorValue]);
    useEvent('setState:*', stateUpdateListener);
    return value;
}

export default useSelector;
