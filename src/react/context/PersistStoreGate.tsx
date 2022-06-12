import React, { useEffect, useRef, useState } from 'react';
import { EventrixI } from '../../interfaces';
import { isPromise } from '../../helpers';

export interface PersistStoreGatePropsI {
    eventrix: EventrixI;
    children: React.ReactNode;
    loader?: React.ElementType;
}

const PersistStoreGate: React.FC<PersistStoreGatePropsI> = ({ eventrix, children, loader: Loader }): JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(isPromise(eventrix.persistStoreLoadPromise));
    const isUnmounted = useRef<boolean>(false);

    useEffect(() => {
        const persistStoreLoad = eventrix.persistStoreLoadPromise;
        const isPersistStorePromise = isPromise(persistStoreLoad);

        if (persistStoreLoad && isPersistStorePromise) {
            persistStoreLoad.then(() => {
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
        return Loader ? <Loader /> : <></>;
    }

    return <>{children}</>;
};

export default PersistStoreGate;
