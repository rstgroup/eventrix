import React, { ComponentClass, ComponentType } from 'react';

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

export interface FetchMethod {
    (eventData: any, state: any, emit: Emit): Promise<any>
}

export interface FetchToStateReceiver {
    (eventName: string, statePath: string, fetchMethod: FetchMethod): EventsReceiver;
}

export interface ResolveHandler {
    eventName: string;
    data?: any;
    getData?(response: any, eventData: any): any;
}

export interface FetchHandlerOptions {
    success: ResolveHandler;
    error: ResolveHandler;
}

export interface FetchHandler {
    (fetchMethod: FetchMethod, { success, error }: FetchHandlerOptions): FetchMethod;
}

export interface Eventrix {
    listen(name: string, listener: <EventData, ReceiversData>(eventData: EventData, receiversData: ReceiversData) => void): void;
    unlisten(name: string, listener: <EventData, ReceiversData>(eventData: EventData, receiversData: ReceiversData) => void): void;
    emit<EventData>(name: string, data: EventData): Promise<any>;
    getState(path: string): any;
    useReceiver(eventReceiver: EventsReceiver): void;
    removeReceiver(eventReceiver: EventsReceiver): void;
}

export interface EventrixProviderProps {
    eventrix: Eventrix;
    children: any;
}

export interface EventrixProvider {
    (props: EventrixProviderProps): any;
}

export interface StateNamesFunction<Props> {
    (props: Props): string | string[];
}

export interface PropsFromState {
    [key: string]: any;
}

export interface MapStateToPropsFunction<Props, State> {
    (state: State, props: Props): PropsFromState;
}

export interface WithEventrixState<Props, State> {
    (
        BaseComponent: ComponentClass | ComponentType,
        stateNames: string | string[] | StateNamesFunction<Props>,
        mapStateToProps?: MapStateToPropsFunction<Props, State>,
        Context?: any
    ): ComponentClass
}

export interface WithEventrix {
    (
        BaseComponent: ComponentClass | ComponentType,
        Context?: any
    ): ComponentClass
}

export interface UseEventrixState {
    (stateName: string, Context?: any): any[];
}

export interface Emit<EventData> {
    (name: string, data: EventData): Promise<any>;
}

export interface UseEmit {
    (stateName: string, Context?: any): Emit;
}

export interface EventCallback {
    (eventData: any): void;
}

export interface UseEvent {
    (eventName: string, callback: EventCallback, Context?: any): any[];
}

export interface UseEventState {
    (eventName: string, Context?: any): any[];
}

export interface EmitFetch {
    (data: any): void;
}

export interface UseFetchToState {
    (eventName: string, statePath: string, fetchMethod: FetchMethod, Context?: any): EmitFetch[];
}