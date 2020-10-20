import EventsReceiver from "../EventsReceiver";
import { DISPATCH_EVENT_NAME } from "./events";

const combineReducers = (reducers) => {
    return [
        new EventsReceiver(DISPATCH_EVENT_NAME, (eventName, action, stateManager) => {
            Object.keys(reducers).forEach(key => {
                const state = stateManager.getState(key);
                const stateFromReducer = reducers[key](state, action);
                if (state !== stateFromReducer) {
                    stateManager.setState(key, stateFromReducer);
                }
            });
        })
    ];
};

export default combineReducers;
