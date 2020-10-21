import EventsReceiver, { fetchToStateReceiver } from './EventsReceiver';

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
    it('should handle event and set state by stateManager when promise resolved', () => {
        const receiverResponse = { test: 'test' };
        const receiver = () => Promise.resolve(receiverResponse);
        const stateManager = {
            setState: jest.fn(),
            getState: jest.fn(() => ({})),
        };
        const eventsReceiver = fetchToStateReceiver('testEvent', 'testStateName', receiver);
        return eventsReceiver.handleEvent('testEvent', {}, stateManager).then(() => {
            expect(stateManager.setState).toHaveBeenCalledWith('testStateName', receiverResponse);
        });
    });
    it('should handle event and set state by stateManager when promise resolved and stateName is function', () => {
        const receiverResponse = { test: 'test' };
        const receiver = () => Promise.resolve(receiverResponse);
        const stateManager = {
            setState: jest.fn(),
            getState: jest.fn(() => ({})),
        };
        const eventsReceiver = fetchToStateReceiver('testEvent', ({ prefix }) => `${prefix}testStateName`, receiver);
        return eventsReceiver.handleEvent('testEvent', { prefix: 'test.' }, stateManager).then(() => {
            expect(stateManager.setState).toHaveBeenCalledWith('test.testStateName', receiverResponse);
        });
    });

    it('should handle event and not set state when promise rejected', () => {
        const receiver = () => Promise.reject('error');
        const stateManager = {
            setState: jest.fn(),
            getState: jest.fn(() => ({})),
        };
        const eventsReceiver = fetchToStateReceiver('testEvent', 'testStateName', receiver);
        return eventsReceiver.handleEvent('testEvent', {}, stateManager).catch(() => {
            expect(stateManager.setState).not.toHaveBeenCalled();
        });
    });

    it('should handle event and not set state when promise rejected and has catch', () => {
        const receiver = () => Promise.reject('error').catch(() => {});
        const stateManager = {
            setState: jest.fn(),
            getState: jest.fn(() => ({})),
        };
        const eventsReceiver = fetchToStateReceiver('testEvent', 'testStateName', receiver);
        return eventsReceiver.handleEvent('testEvent', {}, stateManager).then(() => {
            expect(stateManager.setState).not.toHaveBeenCalled();
        });
    });
});
