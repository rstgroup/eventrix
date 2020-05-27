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

export default EventsReceiver;
