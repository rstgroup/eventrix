import Eventrix from '../Eventrix';
import EventsReceiver from '../EventsReceiver';
import combineReducers from './combineReducers';
import { DISPATCH_EVENT_NAME } from './events';
import { EventrixI, EventsListenerI, ReducerI, ReducersI } from '../interfaces';

interface UnsubscribeI {
    (): void;
}

const getEventsReceivers = (reducers: ReducersI | ReducerI) => {
    if (Array.isArray(reducers)) {
        if (reducers[0] instanceof EventsReceiver) {
            return reducers;
        }
        return [];
    }
    if (typeof reducers === 'function') {
        return [
            new EventsReceiver(DISPATCH_EVENT_NAME, (eventName, action, stateManager) => {
                const state = stateManager.getState();
                const stateFromReducer = reducers(state, action);
                if (state !== stateFromReducer) {
                    stateManager.setState('', stateFromReducer);
                }
            }),
        ];
    }
    if (typeof reducers === 'object') {
        return combineReducers(reducers);
    }
    return [];
};

class ReduxAdapter {
    eventrix: EventrixI;

    constructor(reducers: ReducersI, initialState: any) {
        this.eventrix = new Eventrix(initialState, getEventsReceivers(reducers));

        this.dispatch = this.dispatch.bind(this);
        this.getState = this.getState.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.getEventrix = this.getEventrix.bind(this);
    }
    dispatch(action: any): void {
        this.eventrix.emit(DISPATCH_EVENT_NAME, action);
    }
    getState<StateI>(): StateI {
        return this.eventrix.getState();
    }
    subscribe(listener: EventsListenerI): UnsubscribeI {
        this.eventrix.listen('setState:*', listener);
        return () => this.unsubscribe(listener);
    }
    unsubscribe(listener: EventsListenerI): void {
        this.eventrix.unlisten('setState:*', listener);
    }
    getEventrix(): EventrixI {
        return this.eventrix;
    }
}

const createStore = (reducers: ReducersI, initialState: any) => {
    return new ReduxAdapter(reducers, initialState);
};

export default createStore;
