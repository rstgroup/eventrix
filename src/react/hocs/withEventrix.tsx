import React, { forwardRef, ForwardRefExoticComponent, PropsWithoutRef, ReactNode, RefAttributes, useContext } from 'react';
import { EventrixContext } from '../context';
import { EventrixI } from '../../interfaces';

function withEventrix<PropsI, R = unknown>(
    BaseComponent: React.ComponentType<PropsI & { eventrix: EventrixI }>,
): ForwardRefExoticComponent<PropsWithoutRef<PropsI> & RefAttributes<R>> {
    return forwardRef<R, PropsI>((props: PropsWithoutRef<PropsI>, ref): ReactNode => {
        const context = useContext(EventrixContext);
        // @ts-ignore
        return <BaseComponent {...props} ref={ref} eventrix={context.eventrix} />;
    });
}

export default withEventrix;
