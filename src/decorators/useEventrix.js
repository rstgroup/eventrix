import EventsReceiver, { fetchToStateReceiver } from "../EventsReceiver";

function useEventrix(Class) {
    return class extends Class {
        constructor(services) {
            super(services);
            this.eventrix = services.eventrix;
            if (Array.isArray(this.eventrixReceivers)) {
                this.eventrixReceivers.forEach(({ eventsNames, name }) => {
                    this[name] = this[name].bind(this);
                    this.eventrix.useReceiver(new EventsReceiver(eventsNames, this[name]));
                });
            }
            if (Array.isArray(this.eventrixFetchToStateReceivers)) {
                this.eventrixFetchToStateReceivers.forEach(({ eventName, statePath, name }) => {
                    this[name] = this[name].bind(this);
                    this.eventrix.useReceiver(fetchToStateReceiver(eventName, statePath, this[name]))
                });
            }
            if (Array.isArray(this.eventrixListeners)) {
                this.eventrixListeners.forEach(({ eventName, name }) => {
                    this[name] = this[name].bind(this);
                    this.eventrix.listen(eventName, this[name]);
                });
            }
        }
    }
};

export default useEventrix;