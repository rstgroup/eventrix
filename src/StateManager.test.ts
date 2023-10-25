import StateManager from './StateManager';
import EventsReceiver from './EventsReceiver';

describe('StateManager', () => {
    let eventsEmitter: any = {
        listeners: {},
        listen: jest.fn(),
        unlisten: jest.fn(),
        useStore: jest.fn(),
        emit: jest.fn(),
        emitWild: jest.fn(),
        getEventData: jest.fn(),
        runListeners: jest.fn(),
    };
    let stateManager = new StateManager(eventsEmitter);
    let initialState: object;
    let eventsReceiver;
    let eventsReceivers: any;

    beforeEach(() => {
        initialState = {
            foo: 'bar',
        };
        eventsEmitter = {
            listeners: {},
            listen: jest.fn(),
            unlisten: jest.fn(),
            useStore: jest.fn(),
            emit: jest.fn(),
            emitWild: jest.fn(),
            getEventData: jest.fn(),
            runListeners: jest.fn(),
        };
        eventsReceiver = jest.fn(() => ({ testData: {} }));
        eventsReceivers = [new EventsReceiver(['testEvent', 'secondTestEvent'], eventsReceiver)];
        stateManager = new StateManager(eventsEmitter, initialState, eventsReceivers);
    });

    it('should set initial state', () => {
        expect(stateManager.state).toEqual(initialState);
    });
    it('should replace old state when path is empty', () => {
        const newState = { a: { b: 'c' } };
        stateManager.setState('', newState);
        expect(stateManager.state).toEqual(newState);
    });
    it('should register initial events receivers', () => {
        expect(stateManager.receivers).toEqual({
            testEvent: eventsReceivers,
            secondTestEvent: eventsReceivers,
            setState: stateManager.receivers.setState,
        });
    });
    it('should register events receiver only one time', () => {
        console.warn = jest.fn();
        stateManager.useReceiver(eventsReceivers[0]);
        expect(console.warn).toHaveBeenCalledWith(`Store->registerReceiver - "testEvent" events receiver is already registered`);
        expect(console.warn).toHaveBeenCalledWith(`Store->registerReceiver - "secondTestEvent" events receiver is already registered`);
    });
    it('should not register events receiver when dont have handleEvent function', () => {
        console.warn = jest.fn();
        // @ts-ignore
        stateManager.useReceiver({ getEventsNames: () => ['testEvent', 'secondTestEvent'], receiver: jest.fn(), eventsNames: [] });
        expect(console.warn).toHaveBeenCalledWith(`Store->registerReceiver - "testEvent" receiver is not a function`);
        expect(console.warn).toHaveBeenCalledWith(`Store->registerReceiver - "secondTestEvent" receiver is not a function`);
    });
    it('should unregister events receiver', () => {
        stateManager.removeReceiver(eventsReceivers[0]);
        expect(stateManager.receivers).toEqual({
            testEvent: [],
            secondTestEvent: [],
            setState: stateManager.receivers.setState,
        });
    });
    it('should not unregister events receiver when event not exists', () => {
        console.warn = jest.fn();
        stateManager.removeReceiver({ getEventsNames: () => ['testEvent2'], handleEvent: jest.fn(), receiver: jest.fn(), eventsNames: [] });
        expect(console.warn).toHaveBeenCalledWith(`Store->unregisterReceiver - "testEvent2" event not registered`);
    });
    it('should not unregister events receiver when event receivers are empty array', () => {
        console.warn = jest.fn();
        stateManager.receivers = {
            testEvent: [],
            secondTestEvent: [],
        };
        stateManager.removeReceiver(eventsReceivers[0]);
        expect(console.warn).toHaveBeenCalledWith(`Store->unregisterReceiver - "testEvent" event dont have registered receiver`);
        expect(console.warn).toHaveBeenCalledWith(`Store->unregisterReceiver - "secondTestEvent" event dont have registered receiver`);
    });
    it('should not unregister events receiver when event receiver not registered', () => {
        console.warn = jest.fn();
        stateManager.removeReceiver({ getEventsNames: () => ['testEvent'], handleEvent: jest.fn(), receiver: jest.fn(), eventsNames: [] });
        expect(console.warn).toHaveBeenCalledWith(`Store->unregisterReceiver - "testEvent" receiver not exists`);
    });
    it('should emit change state event for parents and children', () => {
        stateManager.setState('a.b.c', 'test');
        expect(eventsEmitter.emit).toHaveBeenCalledWith('setState:a.b.c', 'test');
        expect(eventsEmitter.emit).toHaveBeenCalledWith('setState:a.b', { c: 'test' });
        expect(eventsEmitter.emit).toHaveBeenCalledWith('setState:a', { b: { c: 'test' } });
        expect(eventsEmitter.emit).toHaveBeenCalledWith('setState:a.b.c.*', 'test');
    });
    it('should unset state when setState value is undefined', () => {
        stateManager.setState('a.b.c', 'test');
        stateManager.setState('a.b.c', undefined);
        expect(eventsEmitter.emit).toHaveBeenCalledWith('setState:a.b.c', undefined);
        expect(eventsEmitter.emit).toHaveBeenCalledWith('setState:a.b', {});
        expect(eventsEmitter.emit).toHaveBeenCalledWith('setState:a', { b: {} });
        expect(eventsEmitter.emit).toHaveBeenCalledWith('setState:a.b.c.*', undefined);
    });
    it('should get parent path from path', () => {
        expect(stateManager.getParentPath('a.b.c')).toEqual('a.b');
    });
    it('should return undefined when path has one element', () => {
        expect(stateManager.getParentPath('a')).toEqual('');
    });
    it('should handle promise from events receivers', () => {
        const receiver = jest.fn(() => Promise.resolve({ asyncData: {} }));
        const asyncReceiver = new EventsReceiver('testEvent', receiver);
        stateManager.useReceiver(asyncReceiver);
        return stateManager.runReceivers('testEvent', { eventData: {} }).then((results: any) => {
            expect(results).toEqual([{ asyncData: {} }, { testData: {} }]);
            expect(receiver).toHaveBeenCalledWith('testEvent', { eventData: {} }, stateManager);
        });
    });
    it('should set default initial state', () => {
        const defaultStateManager = new StateManager(eventsEmitter);
        expect(defaultStateManager.state).toEqual({});
    });
});
