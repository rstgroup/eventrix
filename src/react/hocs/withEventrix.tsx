import React, { useContext } from 'react';
import { EventrixContext } from '../context';

const withEventrix = (BaseComponent: any, Context? = EventrixContext) =>
    (props) => {
        const context = useContext(Context);
        return <BaseComponent {...props} eventrix={context.eventrix} />;
    };

export default withEventrix;
