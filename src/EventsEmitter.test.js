import EventsEmitter from './EventsEmitter';

describe('EventsEmitter', () => {
    describe('listen', () => {
        const eventsEmitter = new EventsEmitter();
        const mockListener = jest.fn();
        const mockListener2 = jest.fn();
        const fakeListener = {};

        it('should not register listener if is not a function', () => {
            console.warn = jest.fn();
            eventsEmitter.listen('testEvent', fakeListener);
            expect(eventsEmitter.listeners.testEvent.length).toBe(0);
            expect(console.warn).toBeCalledWith('EventsEmitter->listen - "testEvent" listener is not a function');
        });

        it('should register listener', () => {
            console.warn = jest.fn();
            eventsEmitter.listen('testEvent', mockListener);
            expect(eventsEmitter.listeners.testEvent.length).toBe(1);
            expect(console.warn).not.toBeCalled();
        });

        it('should not register the same listener two times', () => {
            console.warn = jest.fn();
            eventsEmitter.listen('testEvent', mockListener);
            expect(eventsEmitter.listeners.testEvent.length).toBe(1);
            expect(console.warn).toBeCalledWith('EventsEmitter->listen - "testEvent" events listener is already registered');
        });

        it('should register next listeners if is not the same', () => {
            console.warn = jest.fn();
            eventsEmitter.listen('testEvent', mockListener2);
            expect(eventsEmitter.listeners.testEvent.length).toBe(2);
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
            eventsEmitter.listen('testEvent2', {});
            eventsEmitter.unlisten('testEvent2', mockListener);
            expect(eventsEmitter.listeners.testEvent2.length).toBe(0);
            expect(console.warn).toBeCalledWith('EventsEmitter->unlisten - "testEvent2" event dont have registered listener');
        });

        it('should not unregistered listener if not exists', () => {
            console.warn = jest.fn();
            eventsEmitter.unlisten('testEvent', mockListener2);
            expect(eventsEmitter.listeners.testEvent.length).toBe(1);
            expect(console.warn).toBeCalledWith('EventsEmitter->unlisten - "testEvent" listener not exists');
        });

        it('should unregistered listener', () => {
            console.warn = jest.fn();
            eventsEmitter.unlisten('testEvent', mockListener);
            expect(eventsEmitter.listeners.testEvent.length).toBe(0);
            expect(console.warn).not.toBeCalled();
        });
    });

    describe('emit', () => {
        let eventsEmitter;
        let mockListener;
        beforeEach(() => {
            eventsEmitter = new EventsEmitter();
            mockListener = jest.fn();
            eventsEmitter.listen('testEvent', mockListener);
        });

        it('should ignore event when dont have registered events listeners', () => {
            const store = {
                runReceivers: () => ['test'],
            };
            eventsEmitter.useStore(store);
            const data = { foo: 'bar', bar: 'foo' };
            eventsEmitter.emit('fooEvent', data);
            expect(mockListener).not.toBeCalledWith(data, ['test']);
        });

        it('should call all events listeners with data', () => {
            const store = {
                runReceivers: () => ['test'],
            };
            eventsEmitter.useStore(store);
            const data = { foo: 'bar', bar: 'foo' };
            eventsEmitter.emit('testEvent', data);
            expect(mockListener).toBeCalledWith(data, ['test']);
        });

        it('should call all matched events listeners with data', () => {
            const store = {
                runReceivers: () => ['test'],
            };
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
                }
            };
            eventsEmitter.emit('foo*', data);
            expect(mockListener).not.toBeCalled();
            expect(fooMockListener).toBeCalledWith(data, ['test']);
            expect(fooBarMockListener).toBeCalledWith(data.bar, ['test']);
            expect(fooBarFooMockListener).toBeCalledWith(data.bar.foo, ['test']);
        });

        it('should wait for events receivers handler and call all events listeners with data', () => {
            const store = {
                runReceivers: () => Promise.resolve(['testResponse']),
            };
            eventsEmitter.useStore(store);
            const data = { foo: 'bar', bar: 'foo' };
            return eventsEmitter.emit('testEvent', data).then(() => {
                expect(mockListener).toBeCalledWith(data, ['testResponse']);
            });

        });
    });
});
