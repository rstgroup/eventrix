import { EventrixI, RequestI, EventsListenerI, RequestHandlerInstance } from './interfaces';

class RequestHandler implements RequestHandlerInstance {
    _eventrix: EventrixI;
    _requests: {
        [key: string]: RequestI[];
    };
    constructor(eventrix: EventrixI) {
        this._eventrix = eventrix;
        this._requests = {};
    }
    _getEventNames(requestId: string) {
        const abortEventName = `AbortRequest:${requestId}`;
        const resolveEventName = `ResolveRequest:${requestId}`;
        return { abortEventName, resolveEventName };
    }
    _registerRequest(request: Promise<any>, requestId: string, rejectHandler: EventsListenerI, resolveHandler: EventsListenerI): void {
        const { abortEventName, resolveEventName } = this._getEventNames(requestId);

        if (!Array.isArray(this._requests[requestId])) {
            this._requests[requestId] = [];
        }
        this._eventrix.listen(abortEventName, rejectHandler);
        this._eventrix.listen(resolveEventName, resolveHandler);
        const requestHandlers = { request, rejectHandler, resolveHandler };
        this._requests[requestId].push(requestHandlers);
    }
    _unregisterRequest(request: Promise<any>, requestId: string): void {
        const { abortEventName, resolveEventName } = this._getEventNames(requestId);
        if (Array.isArray(this._requests[requestId])) {
            const requestHandlers = this._requests[requestId].find((requestHandler) => requestHandler.request === request);
            if (requestHandlers) {
                this._requests[requestId] = this._requests[requestId].filter(
                    (requestHandlersItem) => requestHandlersItem.request !== requestHandlers.request,
                );
                const { rejectHandler, resolveHandler } = requestHandlers;
                this._eventrix.unlisten(abortEventName, rejectHandler);
                this._eventrix.unlisten(resolveEventName, resolveHandler);
                if (this._requests[requestId].length < 1) {
                    delete this._requests[requestId];
                }
            }
        }
    }
    handle<RequestResponse>(request: Promise<RequestResponse>, requestId: string): Promise<RequestResponse> {
        return new Promise((resolve, reject) => {
            const rejectHandler = (eventData: any) => {
                this._unregisterRequest(request, requestId);
                reject(eventData);
            };
            const resolveHandler = (eventData: RequestResponse) => {
                this._unregisterRequest(request, requestId);
                resolve(eventData);
            };

            this._registerRequest(request, requestId, rejectHandler, resolveHandler);
            request
                .then((response) => {
                    this._unregisterRequest(request, requestId);
                    resolve(response);
                })
                .catch((error) => {
                    this._unregisterRequest(request, requestId);
                    reject(error);
                });
        });
    }
    abortAll<RejectData>(rejectData: RejectData): void {
        const requestIds = Object.keys(this._requests);
        requestIds.forEach((requestId) => {
            this.abortAllById(requestId, rejectData);
        });
    }
    resolveAll<ResolveData>(resolveData: ResolveData): void {
        const requestIds = Object.keys(this._requests);
        requestIds.forEach((requestId) => {
            this.resolveAllById(requestId, resolveData);
        });
    }
    abortAllById<RejectData>(requestId: string, rejectData: RejectData): void {
        const { abortEventName } = this._getEventNames(requestId);
        this._eventrix.emit<RejectData>(abortEventName, rejectData);
    }
    resolveAllById<ResolveData>(requestId: string, resolveData: ResolveData): void {
        const { resolveEventName } = this._getEventNames(requestId);
        this._eventrix.emit<ResolveData>(resolveEventName, resolveData);
    }
    isAnyPending(): boolean {
        let hasPendingRequests = false;
        Object.keys(this._requests).forEach((requestId) => {
            if (this.isPending(requestId)) {
                hasPendingRequests = true;
            }
        });
        return hasPendingRequests;
    }
    isPending(requestId: string): boolean {
        return Array.isArray(this._requests[requestId]) && this._requests[requestId].length > 0;
    }
}

export default RequestHandler;
