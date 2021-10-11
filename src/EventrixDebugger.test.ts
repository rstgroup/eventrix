import Eventrix from './Eventrix';
import EventsReceiver from './EventsReceiver';
import EventrixDebugger from './EventrixDebugger';

describe('EventrixDebugger', () => {
    let initialState;
    let mockReceiver;
    let eventsReceivers;
    let eventrix: Eventrix;
    let eDebugger: EventrixDebugger;
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
        eventsReceivers = [new EventsReceiver('getFoo', mockReceiver)];
        eventrix = new Eventrix(initialState, eventsReceivers);
        eDebugger = new EventrixDebugger(eventrix);
        eDebugger.start();
    });

    it('should register emitted event', () => {
        const eventName = 'getFoo';
        eventrix.emit(eventName, 'test');
        eDebugger.stop();
        expect(eDebugger.eventsHistory).toHaveLength(1);
    });

    it('should register state change', () => {
        eventrix.stateManager.setState('foo', { bar: 'foo1' });
        expect(eDebugger.stateHistory).toHaveLength(2);
    });

    it('should reset history', () => {
        eventrix.stateManager.setState('foo', { bar: 'foo1' });
        eDebugger.reset();
        expect(eDebugger.stateHistory).toHaveLength(0);
        expect(eDebugger.eventsHistory).toHaveLength(0);
    });
});
