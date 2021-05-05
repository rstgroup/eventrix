import * as React from "react";
import { DecoratorEventrixListenerI } from "../../interfaces";

export interface ClassComponentWithListeners extends React.ComponentClass {
    eventrixListeners?: DecoratorEventrixListenerI[];
}

interface DescriptorI {
    (): any | void;
}

interface StateListenerDecoratorI {
    (ClassComponent: ClassComponentWithListeners, name: string, descriptor: DescriptorI): DescriptorI;
}

function stateListener(statePath: string): StateListenerDecoratorI {
    return function registerStateListenerDecorator(target: ClassComponentWithListeners, name: string, descriptor: DescriptorI): DescriptorI{
        if (!Array.isArray(target.eventrixListeners)) {
            target.eventrixListeners = [];
        }
        target.eventrixListeners.push({
            eventName: `setState:${statePath}`,
            name
        });
        return descriptor;
    };
}
export default stateListener;