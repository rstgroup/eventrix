import get from 'lodash/get';
import { isPromise } from './helpers';

class EventsEmitter {
    constructor() {
        this.listeners = {};
    }

    useStore(store) {
        this.store = store;
    }

    listen(name, listener) {
        if (!this.listeners[name]) {
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

    unlisten(name, listener) {
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
    }

    getEventData(name, eventName, data) {
        const path = eventName.slice(name.length, eventName.length);
        return path ? get(data, path) : data;
    }

    runMatchedListeners(name, data, receiversData) {
        if (name.indexOf('*') === name.length - 1) {
            const eventNameToMatch = name.slice(0, -1);
            const listenEvents = Object.keys(this.listeners);
            const matchedEvents = listenEvents.filter((eventName) => eventName.indexOf(eventNameToMatch) === 0);
            return matchedEvents.forEach(eventName => {
                if(this.listeners[eventName] && Array.isArray(this.listeners[eventName])) {
                    this.listeners[eventName].forEach(listener => listener(this.getEventData(name, eventName, data), receiversData));
                }
            });
        }
        if (this.listeners[name] && Array.isArray(this.listeners[name])) {
            this.listeners[name].forEach(listener => listener(data, receiversData));
        }
    }

    emit(name, data) {
        const receiversResponse = this.store.runReceivers(name, data);
        if (isPromise(receiversResponse)) {
            return receiversResponse.then(receiversData => {
                this.runMatchedListeners(name, data, receiversData);
            })
        }
        this.runMatchedListeners(name, data, receiversResponse);
    }
}

export default EventsEmitter;
