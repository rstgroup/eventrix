import get from 'lodash/get';
import set from 'lodash/set';
import {isPromise} from "./helpers";

class Store {
    constructor(eventsEmitter, initialState, eventsReceivers) {
        this.eventsEmitter = eventsEmitter;
        this.state = initialState || {};
        this.receivers = {};
        this.eventsEmitter.useStore(this);
        if (eventsReceivers && Array.isArray(eventsReceivers)) {
            eventsReceivers.forEach(receiver => {
                this.useReceiver(receiver);
            })
        }
    }

    useReceiver(receiver) {
        const eventsNames = receiver.getEventsNames();
        eventsNames.forEach(
            eventName => this.registerReceiver(eventName, receiver)
        );
    }

    removeReceiver(receiver) {
        const eventsNames = receiver.getEventsNames();
        eventsNames.forEach(
            eventName => this.unregisterReceiver(eventName, receiver)
        );
    }

    registerReceiver(name, receiver) {
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

    unregisterReceiver(name, receiver) {
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

    runReceivers(name, data) {
        const promisesList = [];
        const receiversData = [];
        if (this.receivers[name] && Array.isArray(this.receivers[name])) {
            this.receivers[name].forEach(receiver => {
                const receiverData = receiver.handleEvent(name, data, this);
                if (isPromise(receiverData)) {
                    return promisesList.push(receiverData);
                }
                if (receiverData) {
                    receiversData.push(receiverData);
                }
            });
        }
        if (promisesList.length) {
            return Promise.all(promisesList).then(receiversResponse => [...receiversResponse, ...receiversData]);
        }
        return receiversData;
    }

    setState(path, value) {
        set(this.state, path, value);
        this.emitEvents(path);
    }

    emitEvents(path) {
        const pathElements = path.split('.');
        const value = this.getState(path);
        this.eventsEmitter.emit(path, value);
        if (pathElements.length > 1) {
            this.emitEvents(this.getParentPath(path));
        }
    }

    getParentPath(path) {
        const pathElements = path.split('.');
        if (pathElements.length === 1) {
            return;
        }
        return pathElements.pop().join('.');
    }

    getState(path) {
        return get(this.state, path);
    }
}

export default Store;