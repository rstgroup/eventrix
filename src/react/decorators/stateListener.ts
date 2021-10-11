interface StateListenerDecoratorI {
    (ClassComponent: any, name: string, descriptor: any): any;
}

function stateListener(statePath: string): StateListenerDecoratorI {
    return function registerStateListenerDecorator(target: any, name: string, descriptor: any): any {
        if (!Array.isArray(target.eventrixListeners)) {
            target.eventrixListeners = [];
        }
        target.eventrixListeners.push({
            eventName: `setState:${statePath}`,
            name,
        });
        return descriptor;
    };
}
export default stateListener;
