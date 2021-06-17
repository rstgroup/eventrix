import get from 'lodash/get';
import EventsReceiver from './EventsReceiver';
import {EventrixI, EventsReceiverI} from "./interfaces";

interface DebuggerConfigI {
    live?: boolean;
}

class EventrixDebugger {
    config: DebuggerConfigI;
    eventrix: EventrixI;
    eventsHistory: any[];
    stateHistory: any[];
    eventsReceiver: EventsReceiverI;

    constructor(eventrix: EventrixI, config: DebuggerConfigI = {}) {
        this.eventrix = eventrix;
        this.config = config;
        this.eventsHistory = [];
        this.stateHistory = [];
        window.EVENTRIX_DEBUGGER = this;
    }

    receiver = (name, data, stateManager) => {
        if (name === 'setState:*') {
            return;
        }
        const receiversCount = this.getEventsReceiversCount(name);
        const listenersCount = this.getEventListenersCount(name);
        const timestamp = new Date().getTime();
        this.eventsHistory.push({name, data, receiversCount, listenersCount, timestamp});
        this.printInlineEventInfo({name, data, receiversCount, listenersCount, timestamp});
        if (name.indexOf('setState:') === 0) {
            const [prefix, path] = name.split(':');
            const state = {...stateManager.getState()};
            this.stateHistory.push({path, state, receiversCount, listenersCount, timestamp});
            this.printInlineStateInfo({path, state, receiversCount, listenersCount, timestamp});
        }
    };

    start() {
        this.eventsReceiver = new EventsReceiver('*', this.receiver);
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

    getAllEventsReceiversCount() {
        const receivers = get(this.eventrix, 'stateManager.receivers', {});
        const eventsNames = Object.keys(receivers);
        return eventsNames.map(eventName => {
            const receiversList = receivers[eventName];
            return {
                eventName,
                count: Array.isArray(receiversList) ? receiversList.length : 0
            };
        })
    }

    getEventListenersCount(eventName) {
        const listeners = get(this.eventrix, 'stateManager.eventsEmitter.listeners', {});
        const listenersList = listeners[eventName];
        return Array.isArray(listenersList) ? listenersList.length : 0;
    }

    getAllEventsListenersCount() {
        const listeners = get(this.eventrix, 'stateManager.eventsEmitter.listeners', {});
        const eventsNames = Object.keys(listeners);
        return eventsNames.map((eventName) => {
            const listenersList = listeners[eventName];
            return {
                eventName,
                count: Array.isArray(listenersList) ? listenersList.length : 0
            };
        })
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

    getState() {
        return this.eventrix.getState();
    }

    getStateHistory() {
        return this.stateHistory;
    }

    getEventsHistory() {
        return this.eventsHistory;
    }

    printEventsHistory() {
        console.table(this.eventsHistory);
    }

    printStateHistory() {
        console.table(this.stateHistory);
    }
}

export default EventrixDebugger;