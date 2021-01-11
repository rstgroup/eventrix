import Eventrix from './Eventrix';
import EventsReceiver from "./EventsReceiver";
import EventrixDebugger from "./EventrixDebugger";

describe('EventrixDebugger', () => {
    let initialState;
    let mockListener;
    let mockReceiver;
    let eventsReceivers;
    let eventrix;
    let eDebugger;
    beforeEach(() => {
        initialState = {
            foo: {
                bar: 'foo',
            },
            bar: {
                foo: 'bar',
            },
        };
        mockReceiver = jest.fn(() => 'testReceiverData');
        eventsReceivers = [
            new EventsReceiver('getFoo', mockReceiver)
        ];
        mockListener = jest.fn();
        eventrix = new Eventrix(initialState, eventsReceivers);
        eDebugger = new EventrixDebugger(eventrix);
        eDebugger.start();
    });

    it('should register emitted event', () => {
        const eventName = 'getFoo';
        eventrix.emit(eventName, 'test');
        eDebugger.stop();
        expect(eDebugger.eventsHistory.length).toEqual(1);
    });

    it('should register state change', () => {
        eventrix.stateManager.setState('foo', { bar: 'foo1' });
        expect(eDebugger.stateHistory.length).toEqual(3);
    });

    it('should reset history', () => {
        eventrix.stateManager.setState('foo', { bar: 'foo1' });
        eDebugger.reset();
        expect(eDebugger.stateHistory.length).toEqual(0);
        expect(eDebugger.eventsHistory.length).toEqual(0);
    });
});