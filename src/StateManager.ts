import get from 'lodash/get';
import { isPromise, setValue, unsetValue } from './helpers';
import EventsReceiver from './EventsReceiver';
import { EventsEmitterI, EventsReceiverI, StateManagerI } from './interfaces';

class StateManager implements StateManagerI {
    eventsEmitter: EventsEmitterI;
    state: any;
    receivers: {
        [key: string]: EventsReceiverI[];
    };

    constructor(eventsEmitter: EventsEmitterI, initialState?: any, eventsReceivers?: EventsReceiverI[]) {
        this.eventsEmitter = eventsEmitter;
        this.state = initialState || {};
        this.receivers = {};
        this.eventsEmitter.useStore(this);
        if (eventsReceivers && Array.isArray(eventsReceivers)) {
            eventsReceivers.forEach((receiver) => {
                this.useReceiver(receiver);
            });
        }
        this.useReceiver(
            new EventsReceiver('setState', (name, data, store) => {
                const { stateName, value } = data;
                store.setState(stateName, value);
            }),
        );
    }

    useReceiver(receiver: EventsReceiverI): void {
        const eventsNames = receiver.getEventsNames();
        eventsNames.forEach((eventName) => this.registerReceiver(eventName, receiver));
    }

    removeReceiver(receiver: EventsReceiverI): void {
        const eventsNames = receiver.getEventsNames();
        eventsNames.forEach((eventName) => this.unregisterReceiver(eventName, receiver));
    }

    registerReceiver(name: string, receiver: EventsReceiverI): void {
        if (!this.receivers[name]) {
            this.receivers[name] = [];
        }
        if (typeof receiver.handleEvent !== 'function') {
            console.warn(`Store->registerReceiver - "${name}" receiver is not a function`);
            return;
        }
        if (this.receivers[name].indexOf(receiver) > -1) {
            console.warn(`Store->registerReceiver - "${name}" events receiver is already registered`);
            return;
        }
        this.receivers[name].push(receiver);
    }

    unregisterReceiver(name: string, receiver: EventsReceiverI): void {
        if (!this.receivers[name]) {
            console.warn(`Store->unregisterReceiver - "${name}" event not registered`);
            return;
        }
        if (this.receivers[name].length === 0) {
            console.warn(`Store->unregisterReceiver - "${name}" event dont have registered receiver`);
            return;
        }
        const index = this.receivers[name].indexOf(receiver);
        if (index < 0) {
            console.warn(`Store->unregisterReceiver - "${name}" receiver not exists`);
            return;
        }
        this.receivers[name].splice(index, 1);
    }

    runReceivers<EventDataI>(name: string, data: EventDataI): Promise<any> | any {
        const promisesList: Promise<any>[] = [];
        const receiversData: any[] = [];
        if (this.receivers[name] && Array.isArray(this.receivers[name])) {
            this.receivers[name].forEach((receiver) => {
                const receiverData = receiver.handleEvent(name, data, this);
                if (isPromise(receiverData)) {
                    return promisesList.push(receiverData);
                }
                if (receiverData) {
                    receiversData.push(receiverData);
                }
            });
        }
        if (this.receivers['*'] && Array.isArray(this.receivers['*'])) {
            this.receivers['*'].forEach((receiver) => receiver.handleEvent(name, data, this));
        }
        if (promisesList.length) {
            return Promise.all(promisesList).then((receiversResponse) => [...receiversResponse, ...receiversData]);
        }
        return receiversData;
    }

    setState<StateValue>(path: string, value: StateValue): void {
        if (path) {
            if (value === undefined) {
                unsetValue(this.state, path);
            } else {
                setValue(this.state, path, value);
            }
            this.emitEvents(path, true);
            return;
        }
        this.state = value;
    }

    emitEvents(path: string, isFullPath?: boolean): void {
        const pathElements = path.split('.');
        const value = this.getState(path);
        this.eventsEmitter.emit(`setState:${path}`, value);
        if (pathElements.length > 1) {
            this.emitEvents(this.getParentPath(path));
        }
        if (isFullPath) {
            this.eventsEmitter.emit('setState:*', this.getState());
            this.eventsEmitter.emit(`setState:${path}.*`, value);
        }
    }

    getParentPath(path: string): string {
        const pathElements = path.split('.');
        if (pathElements.length === 1) {
            return '';
        }
        pathElements.pop();
        return pathElements.join('.');
    }

    getState<StateValue>(path?: string): StateValue {
        if (!path) {
            return this.state;
        }
        return get(this.state, path);
    }
}

export default StateManager;
