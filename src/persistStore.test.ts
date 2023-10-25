import connectPersistStore from './persistStore';
import Eventrix from './Eventrix';
import { PersistStoreConfig, SyncStorage, AsyncStorage } from './interfaces';

interface InitialStateI {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
    f: {
        g: string;
    };
}

describe('persistStore', () => {
    describe('sync', () => {
        let storage: SyncStorage;
        let initialState: InitialStateI;
        let eventrix: Eventrix;

        beforeEach(() => {
            storage = {
                setItem: jest.fn(),
                getItem: jest.fn(() => ''),
            };
            initialState = {
                a: 'a state',
                b: 'b state',
                c: 'c state',
                d: 'd state',
                e: 'e state',
                f: {
                    g: 'g state',
                },
            };
            eventrix = new Eventrix(initialState);
        });

        it('should add state to localstorage when setState was invoked with item from whiteList', () => {
            const config: PersistStoreConfig<InitialStateI> = {
                whiteList: ['a', 'c'],
                storage,
                storageKey: 'myStorageKey',
            };
            connectPersistStore(eventrix, config);
            eventrix.stateManager.setState('c', 'c new state');
            const serializedData = JSON.stringify({
                data: [
                    ['a', 'a state'],
                    ['c', 'c new state'],
                ],
            });
            expect(storage.setItem).toHaveBeenCalledWith('myStorageKey', serializedData);
        });

        it('should not add state when setState was invoked with item not from whiteList', () => {
            const config: PersistStoreConfig<InitialStateI> = {
                whiteList: ['c'],
                storage,
                storageKey: 'myStorageKey',
            };
            connectPersistStore(eventrix, config);
            eventrix.stateManager.setState('d', 'd new state');
            const serializedData = JSON.stringify({
                data: [['d', 'd new state']],
            });
            expect(storage.setItem).not.toHaveBeenCalledWith('myStorageKey', serializedData);
        });

        it('should save all states from initialState except states from blackList', () => {
            const config: PersistStoreConfig<InitialStateI> = {
                blackList: ['a', 'e'],
                storage,
                storageKey: 'myStorageKey',
            };
            connectPersistStore(eventrix, config);
            eventrix.stateManager.setState('b', 'b new state');
            const serializedData = JSON.stringify({
                data: [
                    ['b', 'b new state'],
                    ['c', 'c state'],
                    ['d', 'd state'],
                    ['f', { g: 'g state' }],
                ],
            });
            expect(storage.setItem).toHaveBeenCalledWith('myStorageKey', serializedData);
        });

        it('should not add states to localstorage if setState was invoked with item from blackList', () => {
            const config: PersistStoreConfig<InitialStateI> = {
                blackList: ['a', 'e'],
                storage,
                storageKey: 'myStorageKey',
            };
            connectPersistStore(eventrix, config);
            eventrix.stateManager.setState('a', 'a new state');
            expect(storage.setItem).not.toHaveBeenCalled();
        });

        it('should not add state to localstorage if setState was invoked with nested state from blackList', () => {
            const config: PersistStoreConfig<InitialStateI> = {
                blackList: ['a', 'e', 'f'],
                storage,
                storageKey: 'myStorageKey',
            };
            connectPersistStore(eventrix, config);
            eventrix.stateManager.setState('f.g', 'g new state');
            expect(storage.setItem).not.toHaveBeenCalled();
        });
    });

    describe('async', () => {
        let storage: AsyncStorage;
        let initialState: InitialStateI;
        let eventrix: Eventrix;

        beforeEach(() => {
            storage = {
                setItem: jest.fn(() => Promise.resolve()),
                getItem: jest.fn(() => Promise.resolve('')),
            };
            initialState = {
                a: 'a state',
                b: 'b state',
                c: 'c state',
                d: 'd state',
                e: 'e state',
                f: { g: 'g state' },
            };
            eventrix = new Eventrix(initialState);
        });

        it('should add state to localstorage when setState was invoked with item from whiteList', () => {
            const config: PersistStoreConfig<InitialStateI> = {
                whiteList: ['c'],
                storage,
                storageKey: 'myStorageKey',
            };
            connectPersistStore(eventrix, config);
            eventrix.stateManager.setState('c', 'c new state');
            const serializedData = JSON.stringify({
                data: [['c', 'c new state']],
            });
            expect(storage.setItem).toHaveBeenCalledWith('myStorageKey', serializedData);
        });

        it('should not add state when setState was invoked with item not from whiteList', () => {
            const config: PersistStoreConfig<InitialStateI> = {
                whiteList: ['c'],
                storage,
                storageKey: 'myStorageKey',
            };
            connectPersistStore(eventrix, config);
            eventrix.stateManager.setState('d', 'd new state');
            const serializedData = JSON.stringify({
                data: [['d', 'd new state']],
            });
            expect(storage.setItem).not.toHaveBeenCalledWith('myStorageKey', serializedData);
        });

        it('should save all states from initialState except states from blackList', () => {
            const config: PersistStoreConfig<InitialStateI> = {
                blackList: ['a', 'e'],
                storage,
                storageKey: 'myStorageKey',
            };
            connectPersistStore(eventrix, config);
            eventrix.stateManager.setState('b', 'b new state');
            const serializedData = JSON.stringify({
                data: [
                    ['b', 'b new state'],
                    ['c', 'c state'],
                    ['d', 'd state'],
                    ['f', { g: 'g state' }],
                ],
            });
            expect(storage.setItem).toHaveBeenCalledWith('myStorageKey', serializedData);
        });

        it('should not add states to localstorage if setState was invoked with item from blackList', () => {
            const config: PersistStoreConfig<InitialStateI> = {
                blackList: ['a', 'e'],
                storage,
                storageKey: 'myStorageKey',
            };
            connectPersistStore(eventrix, config);
            eventrix.stateManager.setState('a', 'a new state');
            expect(storage.setItem).not.toHaveBeenCalled();
        });

        it('should not add state to localstorage if setState was invoked with nested state from blackList', () => {
            const config: PersistStoreConfig<InitialStateI> = {
                blackList: ['a', 'e', 'f'],
                storage,
                storageKey: 'myStorageKey',
            };
            connectPersistStore(eventrix, config);
            eventrix.stateManager.setState('f.g', 'g new state');
            expect(storage.setItem).not.toHaveBeenCalled();
        });
    });
});
