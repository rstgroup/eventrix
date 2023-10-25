import React, { useCallback, useContext, useState } from 'react';
import { EventrixContext, useEvent } from '../react';
import { DISPATCH_EVENT_NAME } from './events';
import { mapStateToPropsType, mapDispatchToPropsType, ActionI } from '../interfaces';

function connect<P>(mapStateToProps: mapStateToPropsType, mapDispatchToProps: mapDispatchToPropsType) {
    return (BaseComponent: any) => {
        const connectWrapper = (props: P) => {
            const [state, setState] = useState(true);
            const { eventrix } = useContext(EventrixContext);
            const storeState = eventrix.getState();
            const updateState = useCallback(() => {
                setState(!state);
            }, [state, setState]);
            useEvent('setState:*', updateState);
            const dispatch = useCallback((action: ActionI) => eventrix.emit(DISPATCH_EVENT_NAME, action), [eventrix]);

            return <BaseComponent {...props} {...mapStateToProps(storeState)} {...mapDispatchToProps(dispatch)} />;
        };
        return connectWrapper;
    };
}

export default connect;
