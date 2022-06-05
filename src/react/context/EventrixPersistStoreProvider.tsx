import React, { useEffect, useRef, useState } from 'react';
import EventrixContext, { defaultEventrixInstance } from './context';
import { EventrixI } from '../../interfaces';
import { isPromise } from '../../helpers';

export interface EventrixPersistStoreProviderPropsI {
    eventrix: EventrixI;
    children: React.ReactNode;
    Loader: React.ElementType;
}

const EventrixPersistStoreProvider: React.FC<EventrixPersistStoreProviderPropsI> = ({ eventrix, children, Loader }): JSX.Element => {
    const persistStore = eventrix.persistStoreLoadPromise;
    const isPersistStorePromise = isPromise(persistStore);
    const [isLoading, setIsLoading] = useState<boolean>(isPersistStorePromise);
    const isUnmounted = useRef<boolean>(false);

    useEffect(() => {
        if (persistStore && isPersistStorePromise) {
            persistStore.then(() => {
                if (!isUnmounted.current) {
                    setIsLoading(false);
                }
            });
        }
        return () => {
            isUnmounted.current = true;
        };
    }, [eventrix]);

    if (isLoading) {
        return <Loader />;
    }

    if (!eventrix) {
        return <EventrixContext.Provider value={{ eventrix: defaultEventrixInstance }}>{children}</EventrixContext.Provider>;
    }
    return <EventrixContext.Provider value={{ eventrix }}>{children}</EventrixContext.Provider>;
};

export default EventrixPersistStoreProvider;
