import StateManager from './StateManager';
import EventsEmitter from './EventsEmitter';

class Eventrix {
    constructor(initialState, eventsReceivers) {
        this.eventsEmitter = new EventsEmitter();
        this.stateManager = new StateManager(this.eventsEmitter, initialState, eventsReceivers);

        this.getState = this.getState.bind(this);
        this.emit = this.emit.bind(this);
        this.listen = this.listen.bind(this);
        this.unlisten = this.unlisten.bind(this);
        this.useReceiver = this.useReceiver.bind(this);
        this.removeReceiver = this.removeReceiver.bind(this);
    }
    getState(path) {
        return this.stateManager.getState(path);
    }
    mapEmitArguments(name, value) {
        if (Array.isArray(name)) {
            const [eventName, eventData] = name;
            return { eventName, eventData };
        }
        return { eventName: name, eventData: value };
    }
    emit(name, value) {
        const { eventName, eventData } = this.mapEmitArguments(name, value);
        return this.eventsEmitter.emit(eventName, eventData);
    }
    listen(name, listener) {
        this.eventsEmitter.listen(name, listener);
    }
    unlisten(name, listener) {
        this.eventsEmitter.unlisten(name, listener);
    }
    useReceiver(receiver) {
        this.stateManager.useReceiver(receiver);
    }
    removeReceiver(receiver) {
        this.stateManager.removeReceiver(receiver);
    }
}

export default Eventrix;
