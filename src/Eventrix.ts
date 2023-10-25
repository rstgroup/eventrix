import StateManager from './StateManager';
import EventsEmitter from './EventsEmitter';
import {
    EventrixI,
    EventsEmitterI,
    StateManagerI,
    EventsListenerI,
    EventsReceiverI,
    EmitArgumentsI,
    ErrorCallback,
    EventrixOptionsI,
    ScopesI,
} from './interfaces';

class Eventrix<InitialStateI = any> implements EventrixI {
    eventsEmitter: EventsEmitterI;
    stateManager: StateManagerI;
    parent?: EventrixI;
    firstParent?: EventrixI;
    stateScope?: string;
    eventScope?: string;
    eventSeparator?: string;

    constructor(initialState?: InitialStateI, eventsReceivers?: EventsReceiverI[], options?: EventrixOptionsI) {
        this.eventsEmitter = new EventsEmitter();
        this.stateManager = new StateManager(this.eventsEmitter, initialState, eventsReceivers);
        this.parent = options?.parent;
        this.firstParent = options?.firstParent;
        this.stateScope = options?.scopes?.stateScope;
        this.eventScope = options?.scopes?.eventScope;
        this.eventSeparator = options?.scopes?.eventSeparator || ':';

        this.getState = this.getState.bind(this);
        this.emit = this.emit.bind(this);
        this.listen = this.listen.bind(this);
        this.unlisten = this.unlisten.bind(this);
        this.useReceiver = this.useReceiver.bind(this);
        this.removeReceiver = this.removeReceiver.bind(this);
        this.onError = this.onError.bind(this);
    }
    private getEventName(eventName: string): string {
        if (!this.eventScope) {
            return eventName;
        }
        if (!eventName) {
            return this.eventScope;
        }
        return `${this.eventScope}${this.eventSeparator}${eventName}`;
    }
    private getStatePath(statePath?: string): string | undefined {
        if (!this.stateScope) {
            return statePath;
        }
        if (!statePath) {
            return this.stateScope;
        }
        return `${this.stateScope}.${statePath}`;
    }
    private extendScopes(scopes: ScopesI): ScopesI {
        return {
            eventScope: this.eventScope ? `${this.eventScope}${this.eventSeparator}${scopes.eventScope}` : scopes.eventScope,
            stateScope: this.stateScope ? `${this.stateScope}.${scopes.stateScope}` : scopes.stateScope,
            eventSeparator: scopes.eventSeparator,
        };
    }
    getStatePathWithScope(statePath?: string): string | undefined {
        return this.getStatePath(statePath);
    }
    getEventNameWithScope(eventName: string): string {
        return this.getEventName(eventName);
    }
    getState<StateI>(path?: string): StateI {
        return this.stateManager.getState(this.getStatePath(path));
    }
    mapEmitArguments<EventDataI>(name: string | [string, EventDataI], value?: EventDataI): EmitArgumentsI<EventDataI> {
        if (Array.isArray(name)) {
            const [eventName, eventData] = name;
            return { eventName, eventData };
        }
        return { eventName: name, eventData: value };
    }
    emit<EventDataI = any>(name: string | [string, EventDataI], value?: EventDataI): Promise<any> {
        const { eventName, eventData } = this.mapEmitArguments<EventDataI>(name, value);
        return this.eventsEmitter.emit<EventDataI>(this.getEventName(eventName), eventData);
    }
    listen<EventData = any>(name: string, listener: EventsListenerI<EventData>): void {
        this.eventsEmitter.listen(this.getEventName(name), listener);
    }
    unlisten(name: string, listener: EventsListenerI): void {
        this.eventsEmitter.unlisten(this.getEventName(name), listener);
    }
    useReceiver(receiver: EventsReceiverI): void {
        this.stateManager.useReceiver(receiver);
    }
    removeReceiver(receiver: EventsReceiverI): void {
        this.stateManager.removeReceiver(receiver);
    }
    getFirstParent(): EventrixI {
        if (this.firstParent) {
            return this.firstParent;
        }
        return this;
    }
    getParent(): EventrixI | undefined {
        return this.parent;
    }
    create(scopes: ScopesI): EventrixI {
        const options = {
            scopes: this.extendScopes(scopes),
            parent: this,
            firstParent: this.firstParent ? this.firstParent : this,
        };
        const scopedInstance = new Eventrix({}, [], options);
        scopedInstance.eventsEmitter = this.eventsEmitter;
        scopedInstance.stateManager = this.stateManager;
        return scopedInstance;
    }
    onError(errorCallback: ErrorCallback<InitialStateI>) {
        this.eventsEmitter.onError(errorCallback);
    }
}

export default Eventrix;
