import React, { useContext } from 'react';
import { EventrixContext } from '../context';
import { EventrixI } from '../../interfaces';

function withEventrix<PropsI>(BaseComponent: React.ComponentType<PropsI> | React.FC<PropsI>): React.FC<PropsI> {
     
    return (props: PropsI & { eventrix: EventrixI }): JSX.Element => {
        const context = useContext(EventrixContext);
        return <BaseComponent {...props} eventrix={context.eventrix} />;
    };
}

export default withEventrix;
