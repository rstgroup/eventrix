import EventsReceiver, { fetchToStateReceiver } from "../EventsReceiver";
import {EventrixI, EventsListenerI, FetchMethodI, ReceiverI} from "../interfaces";
import {ReceiverDeclarationI} from "./receiver";
import {FetchToStateReceiverDeclarationI} from "./fetchToState";
import {ListenerDeclarationI} from "./listener";

interface ServicesI {
    eventrix: EventrixI;
    [key: string]: any;
}

interface classType {
    new(services: ServicesI, ...rest: any[]): classType;
    [key: string]: FetchMethodI | ReceiverI | EventsListenerI | any;
    eventrix: EventrixI;
    eventrixReceivers?: ReceiverDeclarationI[];
    eventrixFetchToStateReceivers?: FetchToStateReceiverDeclarationI[];
    eventrixListeners?: ListenerDeclarationI[];
}

function useEventrix(Class: classType): classType {
    return class extends Class {
        constructor(services: ServicesI, ...rest: any[]) {
            super(services, ...rest);
            this.eventrix = services.eventrix;
            if (Array.isArray(this.eventrixReceivers)) {
                this.eventrixReceivers.forEach(({ eventsNames, name }) => {
                    this[name] = this[name].bind(this);
                    this.eventrix!.useReceiver(new EventsReceiver(eventsNames, this[name]));
                });
            }
            if (Array.isArray(this.eventrixFetchToStateReceivers)) {
                this.eventrixFetchToStateReceivers.forEach(({ eventName, statePath, name }) => {
                    this[name] = this[name].bind(this);
                    this.eventrix!.useReceiver(fetchToStateReceiver(eventName, statePath, this[name]))
                });
            }
            if (Array.isArray(this.eventrixListeners)) {
                this.eventrixListeners.forEach(({ eventName, name }) => {
                    this[name] = this[name].bind(this);
                    this.eventrix!.listen(eventName, this[name]);
                });
            }
        }
    }
};

export default useEventrix;