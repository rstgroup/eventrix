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

export const fetchHandler = (fetchMethod, { success, error }) => {
    return (eventData, state, emit) =>
        fetchMethod(eventData, state, emit)
            .then((response) => {
                const { eventName, data, getData } = success;
                const successEventData = (getData && typeof getData === 'function') ? getData(response, eventData) : data;
                emit(eventName, successEventData);
                return response;
            })
            .catch((errorResponse) => {
                const { eventName, data, getData } = error;
                const errorEventData = (getData && typeof getData === 'function') ? getData(errorResponse, eventData) : data;
                emit(eventName, errorEventData);
            });
};

export const fetchToStateReceiver = (eventName, statePath, fetchMethod) => {
    return new EventsReceiver(eventName, (name, eventData, stateManager) => {
        const state = stateManager.getState();
        const emit = stateManager.eventsEmitter.emit;
        return fetchMethod(eventData, state, emit).then((nextState) => {
            if (nextState !== undefined) {
                const path =
                    typeof statePath === "function"
                        ? statePath(eventData, nextState)
                        : statePath;
                stateManager.setState(path, nextState);
                return nextState;
            }
        });
    });
};

export default EventsReceiver;
