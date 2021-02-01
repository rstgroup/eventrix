function listener(eventName) {
    return function registerReceiverDecorator(target, name, descriptor) {
        const method = descriptor.value;
        if (!Array.isArray(target.eventrixListeners)) {
            target.eventrixListeners = [];
        }
        target.eventrixListeners.push({ eventName, name });
        descriptor.value = function (...args) {
            return method.apply(this, ...args);
        };
        return descriptor;
    };
}
export default listener;