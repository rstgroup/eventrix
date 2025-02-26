import React, { forwardRef, ForwardRefExoticComponent, PropsWithoutRef, ReactNode, RefAttributes, useContext } from 'react';
import { EventrixContext } from '../context';
import { EventrixI } from '../../interfaces';

function withEventrix<PropsI, RefI = unknown>(
    BaseComponent: React.ComponentType<PropsI & { eventrix: EventrixI }>,
    Context = EventrixContext,
): ForwardRefExoticComponent<PropsWithoutRef<PropsI> & RefAttributes<RefI>> {
    return forwardRef<RefI, PropsI>((props: PropsWithoutRef<PropsI>, ref): ReactNode => {
        const context = useContext(Context);

        // @ts-ignore
        return <BaseComponent {...props} ref={ref} eventrix={context.eventrix} />;
    });
}

export default withEventrix;
