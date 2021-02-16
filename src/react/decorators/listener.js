function listener(eventName) {
    return function registerListenerDecorator(target, name, descriptor) {
        if (!Array.isArray(target.eventrixListeners)) {
            target.eventrixListeners = [];
        }
        target.eventrixListeners.push({ eventName, name });
        return descriptor;
    };
}
export default listener;