class EventsReceiver {
    constructor(eventsNames, receiver) {
        this.eventsNames = Array.isArray(eventsNames) ? eventsNames : [eventsNames];
        this.receiver = receiver;
    }
    getEventsNames() {
        return this.eventsNames;
    }
    handleEvent(name, data, store) {
        return this.receiver(name, data, store);
    }
}

export const fetchToStateReceiver = (eventName, statePath, fetchMethod) => {
    return new EventsReceiver(eventName, (name, eventData, stateManager) => {
        const state = stateManager.getState();
        return fetchMethod(eventData, state).then((nextState) => {
            const path =
                typeof statePath === "function"
                    ? statePath(eventData, nextState)
                    : statePath;
            stateManager.setState(path, nextState);
            return nextState;
        });
    });
};

export default EventsReceiver;
