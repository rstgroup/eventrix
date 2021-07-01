export interface ListenerDeclarationI {
    eventName: string;
    name: string;
}

interface classType {
    eventrixListeners?: ListenerDeclarationI[];
}

interface ListenerDecoratorI {
    (target: classType, name: string, descriptor: any): any;
}

function listener(eventName: string): ListenerDecoratorI {
    return function registerListenerDecorator(target: classType, name: string, descriptor: any): any {
        if (!Array.isArray(target.eventrixListeners)) {
            target.eventrixListeners = [];
        }
        target.eventrixListeners.push({ eventName, name });
        return descriptor;
    };
}
export default listener;
