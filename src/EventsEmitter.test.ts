import EventsEmitter from './EventsEmitter';

describe('EventsEmitter', () => {
    describe('listen', () => {
        const eventsEmitter = new EventsEmitter();
        const mockListener = jest.fn();
        const mockListener2 = jest.fn();

        it('should not register listener if is not a function', () => {
            console.warn = jest.fn();
            // @ts-ignore
            eventsEmitter.listen('testEvent', {});
            expect(eventsEmitter.listeners.testEvent).toHaveLength(0);
            expect(console.warn).toBeCalledWith('EventsEmitter->listen - "testEvent" listener is not a function');
        });

        it('should register listener', () => {
            console.warn = jest.fn();
            eventsEmitter.listen('testEvent', mockListener);
            expect(eventsEmitter.listeners.testEvent).toHaveLength(1);
            expect(console.warn).not.toBeCalled();
        });

        it('should not register the same listener two times', () => {
            console.warn = jest.fn();
            eventsEmitter.listen('testEvent', mockListener);
            expect(eventsEmitter.listeners.testEvent).toHaveLength(1);
            expect(console.warn).toBeCalledWith('EventsEmitter->listen - "testEvent" events listener is already registered');
        });

        it('should register next listeners if is not the same', () => {
            console.warn = jest.fn();
            eventsEmitter.listen('testEvent', mockListener2);
            expect(eventsEmitter.listeners.testEvent).toHaveLength(2);
            expect(console.warn).not.toBeCalled();
        });
    });
    describe('unlisten', () => {
        const eventsEmitter = new EventsEmitter();
        const mockListener = jest.fn();
        const mockListener2 = jest.fn();
        eventsEmitter.listen('testEvent', mockListener);

        it('should not unregistered listener if event not exist', () => {
            console.warn = jest.fn();
            eventsEmitter.unlisten('testEvent3', mockListener);
            expect(eventsEmitter.listeners.testEvent3).toBeUndefined();
            expect(console.warn).toBeCalledWith('EventsEmitter->unlisten - "testEvent3" event not registered');
        });

        it('should not unregistered listener if event dont have registred listeners', () => {
            console.warn = jest.fn();
            // @ts-ignore
            eventsEmitter.listen('testEvent2', {});
            eventsEmitter.unlisten('testEvent2', mockListener);
            expect(eventsEmitter.listeners.testEvent2).toHaveLength(0);
            expect(console.warn).toBeCalledWith('EventsEmitter->unlisten - "testEvent2" event dont have registered listener');
        });

        it('should not unregistered listener if not exists', () => {
            console.warn = jest.fn();
            eventsEmitter.unlisten('testEvent', mockListener2);
            expect(eventsEmitter.listeners.testEvent).toHaveLength(1);
            expect(console.warn).toBeCalledWith('EventsEmitter->unlisten - "testEvent" listener not exists');
        });

        it('should unregistered listener', () => {
            console.warn = jest.fn();
            eventsEmitter.unlisten('testEvent', mockListener);
            expect(eventsEmitter.listeners.testEvent).toBe(undefined);
            expect(console.warn).not.toBeCalled();
        });
    });

    describe('emit', () => {
        let eventsEmitter = new EventsEmitter();
        let mockListener = jest.fn();
        let store: any = {
            state: {},
            receivers: {},
            setState: jest.fn(),
            getState: jest.fn(),
            useReceiver: jest.fn(),
            removeReceiver: jest.fn(),
            getEventData: jest.fn(),
            runListeners: jest.fn(),
            emitWild: jest.fn(),
            runReceivers: () => ['test'],
        };
        beforeEach(() => {
            store = {
                state: {},
                receivers: {},
                setState: jest.fn(),
                getState: jest.fn(),
                useReceiver: jest.fn(),
                removeReceiver: jest.fn(),
                getEventData: jest.fn(),
                runListeners: jest.fn(),
                emitWild: jest.fn(),
                runReceivers: () => ['test'],
            };
            eventsEmitter = new EventsEmitter();
            mockListener = jest.fn();
            eventsEmitter.listen('testEvent', mockListener);
        });

        it('should ignore event when dont have registered events listeners', () => {
            eventsEmitter.useStore(store);
            const data = { foo: 'bar', bar: 'foo' };
            eventsEmitter.emit('fooEvent', data);
            expect(mockListener).not.toBeCalledWith(data, ['test']);
        });

        it('should call all events listeners with data', () => {
            eventsEmitter.useStore(store);
            const data = { foo: 'bar', bar: 'foo' };
            eventsEmitter.emit('testEvent', data);
            expect(mockListener).toBeCalledWith(data, ['test']);
        });
        describe('emitWild', () => {
            it('should call all matched events listeners with data and set matched listeners cache', () => {
                eventsEmitter.useStore(store);
                const fooMockListener = jest.fn();
                const fooBarMockListener = jest.fn();
                const fooBarFooMockListener = jest.fn();
                eventsEmitter.listen('foo', fooMockListener);
                eventsEmitter.listen('foo.bar', fooBarMockListener);
                eventsEmitter.listen('foo.bar.foo', fooBarFooMockListener);
                const data = {
                    bar: {
                        foo: 'test',
                    },
                };
                eventsEmitter.emitWild('foo', data);
                expect(mockListener).not.toBeCalled();
                expect(fooMockListener).toBeCalledWith(data, []);
                expect(fooBarMockListener).toBeCalledWith(data.bar, []);
                expect(fooBarFooMockListener).toBeCalledWith(data.bar.foo, []);
                expect(eventsEmitter.matchedListenersCache).toEqual({ foo: ['foo', 'foo.bar', 'foo.bar.foo'] });
            });

            it('should use matched listeners cache when is available', () => {
                eventsEmitter.useStore(store);
                const fooMockListener = jest.fn();
                const fooBarMockListener = jest.fn();
                const fooBarFooMockListener = jest.fn();
                eventsEmitter.listen('foo', fooMockListener);
                eventsEmitter.listen('foo.bar', fooBarMockListener);
                eventsEmitter.listen('foo.bar.foo', fooBarFooMockListener);
                const data = {
                    bar: {
                        foo: 'test',
                    },
                };
                eventsEmitter.emitWild('foo', data);
                eventsEmitter.matchedListenersCache.foo = ['foo', 'foo.bar.foo'];
                eventsEmitter.emitWild('foo', data);
                expect(fooBarMockListener).toHaveBeenCalledTimes(1);
                expect(fooBarFooMockListener).toHaveBeenCalledTimes(2);
            });
        });

        it('should wait for events receivers handler and call all events listeners with data', () => {
            const storeWithPromiseReceivers: any = {
                state: {},
                receivers: {},
                setState: jest.fn(),
                getState: jest.fn(),
                useReceiver: jest.fn(),
                removeReceiver: jest.fn(),
                getEventData: jest.fn(),
                runListeners: jest.fn(),
                emitWild: jest.fn(),
                runReceivers: () => Promise.resolve(['testResponse']),
            };
            eventsEmitter.useStore(storeWithPromiseReceivers);
            const data = { foo: 'bar', bar: 'foo' };
            return eventsEmitter.emit('testEvent', data).then(() => {
                expect(mockListener).toBeCalledWith(data, ['testResponse']);
            });
        });
    });
});
