import get from 'lodash/get';
import EventsReceiver from './EventsReceiver';

class EventrixDebugger {
    constructor(eventrix, config = {}) {
        this.eventrix = eventrix;
        this.config = config;
        this.eventsHistory = [];
        this.stateHistory = [];
    }

    receiver = (name, data, stateManager) => {
        const receiversCount = this.getEventsReceiversCount(name);
        const listenersCount = this.getEventListenersCount(name);
        this.eventsHistory.push({name, data, receiversCount, listenersCount});
        this.printInlineEventInfo({name, data, receiversCount, listenersCount});
        if (name.indexOf('setState:') === 0) {
            const [prefix, path] = name.split(':');
            const state = {...stateManager.getState()};
            this.stateHistory.push({path, state, receiversCount, listenersCount});
            this.printInlineStateInfo({path, state, receiversCount, listenersCount});
        }
    };

    start() {
        this.eventsReceiver = new EventsReceiver(undefined, this.receiver);
        this.stateHistory.push({
            path: 'init',
            state: {...this.eventrix.getState()}
        });
        this.eventrix.useReceiver(this.eventsReceiver);
    }

    stop() {
        this.eventrix.removeReceiver(this.eventsReceiver)
    }

    reset() {
        this.eventsHistory = [];
        this.stateHistory = [];
    }

    getEventsReceiversCount(eventName) {
        const receivers = get(this.eventrix, 'stateManager.receivers', {});
        const receiversList = receivers[eventName];
        return Array.isArray(receiversList) ? receiversList.length : 0;
    }

    getEventListenersCount(eventName) {
        const listeners = get(this.eventrix, 'stateManager.eventsEmitter.listeners', {});
        const listenersList = listeners[eventName];
        return Array.isArray(listenersList) ? listenersList.length : 0;
    }

    printInlineEventInfo({name, data, receiversCount, listenersCount}) {
        if (this.config.live) {
            console.log('%cEventrixDebugger -> emit ' + `%c"${name}" ` + `%c(receivers:${receiversCount}, listeners:${listenersCount})`, 'color:#20b189;', 'color: black;', 'color: #2096b1;', data)
        }
    }

    printInlineStateInfo({path, state, receiversCount, listenersCount}) {
        if (this.config.live) {
            console.log('%cEventrixDebugger -> setState ' + `%c"${path}" ` + `%c(receivers:${receiversCount}, listeners:${listenersCount})`, 'color:#20b189;', 'color: black;', 'color: #2096b1;', state)
        }
    }

    printEventsHistory() {
        console.table(this.eventsHistory);
    }

    printStateHistory() {
        console.table(this.stateHistory);
    }
}

export default EventrixDebugger;