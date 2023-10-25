import EventsReceiver, { fetchToStateReceiver } from '../EventsReceiver';
import { EventrixI } from '../interfaces';

export interface ReceiverRegister {
    eventsNames: string[] | string;
    name: string;
}

export interface FetchToStateReceiversRegister {
    eventName: string;
    statePath: string;
    name: string;
}

export interface ListenersRegister {
    eventName: string;
    name: string;
}

export interface ServicesI {
    eventrix: EventrixI;
    [key: string]: any;
}

export interface EventrixClassI {
    new (services: ServicesI, ...args: any[]): EventrixClassI;
    eventrix?: EventrixI;
    eventrixReceiver?: ReceiverRegister[];
    eventrixFetchToStateReceivers?: FetchToStateReceiversRegister[];
    eventrixListeners?: ListenersRegister[];
    [key: string]: any;
}

function useEventrix(targetClass: any) {
    const original: EventrixClassI = targetClass;
    const eventrixClass: any = function (services: ServicesI, ...args: any[]) {
        const classInstance = new original(services, ...args);
        classInstance.eventrix = services.eventrix;
        if (Array.isArray(classInstance.eventrixReceivers)) {
            classInstance.eventrixReceivers.forEach(({ eventsNames, name }) => {
                classInstance[name] = classInstance[name].bind(classInstance);
                classInstance.eventrix!.useReceiver(new EventsReceiver(eventsNames, classInstance[name]));
            });
        }
        if (Array.isArray(classInstance.eventrixFetchToStateReceivers)) {
            classInstance.eventrixFetchToStateReceivers.forEach(({ eventName, statePath, name }) => {
                classInstance[name] = classInstance[name].bind(classInstance);
                classInstance.eventrix!.useReceiver(fetchToStateReceiver(eventName, statePath, classInstance[name]));
            });
        }
        if (Array.isArray(classInstance.eventrixListeners)) {
            classInstance.eventrixListeners.forEach(({ eventName, name }) => {
                classInstance[name] = classInstance[name].bind(classInstance);
                classInstance.eventrix!.listen(eventName, classInstance[name]);
            });
        }
        return classInstance;
    };
    eventrixClass.prototype = original.prototype;
    return eventrixClass;
}

export default useEventrix;
