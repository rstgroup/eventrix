import { EventrixI, RequestI, EventsListenerI, RequestHandlerInstance } from './interfaces';

class RequestsHandler implements RequestHandlerInstance {
    private eventrix: EventrixI;
    private requests: {
        [key: string]: RequestI[];
    };
    constructor(eventrix: EventrixI) {
        this.eventrix = eventrix;
        this.requests = {};
    }
    private getEventNames(requestId: string) {
        const abortEventName = `AbortRequest:${requestId}`;
        const resolveEventName = `ResolveRequest:${requestId}`;
        return { abortEventName, resolveEventName };
    }
    private registerRequest(
        request: Promise<any>,
        requestId: string,
        rejectHandler: EventsListenerI,
        resolveHandler: EventsListenerI,
    ): void {
        const { abortEventName, resolveEventName } = this.getEventNames(requestId);

        if (!Array.isArray(this.requests[requestId])) {
            this.requests[requestId] = [];
        }
        this.eventrix.listen(abortEventName, rejectHandler);
        this.eventrix.listen(resolveEventName, resolveHandler);
        const requestHandlers = { request, rejectHandler, resolveHandler };
        this.requests[requestId].push(requestHandlers);
    }
    private hasRegisteredRequest(request: Promise<any>, requestId: string): boolean {
        if (Array.isArray(this.requests[requestId])) {
            const requestHandlers = this.requests[requestId].find((requestHandler) => requestHandler.request === request);
            return !!requestHandlers;
        }
        return false;
    }
    private unregisterRequest(request: Promise<any>, requestId: string): void {
        const { abortEventName, resolveEventName } = this.getEventNames(requestId);
        if (Array.isArray(this.requests[requestId])) {
            const requestHandlers = this.requests[requestId].find((requestHandler) => requestHandler.request === request);
            if (requestHandlers) {
                this.requests[requestId] = this.requests[requestId].filter(
                    (requestHandlersItem) => requestHandlersItem.request !== requestHandlers.request,
                );
                const { rejectHandler, resolveHandler } = requestHandlers;
                this.eventrix.unlisten(abortEventName, rejectHandler);
                this.eventrix.unlisten(resolveEventName, resolveHandler);
                if (this.requests[requestId].length < 1) {
                    delete this.requests[requestId];
                }
            }
        }
    }
    handleRequest<RequestResponse>(request: Promise<RequestResponse>, requestId: string): Promise<RequestResponse> {
        return new Promise((resolve, reject) => {
            const rejectHandler = (eventData: any) => {
                reject(eventData);
            };
            const resolveHandler = (eventData: RequestResponse) => {
                resolve(eventData);
            };

            this.registerRequest(request, requestId, rejectHandler, resolveHandler);
            request
                .then((response) => {
                    if (this.hasRegisteredRequest(request, requestId)) {
                        this.unregisterRequest(request, requestId);
                        resolve(response);
                    }
                })
                .catch((error) => {
                    if (this.hasRegisteredRequest(request, requestId)) {
                        this.unregisterRequest(request, requestId);
                        reject(error);
                    }
                });
        });
    }
    abortAll<RejectData>(rejectData: RejectData): void {
        const requestIds = Object.keys(this.requests);
        requestIds.forEach((requestId) => {
            this.abortAllById<RejectData>(requestId, rejectData);
        });
    }
    resolveAll<ResolveData>(resolveData: ResolveData): void {
        const requestIds = Object.keys(this.requests);
        requestIds.forEach((requestId) => {
            this.resolveAllById<ResolveData>(requestId, resolveData);
        });
    }
    abortAllById<RejectData>(requestId: string, rejectData: RejectData): void {
        const { abortEventName } = this.getEventNames(requestId);
        if (Array.isArray(this.requests[requestId])) {
            this.eventrix.emit<RejectData>(abortEventName, rejectData);
            this.requests[requestId].forEach((requestHandler) => {
                this.unregisterRequest(requestHandler.request, requestId);
            });
        }
    }
    resolveAllById<ResolveData>(requestId: string, resolveData: ResolveData): void {
        const { resolveEventName } = this.getEventNames(requestId);
        if (Array.isArray(this.requests[requestId])) {
            this.eventrix.emit<ResolveData>(resolveEventName, resolveData);
            this.requests[requestId].forEach((requestHandler) => {
                this.unregisterRequest(requestHandler.request, requestId);
            });
        }
    }
    isAnyPending(): boolean {
        let hasPendingRequests = false;
        Object.keys(this.requests).forEach((requestId) => {
            if (this.isPending(requestId)) {
                hasPendingRequests = true;
            }
        });
        return hasPendingRequests;
    }
    isPending(requestId: string): boolean {
        return Array.isArray(this.requests[requestId]) && this.requests[requestId].length > 0;
    }
}

export default RequestsHandler;
