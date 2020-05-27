import Store from './Store';
import EventsEmitter from './EventsEmitter';

class Eventrix {
    constructor(initialState, eventsReceivers) {
        this.eventsEmitter = new EventsEmitter();
        this.store = new Store(this.eventsEmitter, initialState, eventsReceivers);

        this.getState = this.getState.bind(this);
        this.emit = this.emit.bind(this);
        this.listen = this.listen.bind(this);
        this.unlisten = this.unlisten.bind(this);
        this.useReceiver = this.useReceiver.bind(this);
        this.removeReceiver = this.removeReceiver.bind(this);
    }
    getState(path) {
        return this.store.getState(path);
    }
    emit(name, value) {
        this.eventsEmitter.emit(name, value);
    }
    listen(name, listener) {
        this.eventsEmitter.listen(name, listener);
    }
    unlisten(name, listener) {
        this.eventsEmitter.unlisten(name, listener);
    }
    useReceiver(receiver) {
        this.store.useReceiver(receiver);
    }
    removeReceiver(receiver) {
        this.store.removeReceiver(receiver);
    }
}

export default Eventrix;
