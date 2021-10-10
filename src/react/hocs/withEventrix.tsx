import React, { useContext } from 'react';
import { EventrixContext } from '../context';
import { EventrixI } from '../../interfaces';

function withEventrix<PropsI extends { eventrix: EventrixI }>(
    BaseComponent: React.ComponentType<PropsI> | React.FC<PropsI>,
    Context = EventrixContext,
): React.FC<PropsI> {
    // eslint-disable-next-line react/display-name
    return (props: PropsI): JSX.Element => {
        const context = useContext(Context);
        return <BaseComponent {...props} eventrix={context.eventrix} />;
    };
}

export default withEventrix;
