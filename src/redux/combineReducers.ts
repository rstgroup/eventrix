import EventsReceiver from '../EventsReceiver';
import { DISPATCH_EVENT_NAME } from './events';
import { ActionI, ReducersI, StateManagerI } from '../interfaces';

const combineReducers = (reducers: ReducersI) => {
    return [
        new EventsReceiver(DISPATCH_EVENT_NAME, (eventName: string, action: ActionI, stateManager: StateManagerI): void => {
            Object.keys(reducers).forEach((key: string) => {
                const state = stateManager.getState(key);
                const stateFromReducer = reducers[key](state, action);
                if (state !== stateFromReducer) {
                    stateManager.setState(key, stateFromReducer);
                }
            });
        }),
    ];
};

export default combineReducers;
