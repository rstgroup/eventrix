import RequestsHandler from './RequestsHandler';
import Eventrix from './Eventrix';

describe('RequestHandler', () => {
    describe('normal', () => {
        const requestId = 'TestAbort';
        const abortRequestEventName = `AbortRequest:${requestId}`;
        const resolveRequestEventName = `ResolveRequest:${requestId}`;
        let eventrix: Eventrix;
        let request: Promise<string>;
        let requestHandler: RequestsHandler;

        beforeEach(() => {
            eventrix = new Eventrix({}, []);
            request = new Promise<string>((resolve) => {
                setTimeout(() => {
                    resolve('success');
                }, 10);
            });
            requestHandler = new RequestsHandler(eventrix);
        });

        it('should return success when request is resolved', () => {
            expect.assertions(1);
            const requestPromise = requestHandler.handleRequest<string>(request, requestId);
            return requestPromise.then((result) => {
                expect(result).toEqual('success');
            });
        });
        it('should return true when TestAbort request is pending', () => {
            expect.assertions(1);
            requestHandler.handleRequest<string>(request, requestId);
            expect(requestHandler.isPending(requestId)).toEqual(true);
        });
        it('should return true when any request is pending', () => {
            expect.assertions(1);
            requestHandler.handleRequest<string>(request, requestId);
            expect(requestHandler.isAnyPending()).toEqual(true);
        });
        it('should return false when all TestAbort requests are resolved', () => {
            expect.assertions(1);
            const requestPromise = requestHandler.handleRequest<string>(request, requestId);
            return requestPromise.then(() => {
                expect(requestHandler.isPending(requestId)).toEqual(false);
            });
        });
        it('should return false when all requests are resolved', () => {
            expect.assertions(1);
            const requestPromise = requestHandler.handleRequest<string>(request, requestId);
            return requestPromise.then(() => {
                expect(requestHandler.isAnyPending()).toEqual(false);
            });
        });
        it('should return error on catch when request is rejected', () => {
            expect.assertions(1);
            request = new Promise<string>((resolve, reject) => {
                setTimeout(() => {
                    reject('error');
                }, 10);
            });
            const requestPromise = requestHandler.handleRequest<string>(request, requestId);
            return requestPromise.catch((result) => {
                expect(result).toEqual('error');
            });
        });
        it('should register and unregister request and listeners', () => {
            expect.assertions(4);
            const requestPromise = requestHandler.handleRequest<string>(request, requestId);

            expect(eventrix.eventsEmitter.listeners[abortRequestEventName]).toHaveLength(1);
            expect(eventrix.eventsEmitter.listeners[resolveRequestEventName]).toHaveLength(1);

            return requestPromise.then(() => {
                expect(eventrix.eventsEmitter.listeners[abortRequestEventName]).toEqual(undefined);
                expect(eventrix.eventsEmitter.listeners[resolveRequestEventName]).toEqual(undefined);
            });
        });
    });
    describe('aborted', () => {
        const requestId = 'TestAbort';
        const requestId2 = 'TestAbort2';
        const abortRequestEventName = `AbortRequest:${requestId}`;
        let eventrix: Eventrix;
        let request: Promise<string>;
        let request2: Promise<string>;
        let requestHandler: RequestsHandler;

        beforeEach(() => {
            eventrix = new Eventrix({}, []);
            request = new Promise<string>((resolve) => {
                setTimeout(() => {
                    resolve('success');
                }, 10);
            });
            request2 = new Promise<string>((resolve) => {
                setTimeout(() => {
                    resolve('success2');
                }, 10);
            });
            requestHandler = new RequestsHandler(eventrix);
        });

        it('abortAllById -> should reject all TestAbort requests with abortedAllById response', async () => {
            expect.assertions(2);
            const requestPromise = requestHandler.handleRequest<string>(request, requestId).catch((error) => error);
            const requestPromise2 = requestHandler.handleRequest<string>(request2, requestId).catch((error) => error);

            requestHandler.abortAllById<string>(requestId, 'abortedAllById');

            return Promise.all([requestPromise, requestPromise2]).then(([result, result2]) => {
                expect(result).toEqual('abortedAllById');
                expect(result2).toEqual('abortedAllById');
            });
        });
        it('abortAll -> should reject all requests with abortedAll response', () => {
            expect.assertions(2);
            const requestPromise = requestHandler.handleRequest<string>(request, requestId).catch((error) => error);
            const requestPromise2 = requestHandler.handleRequest<string>(request2, requestId2).catch((error) => error);

            requestHandler.abortAll<string>('abortedAll');

            return Promise.all([requestPromise, requestPromise2]).then(([result, result2]) => {
                expect(result).toEqual('abortedAll');
                expect(result2).toEqual('abortedAll');
            });
        });
        it('should reject all TestAbort requests when abort event called', () => {
            expect.assertions(1);
            const requestPromise = requestHandler.handleRequest<string>(request, requestId);

            eventrix.emit(abortRequestEventName, 'abortedByEvent');

            return requestPromise.catch((result) => {
                expect(result).toEqual('abortedByEvent');
            });
        });
    });
    describe('resolve', () => {
        const requestId = 'TestResolve';
        const requestId2 = 'TestResolve2';
        const resolveRequestEventName = `ResolveRequest:${requestId}`;
        let eventrix: Eventrix;
        let request: Promise<string>;
        let request2: Promise<string>;
        let requestHandler: RequestsHandler;

        beforeEach(() => {
            eventrix = new Eventrix({}, []);
            request = new Promise<string>((resolve) => {
                setTimeout(() => {
                    resolve('success');
                }, 10);
            });
            request2 = new Promise<string>((resolve) => {
                setTimeout(() => {
                    resolve('success2');
                }, 10);
            });
            requestHandler = new RequestsHandler(eventrix);
        });

        it('resolveAllById -> should reject all TestResolve requests with resolvedAllById response', async () => {
            expect.assertions(2);
            const requestPromise = requestHandler.handleRequest<string>(request, requestId).catch((error) => error);
            const requestPromise2 = requestHandler.handleRequest<string>(request2, requestId).catch((error) => error);

            requestHandler.resolveAllById<string>(requestId, 'resolvedAllById');

            return Promise.all([requestPromise, requestPromise2]).then(([result, result2]) => {
                expect(result).toEqual('resolvedAllById');
                expect(result2).toEqual('resolvedAllById');
            });
        });
        it('resolveAll -> should reject all requests with resolvedAll response', () => {
            expect.assertions(2);
            const requestPromise = requestHandler.handleRequest<string>(request, requestId).catch((error) => error);
            const requestPromise2 = requestHandler.handleRequest<string>(request2, requestId2).catch((error) => error);

            requestHandler.resolveAll<string>('resolvedAll');

            return Promise.all([requestPromise, requestPromise2]).then(([result, result2]) => {
                expect(result).toEqual('resolvedAll');
                expect(result2).toEqual('resolvedAll');
            });
        });
        it('should resolve all TestResolve requests when resolve event called', () => {
            expect.assertions(1);
            const requestPromise = requestHandler.handleRequest<string>(request, requestId);

            eventrix.emit(resolveRequestEventName, 'resolvedByEvent');

            return requestPromise.then((result) => {
                expect(result).toEqual('resolvedByEvent');
            });
        });
    });
});
