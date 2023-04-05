import get from 'lodash/get';
import EventsReceiver from './EventsReceiver';
import { EventrixI, EventsListenerI, EventsReceiverI, ReceiverI, StateManagerI } from './interfaces';

interface DebuggerConfigI {
    live?: boolean;
}

class EventrixDebugger {
    config: DebuggerConfigI;
    eventrix: EventrixI;
    eventsHistory: any[];
    stateHistory: any[];
    eventsReceiver?: EventsReceiverI;

    constructor(eventrix: EventrixI, config: DebuggerConfigI = {}) {
        this.eventrix = eventrix;
        this.config = config;
        this.eventsHistory = [];
        this.stateHistory = [];
        /*@ts-ignore*/
        window.EVENTRIX_DEBUGGER = this;
    }

    receiver = (name: string, data: any, stateManager: StateManagerI) => {
        if (name === 'setState:*') {
            return;
        }
        const receiversCount = this.getEventsReceiversCount(name);
        const listenersCount = this.getEventListenersCount(name);
        const timestamp = new Date().getTime();
        this.eventsHistory.push({ name, data, receiversCount, listenersCount, timestamp });
        this.printInlineEventInfo({ name, data, receiversCount, listenersCount });
        if (name.indexOf('setState:') === 0 && name.indexOf('*') < 0) {
            const path = name.split(':')[1];
            const state = { ...stateManager.getState<object>() };
            this.stateHistory.push({ path, state, receiversCount, listenersCount, timestamp });
            this.printInlineStateInfo({ path, state, receiversCount, listenersCount });
        }
    };

    start() {
        this.eventsReceiver = new EventsReceiver('*', this.receiver);
        this.stateHistory.push({
            path: 'init',
            state: { ...this.eventrix.getState<object>() },
        });
        this.eventrix.useReceiver(this.eventsReceiver);
    }

    stop() {
        if (this.eventsReceiver) {
            this.eventrix.removeReceiver(this.eventsReceiver);
        }
    }

    reset() {
        this.eventsHistory = [];
        this.stateHistory = [];
    }

    getEventsReceiversCount(eventName: string) {
        const receivers = get(this.eventrix, 'stateManager.receivers', {}) as { [key: string]: ReceiverI };
        const receiversList = receivers[eventName];
        return Array.isArray(receiversList) ? receiversList.length : 0;
    }

    getAllEventsReceiversCount() {
        const receivers = get(this.eventrix, 'stateManager.receivers', {}) as { [key: string]: ReceiverI };
        const eventsNames = Object.keys(receivers);
        return eventsNames.map((eventName) => {
            const receiversList = receivers[eventName];
            return {
                eventName,
                count: Array.isArray(receiversList) ? receiversList.length : 0,
            };
        });
    }

    getEventListenersCount(eventName: string) {
        const listeners = get(this.eventrix, 'stateManager.eventsEmitter.listeners', {}) as { [key: string]: EventsListenerI };
        const listenersList = listeners[eventName];
        return Array.isArray(listenersList) ? listenersList.length : 0;
    }

    getAllEventsListenersCount() {
        const listeners = get(this.eventrix, 'stateManager.eventsEmitter.listeners', {}) as { [key: string]: EventsListenerI };
        const eventsNames = Object.keys(listeners);
        return eventsNames.map((eventName) => {
            const listenersList = listeners[eventName];
            return {
                eventName,
                count: Array.isArray(listenersList) ? listenersList.length : 0,
            };
        });
    }

    printInlineEventInfo({
        name,
        data,
        receiversCount,
        listenersCount,
    }: {
        name: string;
        data: any;
        receiversCount: number;
        listenersCount: number;
    }) {
        if (this.config.live) {
            console.log(
                '%cEventrixDebugger -> emit ' + `%c"${name}" ` + `%c(receivers:${receiversCount}, listeners:${listenersCount})`,
                'color:#20b189;',
                'color: black;',
                'color: #2096b1;',
                data,
            );
        }
    }

    printInlineStateInfo({
        path,
        state,
        receiversCount,
        listenersCount,
    }: {
        path: string;
        state: any;
        receiversCount: number;
        listenersCount: number;
    }) {
        if (this.config.live) {
            console.log(
                '%cEventrixDebugger -> setState ' + `%c"${path}" ` + `%c(receivers:${receiversCount}, listeners:${listenersCount})`,
                'color:#20b189;',
                'color: black;',
                'color: #2096b1;',
                state,
            );
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
