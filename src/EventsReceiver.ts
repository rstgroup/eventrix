import {
    EmitI,
    EventsReceiverI,
    FetchMethodI,
    ReceiverI,
    StateManagerI,
    FetchHandlersI,
    ReceiverStatePathI,
    FetchStateStatus,
    FetchStateMethodI,
    ReceiverMetadataI,
    EmitMetadataI,
} from './interfaces';

class EventsReceiver<EventData = any, ReceiverResponse = any> implements EventsReceiverI<EventData, ReceiverResponse> {
    eventsNames: string[];
    metadata?: ReceiverMetadataI;
    receiver: ReceiverI<EventData, ReceiverResponse>;

    constructor(eventsNames: string | string[], receiver: ReceiverI<EventData, ReceiverResponse>, metadata?: ReceiverMetadataI) {
        this.eventsNames = Array.isArray(eventsNames) ? eventsNames : [eventsNames];
        this.metadata = {
            functionName: receiver?.name,
            eventsNames: this.eventsNames,
            ...metadata,
        };
        this.receiver = receiver;
    }
    getEventsNames(): string[] {
        return this.eventsNames;
    }
    handleEvent(
        name: string,
        data: EventData,
        stateManager: StateManagerI,
        metadata?: { receiverMetadata?: ReceiverMetadataI; emitMetadata?: EmitMetadataI },
    ): ReceiverResponse {
        return this.receiver(name, data, stateManager, metadata);
    }
}

export const fetchHandler = <ResponseDataI = any>(fetchMethod: FetchMethodI, { success, error }: FetchHandlersI<ResponseDataI>) => {
    return (eventData: any, state: any, emit: EmitI<ResponseDataI>): Promise<ResponseDataI> =>
        fetchMethod(eventData, state, emit)
            .then((response) => {
                const { eventName, data, getData } = success;
                const successEventData = getData && typeof getData === 'function' ? getData(response, eventData) : data;
                emit(eventName, successEventData);
                return response;
            })
            .catch((errorResponse) => {
                const { eventName, data, getData } = error;
                const errorEventData = getData && typeof getData === 'function' ? getData(errorResponse, eventData) : data;
                emit(eventName, errorEventData);
            });
};

export const fetchToStateReceiver = (
    eventName: string | string[],
    statePath: string | ReceiverStatePathI,
    fetchMethod: FetchMethodI,
    metadata?: ReceiverMetadataI,
): EventsReceiverI => {
    return new EventsReceiver(
        eventName,
        (name, eventData, stateManager: StateManagerI) => {
            const state = stateManager.getState();
            const emit = stateManager.eventsEmitter.emit;
            return fetchMethod(eventData, state, emit).then((nextState) => {
                if (nextState !== undefined) {
                    const path = typeof statePath === 'function' ? statePath(eventData, nextState) : statePath;
                    stateManager.setState(path, nextState);
                    return nextState;
                }
            });
        },
        metadata,
    );
};

export const fetchStateReceiver = <FetchParamsI = any, FetchResponseI = any>(
    stateName: string,
    fetchMethod: FetchStateMethodI<FetchParamsI, FetchResponseI>,
    metadata?: ReceiverMetadataI,
): EventsReceiverI<FetchParamsI, Promise<any>> => {
    return new EventsReceiver<FetchParamsI, Promise<any>>(
        `fetchState:${stateName}`,
        (name: string, eventData: FetchParamsI, stateManager: StateManagerI): Promise<any> => {
            const data = stateManager.getState<FetchResponseI>(`${stateName}.data`);
            stateManager.setState(stateName, {
                data,
                isLoading: true,
                isSuccess: false,
                isError: false,
                status: FetchStateStatus.Loading,
            });
            return fetchMethod(eventData)
                .then((nextState) => {
                    stateManager.setState(stateName, {
                        data: nextState,
                        isLoading: false,
                        isSuccess: true,
                        isError: false,
                        status: FetchStateStatus.Success,
                    });
                    return nextState;
                })
                .catch((error) => {
                    stateManager.setState(stateName, {
                        data,
                        isLoading: false,
                        isSuccess: false,
                        isError: true,
                        error: {
                            message: error && error.message ? error.message : error,
                        },
                        status: FetchStateStatus.Error,
                    });
                });
        },
        metadata,
    );
};

export default EventsReceiver;
