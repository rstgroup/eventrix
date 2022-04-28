import RequestHandler from './RequestHandler';
import { Eventrix } from './index';

describe('RequestHandler', () => {
    describe('normal', () => {
        const requestId = 'TestAbort';
        const abortRequestEventName = `AbortRequest:${requestId}`;
        const resolveRequestEventName = `ResolveRequest:${requestId}`;
        it('should return success when request is resolved', () => {
            expect.assertions(1);
            const eventrix = new Eventrix({}, []);
            const request = new Promise<string>((resolve) => {
                setTimeout(() => {
                    resolve('success');
                }, 10);
            });
            const requestHandler = new RequestHandler(eventrix);
            const requestPromise = requestHandler.handle<string>(request, requestId);
            return requestPromise.then((result) => {
                expect(result).toEqual('success');
            });
        });
        it('should return error on catch when request is rejected', () => {
            expect.assertions(1);
            const eventrix = new Eventrix({}, []);
            const request = new Promise<string>((resolve, reject) => {
                setTimeout(() => {
                    reject('error');
                }, 10);
            });
            const requestHandler = new RequestHandler(eventrix);
            const requestPromise = requestHandler.handle<string>(request, requestId);
            return requestPromise.catch((result) => {
                expect(result).toEqual('error');
            });
        });
        it('should register and unregister request and listeners', () => {
            expect.assertions(6);
            const eventrix = new Eventrix({}, []);
            const request = new Promise<string>((resolve) => {
                setTimeout(() => {
                    resolve('success');
                }, 10);
            });
            const requestHandler = new RequestHandler(eventrix);
            const requestPromise = requestHandler.handle<string>(request, requestId);

            expect(requestHandler._requests[requestId].length).toEqual(1);
            expect(eventrix.eventsEmitter.listeners[abortRequestEventName].length).toEqual(1);
            expect(eventrix.eventsEmitter.listeners[resolveRequestEventName].length).toEqual(1);

            return requestPromise.then(() => {
                expect(requestHandler._requests[requestId]).toEqual(undefined);
                expect(eventrix.eventsEmitter.listeners[abortRequestEventName]).toEqual(undefined);
                expect(eventrix.eventsEmitter.listeners[resolveRequestEventName]).toEqual(undefined);
            });
        });
    });
    describe('aborted', () => {
        const requestId = 'TestAbort';
        const abortRequestEventName = `AbortRequest:${requestId}`;
        it('should return abortedAllById on catch when request is aborted', () => {
            expect.assertions(1);
            const eventrix = new Eventrix({}, []);
            const request = new Promise<string>((resolve) => {
                setTimeout(() => {
                    resolve('success');
                }, 10);
            });
            const request2 = new Promise<string>((resolve) => {
                setTimeout(() => {
                    resolve('success2');
                }, 10);
            });
            const requestHandler = new RequestHandler(eventrix);
            const requestPromise = requestHandler.handle<string>(request, requestId).catch((error) => error);
            const requestPromise2 = requestHandler.handle<string>(request2, requestId).catch((error) => error);

            requestHandler.abortAllById<string>(requestId, 'abortedAllById');

            return Promise.all([requestPromise, requestPromise2]).then(([result, result2]) => {
                expect(result).toEqual('abortedAllById');
                expect(result2).toEqual('abortedAllById');
            });
        });
        it('should return abortedAll on catch when request is aborted', () => {
            expect.assertions(2);
            const eventrix = new Eventrix({}, []);
            const request = new Promise<string>((resolve) => {
                setTimeout(() => {
                    resolve('success');
                }, 100);
            });
            const request2 = new Promise<string>((resolve) => {
                setTimeout(() => {
                    resolve('success2');
                }, 2000);
            });
            const requestHandler = new RequestHandler(eventrix);
            const requestPromise = requestHandler.handle<string>(request, requestId).catch((error) => error);
            const requestPromise2 = requestHandler.handle<string>(request2, requestId).catch((error) => error);
            console.log(requestHandler._requests[requestId][0].rejectHandler === requestHandler._requests[requestId][1].rejectHandler);
            requestHandler.abortAll<string>('abortedAll');

            return Promise.all([requestPromise, requestPromise2]).then(([result, result2]) => {
                expect(result).toEqual('abortedAll');
                expect(result2).toEqual('abortedAll');
            });
        });
        it('should return abortedByEvent on catch when request is aborted outside by event', () => {
            expect.assertions(1);
            const eventrix = new Eventrix({}, []);
            const request = new Promise<string>((resolve) => {
                setTimeout(() => {
                    resolve('success');
                }, 10);
            });
            const requestHandler = new RequestHandler(eventrix);
            const requestPromise = requestHandler.handle<string>(request, requestId);

            eventrix.emit(abortRequestEventName, 'abortedByEvent');

            return requestPromise.catch((result) => {
                expect(result).toEqual('abortedByEvent');
            });
        });
    });
});
