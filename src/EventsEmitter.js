import get from 'lodash/get';
import { isPromise } from './helpers';

class EventsEmitter {
    constructor() {
        this.listeners = {};
        this.emit = this.emit.bind(this);
        this.emitWild = this.emitWild.bind(this);
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
        if (name === eventName) {
            return data;
        }
        const path = eventName.slice(name.length, eventName.length);
        const hasDotAsFirstChar = path.indexOf('.') === 0;
        return path ? get(data, hasDotAsFirstChar ? path.slice(1, path.length) : path) : data;
    }

    runListeners(name, data, receiversData) {
        if (this.listeners[name] && Array.isArray(this.listeners[name])) {
            this.listeners[name].forEach(listener => listener(data, receiversData));
        }
    }

    emitWild(name, data) {
        const listenEvents = Object.keys(this.listeners);
        const matchedEvents = listenEvents.filter((eventName) => eventName.indexOf(name) === 0);
        return matchedEvents.forEach(eventName => {
            if(this.listeners[eventName] && Array.isArray(this.listeners[eventName])) {
                this.listeners[eventName].forEach(listener => listener(this.getEventData(name, eventName, data), []));
            }
        });
    }

    emit(name, data) {
        const receiversResponse = this.store.runReceivers(name, data);
        if (isPromise(receiversResponse)) {
            return receiversResponse.then(receiversData => {
                this.runListeners(name, data, receiversData);
            })
        }
        this.runListeners(name, data, receiversResponse);
        return Promise.resolve(receiversResponse);
    }
}

export default EventsEmitter;
