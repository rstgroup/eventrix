import { connectPersistStore } from './persistStore';
import Eventrix from './Eventrix';
import { PersistStoreConfig, SyncStorage, AsyncStorage } from './interfaces';

interface InitialStateI {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
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
            };
            eventrix = new Eventrix(initialState);
        });

        it('should add states from white list to the localstorage', () => {
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

        it('should not add states when there are not in white list', () => {
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

        it('should check if in localstorage are all states from initialState except states from black list', () => {
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
            };
            eventrix = new Eventrix(initialState);
        });

        it('should add states from white list to the localstorage', () => {
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

        it('should not add states when there are not in white list', () => {
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

        it('should check if in localstorage are all states from initialState except states from black list', () => {
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
    });
});
