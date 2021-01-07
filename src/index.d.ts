export interface StateManager {
    setState<StateValue>(path: string, value: StateValue): void;
    getState<StateValue>(path: string): StateValue;
}

export interface EventsReceiver {
    eventNames: string[];
    receiver<EventData, ReceiverResponse>(eventName: string, eventData: EventData, stateManager: StateManager): ReceiverResponse;
    getEventsNames(): string[];
    handleEvent<EventData, ReceiverResponse>(name: string, data: EventData, stateManager: StateManager): ReceiverResponse;
}

interface Eventrix {
    listen(name: string, listener: <EventData, ReceiversData>(eventData: EventData, receiversData: ReceiversData) => void): void;
    unlisten(name: string, listener: <EventData, ReceiversData>(eventData: EventData, receiversData: ReceiversData) => void): void;
    emit<EventData>(name: string, data: EventData): Promise<any>;
    getState(path: string): any;
    useReceiver(eventReceiver: EventsReceiver): void;
    removeReceiver(eventReceiver: EventsReceiver): void;
}



