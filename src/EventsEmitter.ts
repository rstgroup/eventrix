import get from 'lodash/get';
import { isPromise } from './helpers';
import { EventsEmitterI, EventsListenerI, StateManagerI, ErrorCallback } from './interfaces';

class EventsEmitter implements EventsEmitterI {
    listeners: {
        [key: string]: EventsListenerI[];
    };
    stateManager?: StateManagerI;
    matchedListenersCache: {
        [key: string]: string[];
    };
    errorCallbacks: Set<ErrorCallback>;

    constructor() {
        this.listeners = {};
        this.matchedListenersCache = {};
        this.errorCallbacks = new Set();

        this.emit = this.emit.bind(this);
        this.emitWild = this.emitWild.bind(this);
        this.onError = this.onError.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    onError(errorCallback: ErrorCallback) {
        this.errorCallbacks.add(errorCallback);
    }

    handleError(error: Error, eventName: string, eventData: any, state: any): void {
        this.errorCallbacks.forEach((callback: ErrorCallback) => {
            callback(error, eventName, eventData, state);
        });
    }

    useStore(stateManager: StateManagerI): void {
        this.stateManager = stateManager;
    }

    listen(name: string, listener: EventsListenerI): void {
        if (!this.listeners[name]) {
            this.clearMatchedListenersCache();
            this.listeners[name] = [];
        }
        if (typeof listener !== 'function') {
            console.warn(`EventsEmitter->listen - "${name}" listener is not a function`);
            return;
        }
        if (this.listeners[name].indexOf(listener) > -1) {
            console.warn(`EventsEmitter->listen - "${name}" events listener is already registered`);
            return;
        }
        this.listeners[name].push(listener);
    }

    unlisten(name: string, listener: EventsListenerI): void {
        if (!this.listeners[name]) {
            console.warn(`EventsEmitter->unlisten - "${name}" event not registered`);
            return;
        }
        if (this.listeners[name].length === 0) {
            console.warn(`EventsEmitter->unlisten - "${name}" event dont have registered listener`);
            return;
        }
        const index = this.listeners[name].indexOf(listener);
        if (index < 0) {
            console.warn(`EventsEmitter->unlisten - "${name}" listener not exists`);
            return;
        }
        this.listeners[name].splice(index, 1);
        if (this.listeners[name].length === 0) {
            delete this.listeners[name];
            this.clearMatchedListenersCache();
        }
    }

    getEventData<EventDataI>(name: string, eventName: string, data: EventDataI): EventDataI {
        if (name === eventName) {
            return data;
        }
        const path = eventName.slice(name.length, eventName.length);
        const hasDotAsFirstChar = path.indexOf('.') === 0;
        return path ? get(data, hasDotAsFirstChar ? path.slice(1, path.length) : path) : data;
    }

    runListeners<EventDataI>(name: string, data: EventDataI, receiversData: any[]): void {
        if (this.listeners[name] && Array.isArray(this.listeners[name])) {
            this.listeners[name].forEach((listener) => listener(data, receiversData));
        }
    }

    setMatchedListenersCache(eventName: string, matchedEventNames: string[]) {
        this.matchedListenersCache[eventName] = matchedEventNames;
    }

    clearMatchedListenersCache() {
        this.matchedListenersCache = {};
    }

    getMatchedListeners(name: string): string[] {
        if (this.matchedListenersCache[name]) {
            return this.matchedListenersCache[name];
        }
        const listenEvents = Object.keys(this.listeners);
        const matchedEvents = listenEvents.filter((eventName) => eventName.indexOf(name) === 0);
        this.setMatchedListenersCache(name, matchedEvents);
        return matchedEvents;
    }

    emitWild<EventDataI>(name: string, data: EventDataI): void {
        try {
            const matchedEvents = this.getMatchedListeners(name);
            return matchedEvents.forEach((eventName) => {
                this.runListeners(eventName, this.getEventData(name, eventName, data), []);
            });
        } catch (error) {
            if (this.errorCallbacks.size > 0) {
                this.handleError(error, name, data, this.stateManager!.getState());
            }
        }
    }

    emit<EventDataI = any>(name: string, data: EventDataI): Promise<any> {
        try {
            const receiversResponse = this.stateManager?.runReceivers<EventDataI>(name, data);
            if (isPromise(receiversResponse)) {
                return receiversResponse.then((receiversData: any) => {
                    this.runListeners(name, data, receiversData);
                });
            }
            this.runListeners(name, data, receiversResponse);
            return Promise.resolve(receiversResponse);
        } catch (error) {
            if (this.errorCallbacks.size > 0) {
                this.handleError(error, name, data, this.stateManager!.getState());
            }
            return Promise.reject(error);
        }
    }
}

export default EventsEmitter;
