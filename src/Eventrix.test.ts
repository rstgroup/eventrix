import Eventrix from './Eventrix';
import EventsReceiver from './EventsReceiver';
import { EventsReceiverI } from './interfaces';

describe('Eventrix', () => {
    let initialState: any;
    let mockListener = () => {};
    let mockReceiver;
    let eventsReceivers: EventsReceiverI[];
    let eventrix = new Eventrix();
    beforeEach(() => {
        initialState = {
            foo: {
                bar: 'foo',
            },
            bar: {
                foo: 'bar',
            },
            scope1: {
                scope2: {
                    scope3: {
                        scope4: 'test',
                    },
                },
            },
        };
        mockReceiver = jest.fn(() => 'testReceiverData');
        eventsReceivers = [new EventsReceiver('getFoo', mockReceiver)];
        mockListener = jest.fn();
        eventrix = new Eventrix(initialState, eventsReceivers);
    });
    it('should getState from store', () => {
        expect(eventrix.getState('foo.bar')).toEqual('foo');
    });
    it('should call listener on emit event', () => {
        const eventName = 'getFoo';
        eventrix.listen(eventName, mockListener);
        eventrix.emit(eventName, 'test');
        expect(mockListener).toHaveBeenCalledWith('test', ['testReceiverData']);
    });
    it('should map emit arguments and emit event', () => {
        const eventName = 'getFoo';
        const getFooEvent = <EventDataI>(eventData: EventDataI): [string, EventDataI] => {
            return [eventName, eventData];
        };
        eventrix.listen(eventName, mockListener);
        eventrix.emit(getFooEvent<string>('test'));
        expect(mockListener).toHaveBeenCalledWith('test', ['testReceiverData']);
    });
    it('should not call event listener after unlisten', () => {
        const eventName = 'getFoo';
        eventrix.listen(eventName, mockListener);
        eventrix.unlisten(eventName, mockListener);
        eventrix.emit(eventName, 'test');
        expect(mockListener).not.toHaveBeenCalled();
    });
    it('should call listener with bar data from store returned by receiver', () => {
        const eventName = 'getFoo';
        const eventsReceiver = new EventsReceiver('getFoo', (name, data, store) => {
            return store.getState('foo');
        });
        eventrix.useReceiver(eventsReceiver);
        eventrix.listen(eventName, mockListener);
        eventrix.emit(eventName, 'test');
        expect(mockListener).toHaveBeenCalledWith('test', ['testReceiverData', initialState.foo]);
    });
    it('should call listener on emit event without receiver response', () => {
        const eventName = 'getFoo';
        eventrix.removeReceiver(eventsReceivers[0]);
        eventrix.listen(eventName, mockListener);
        eventrix.emit(eventName, 'test');
        expect(mockListener).toHaveBeenCalledWith('test', []);
    });
    it('should event receiver update store on emit event', () => {
        const eventName = 'setBar';
        const newbarState = { foo1: 'barbar' };
        const eventsReceiver = new EventsReceiver(eventName, (name, data, store) => {
            store.setState('bar', newbarState);
        });
        eventrix.useReceiver(eventsReceiver);
        eventrix.listen(eventName, mockListener);
        eventrix.emit(eventName, 'test');
        expect(mockListener).toHaveBeenCalledWith('test', []);
        expect(eventrix.getState('bar')).toEqual(newbarState);
    });
    it('should create new eventrix instance with event scope', () => {
        const mockedListener = jest.fn();
        eventrix.listen('Test:setTest', mockedListener);
        const testInstance = eventrix.create({ eventScope: 'Test' });
        testInstance.emit('setTest', 'test');
        expect(mockedListener).toHaveBeenCalledWith('test', []);
    });
    it('should create new second level eventrix instance with event scope', () => {
        const mockedListener = jest.fn();
        eventrix.listen('Test:List:setTest', mockedListener);
        const testInstance = eventrix.create({ eventScope: 'Test' });
        const testListInstance = testInstance.create({ eventScope: 'List' });
        testListInstance.emit('setTest', 'test');
        expect(mockedListener).toHaveBeenCalledWith('test', []);
    });
    it('should create new eventrix instance with state scope', () => {
        const testInstance = eventrix.create({ stateScope: 'scope1' });
        expect(testInstance.getState('scope2')).toEqual(initialState.scope1.scope2);
    });
    it('should create new second level eventrix instance with state scope', () => {
        const scopedInstance = eventrix.create({ stateScope: 'scope1' });
        const scopedInstance2 = scopedInstance.create({ stateScope: 'scope2' });
        expect(scopedInstance2.getState('scope3')).toEqual(initialState.scope1.scope2.scope3);
    });
    it('should get correct state path with scope', () => {
        const scopedInstance = eventrix.create({ stateScope: 'scope1' });
        const scopedInstance2 = scopedInstance.create({ stateScope: 'scope2' });
        const scopedInstance3 = scopedInstance2.create({ stateScope: 'scope3' });
        const scopedInstance4 = scopedInstance3.create({ stateScope: 'scope4' });

        expect(scopedInstance4.getStatePathWithScope()).toEqual('scope1.scope2.scope3.scope4');
        expect(scopedInstance4.getParent()?.getStatePathWithScope()).toEqual('scope1.scope2.scope3');
        expect(scopedInstance4.getParent()?.getParent()?.getStatePathWithScope()).toEqual('scope1.scope2');
        expect(scopedInstance4.getParent()?.getParent()?.getParent()?.getStatePathWithScope()).toEqual('scope1');
        expect(scopedInstance4.getParent()?.getParent()?.getParent()?.getParent()?.getStatePathWithScope()).toEqual(undefined);
        expect(scopedInstance4.getFirstParent().getStatePathWithScope()).toEqual(undefined);
    });
    it('should get correct event name with scope', () => {
        const scopedInstance = eventrix.create({ eventScope: 'scope1' });
        const scopedInstance2 = scopedInstance.create({ eventScope: 'scope2' });
        const scopedInstance3 = scopedInstance2.create({ eventScope: 'scope3' });
        const scopedInstance4 = scopedInstance3.create({ eventScope: 'scope4' });

        expect(scopedInstance4.getEventNameWithScope('')).toEqual('scope1:scope2:scope3:scope4');
        expect(scopedInstance4.getParent()?.getEventNameWithScope('')).toEqual('scope1:scope2:scope3');
        expect(scopedInstance4.getParent()?.getParent()?.getEventNameWithScope('')).toEqual('scope1:scope2');
        expect(scopedInstance4.getParent()?.getParent()?.getParent()?.getEventNameWithScope('')).toEqual('scope1');
        expect(scopedInstance4.getParent()?.getParent()?.getParent()?.getParent()?.getEventNameWithScope('')).toEqual('');
        expect(scopedInstance4.getFirstParent().getEventNameWithScope('')).toEqual('');
    });

    describe('should run error callback', () => {
        it('when emit catch error on receiver failed', () => {
            const eventName = 'setBar';
            const eventData = 'test';
            const eventsReceiver = new EventsReceiver(eventName, (name, data, store) => {
                throw 'failedReceiver';
            });
            const errorCallback = jest.fn();
            eventrix.onError(errorCallback);
            eventrix.useReceiver(eventsReceiver);
            return eventrix.emit(eventName, eventData).catch(() => {
                expect(errorCallback).toHaveBeenCalledWith('failedReceiver', eventName, eventData, initialState);
                expect(eventrix.getState()).toEqual(initialState);
            });
        });

        it('when emit catch error on listener failed', () => {
            const eventName = 'setBar';
            const eventData = 'test';

            const failedListener = () => {
                throw 'failedListener';
            };
            const errorCallback = jest.fn();
            eventrix.onError(errorCallback);
            eventrix.listen(eventName, failedListener);
            return eventrix.emit(eventName, eventData).catch(() => {
                expect(errorCallback).toHaveBeenCalledWith('failedListener', eventName, eventData, initialState);
                expect(eventrix.getState()).toEqual(initialState);
            });
        });
    });
});
