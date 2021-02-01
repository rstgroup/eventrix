function fetchToState(eventName, statePath) {
    return function registerFetchToStateReceiverDecorator(target, name, descriptor) {
        if (!Array.isArray(target.eventrixFetchToStateReceivers)) {
            target.eventrixFetchToStateReceivers = [];
        }
        target.eventrixFetchToStateReceivers.push({ eventName, statePath, name });
        return descriptor;
    };
}
export default fetchToState;