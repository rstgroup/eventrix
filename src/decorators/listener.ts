import { DescriptorI } from "../interfaces";

export interface ListenerDeclarationI {
    eventName: string;
    name: string;
}

interface classType {
    new(): any;
    eventrixListeners?: ListenerDeclarationI[];
}

interface ListenerDecoratorI {
    (target: classType, name: string, descriptor: DescriptorI): DescriptorI;
}

function listener(eventName: string): ListenerDecoratorI {
    return function registerListenerDecorator(target: classType, name: string, descriptor: DescriptorI): DescriptorI {
        if (!Array.isArray(target.eventrixListeners)) {
            target.eventrixListeners = [];
        }
        target.eventrixListeners.push({ eventName, name });
        return descriptor;
    };
}
export default listener;