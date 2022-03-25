import { EventrixI, RequestHandlerInstance } from './interfaces';

class RequestHandler implements RequestHandlerInstance {
    eventrix: EventrixI;
    constructor(eventrix: EventrixI) {
        this.eventrix = eventrix;
    }
    handle<RequestResponse>(request: Promise<RequestResponse>, abortEventName: string): Promise<RequestResponse> {
        return new Promise((resolve, reject) => {
            this.eventrix.listen(abortEventName, reject);
            request
                .then((response) => {
                    this.eventrix.unlisten(abortEventName, reject);
                    resolve(response);
                })
                .catch((error) => {
                    this.eventrix.unlisten(abortEventName, reject);
                    reject(error);
                });
        });
    }
}

export default RequestHandler;
