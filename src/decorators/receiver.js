function receiver(eventsNames) {
    return function registerReceiverDecorator(target, name, descriptor) {
        if (!Array.isArray(target.eventrixReceivers)) {
            target.eventrixReceivers = [];
        }
        target.eventrixReceivers.push({ eventsNames, name });
        return descriptor;
    };
}
export default receiver;