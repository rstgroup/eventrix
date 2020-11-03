import EventsReceiver, { fetchHandler, fetchToStateReceiver } from './EventsReceiver';

describe('EventsReceiver', () => {
    it('should get receiver events names when events names are string', () => {
        const eventsReceiver = new EventsReceiver('testEvent', () => {});
        expect(eventsReceiver.getEventsNames()).toEqual(['testEvent']);
    });
    it('should get receiver events names when events names are array of strings', () => {
        const eventsReceiver = new EventsReceiver(['testEvent'], () => {});
        expect(eventsReceiver.getEventsNames()).toEqual(['testEvent']);
    });
    it('should handle event by receiver', () => {
        const receiver = jest.fn();
        const eventsReceiver = new EventsReceiver('testEvent', receiver);
        eventsReceiver.handleEvent('testEvent', {}, {});
        expect(receiver).toHaveBeenCalledWith('testEvent', {}, {});
    });
});

describe('fetchToStateReceiver', () => {
    let stateManager = {};
    beforeEach(() => {
        stateManager = {
            setState: jest.fn(),
            getState: jest.fn(() => ({})),
            eventsEmitter: {
                emit: jest.fn(),
            }
        };
    });
    it('should handle event and set state by stateManager when promise resolved', () => {
        const receiverResponse = { test: 'test' };
        const receiver = () => Promise.resolve(receiverResponse);

        const eventsReceiver = fetchToStateReceiver('testEvent', 'testStateName', receiver);
        return eventsReceiver.handleEvent('testEvent', {}, stateManager).then(() => {
            expect(stateManager.setState).toHaveBeenCalledWith('testStateName', receiverResponse);
        });
    });
    it('should handle event and set state by stateManager when promise resolved and stateName is function', () => {
        const receiverResponse = { test: 'test' };
        const receiver = () => Promise.resolve(receiverResponse);

        const eventsReceiver = fetchToStateReceiver('testEvent', ({ prefix }) => `${prefix}testStateName`, receiver);
        return eventsReceiver.handleEvent('testEvent', { prefix: 'test.' }, stateManager).then(() => {
            expect(stateManager.setState).toHaveBeenCalledWith('test.testStateName', receiverResponse);
        });
    });

    it('should handle event and not set state when promise rejected', () => {
        const receiver = () => Promise.reject('error');

        const eventsReceiver = fetchToStateReceiver('testEvent', 'testStateName', receiver);
        return eventsReceiver.handleEvent('testEvent', {}, stateManager).catch(() => {
            expect(stateManager.setState).not.toHaveBeenCalled();
        });
    });

    it('should handle event and not set state when promise rejected and has catch', () => {
        const receiver = () => Promise.reject('error').catch(() => {});

        const eventsReceiver = fetchToStateReceiver('testEvent', 'testStateName', receiver);
        return eventsReceiver.handleEvent('testEvent', {}, stateManager).then(() => {
            expect(stateManager.setState).not.toHaveBeenCalled();
        });
    });
});

describe('fetchHandler', () => {
    let emit;
    beforeEach(() => {
        emit = jest.fn();
    });
    it('should fetch data and emit success event when promise resolved', () => {
        const fetchResponse = { test: 'test' };
        const fetchMethod = () => Promise.resolve(fetchResponse);
        const successEventName = 'fetch.success';
        const successEventData = 'test success';
        const errorEventName = 'fetch.error';
        const errorEventData = 'test error';
        const fetchMethodWithHandler = fetchHandler(
            fetchMethod,
            {
                success: {
                    eventName: successEventName,
                    data: successEventData
                },
                error: {
                    eventName: errorEventName,
                    data: errorEventData
                }
            }
        );
        return fetchMethodWithHandler({}, '', emit).then((response) => {
            expect(response).toEqual(fetchResponse);
            expect(emit).toHaveBeenCalledWith(successEventName, successEventData);
            expect(emit).not.toHaveBeenCalledWith(errorEventName, errorEventData);
        })
    });
    it('should fetch data and emit success event with response in event data', () => {
        const fetchResponse = { test: 'test' };
        const fetchMethod = () => Promise.resolve(fetchResponse);
        const successEventName = 'fetch.success';
        const successGetEventData = (response) => ({ response , message: 'test success' });
        const errorEventName = 'fetch.error';
        const errorGetEventData = (errorResponse) => ({ errorResponse, message: 'test error' });
        const fetchMethodWithHandler = fetchHandler(
            fetchMethod,
            {
                success: {
                    eventName: successEventName,
                    getData: successGetEventData
                },
                error: {
                    eventName: errorEventName,
                    getData: errorGetEventData
                }
            }
        );
        return fetchMethodWithHandler({}, '', emit).then((response) => {
            expect(response).toEqual(fetchResponse);
            expect(emit).toHaveBeenCalledWith(successEventName, { response , message: 'test success' });
        })
    });
    it('should fetch data and emit error event when promise rejected', () => {
        const fetchResponse = { test: 'test' };
        const fetchMethod = () => Promise.reject(fetchResponse);
        const successEventName = 'fetch.success';
        const successEventData = 'test success';
        const errorEventName = 'fetch.error';
        const errorEventData = 'test error';
        const fetchMethodWithHandler = fetchHandler(
            fetchMethod,
            {
                success: {
                    eventName: successEventName,
                    data: successEventData
                },
                error: {
                    eventName: errorEventName,
                    data: errorEventData
                }
            }
        );
        return fetchMethodWithHandler({}, '', emit).then((response) => {
            expect(response).toEqual(undefined);
            expect(emit).not.toHaveBeenCalledWith(successEventName, successEventData);
            expect(emit).toHaveBeenCalledWith(errorEventName, errorEventData);
        })
    });
    it('should fetch data and emit error event with error response in event data', () => {
        const errorResponse = { test: 'test' };
        const fetchMethod = () => Promise.reject(errorResponse);
        const successEventName = 'fetch.success';
        const successGetEventData = (response) => ({ response , message: 'test success' });
        const errorEventName = 'fetch.error';
        const errorGetEventData = (response) => ({ response, message: 'test error' });
        const fetchMethodWithHandler = fetchHandler(
            fetchMethod,
            {
                success: {
                    eventName: successEventName,
                    getData: successGetEventData
                },
                error: {
                    eventName: errorEventName,
                    getData: errorGetEventData
                }
            }
        );
        return fetchMethodWithHandler({}, '', emit).then((response) => {
            expect(response).toEqual(undefined);
            expect(emit).toHaveBeenCalledWith(errorEventName, { response: errorResponse, message: 'test error' });
        })
    });
});
