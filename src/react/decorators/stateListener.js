function stateListener(statePath) {
    return function registerStateListenerDecorator(target, name, descriptor) {
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