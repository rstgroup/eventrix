import * as React from "react";
import { DecoratorEventrixListenerI } from "../../interfaces";

export interface ClassComponentWithListeners extends React.ComponentClass {
    eventrixListeners?: DecoratorEventrixListenerI[];
}

interface DescriptorI {
    (): any | void;
}

interface ListenerDecoratorI {
    (ClassComponent: ClassComponentWithListeners, name: string, descriptor: DescriptorI): DescriptorI;
}

function listener(eventName: string): ListenerDecoratorI {
    return function registerListenerDecorator(target: ClassComponentWithListeners, name: string, descriptor: DescriptorI): DescriptorI {
        if (!Array.isArray(target.eventrixListeners)) {
            target.eventrixListeners = [];
        }
        target.eventrixListeners.push({ eventName, name });
        return descriptor;
    };
}
export default listener;