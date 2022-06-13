import { connectPersistStore } from './persistStore';
import Eventrix from './Eventrix';

describe('persistStore', () => {
    const initialState = {
        a: 'a state',
        b: 'b state',
        c: 'c state',
        d: 'd state',
    };

    let eventrix = new Eventrix(initialState);
    let config;

    describe('sync', () => {
        const storage = {
            setItem: jest.fn(),
            getItem: jest.fn(() => ''),
        };

        beforeEach(() => {
            eventrix = new Eventrix(initialState);
            config = {
                blackList: ['a', 'b'],
                whiteList: ['c', 'd'],
                storage,
                storageKey: 'myStorageKey',
            };
        });

        it('should add states from white list to the storage', () => {
            connectPersistStore(eventrix, config);
            eventrix.stateManager.setState('a', {});
            const serializedData = JSON.stringify({
                data: [
                    ['c', 'c state'],
                    ['d', 'd state'],
                ],
            });
            expect(storage.setItem).toHaveBeenCalledWith('myStorageKey', serializedData);
        });

        it('should check if in localstorage are items only from whiteList', () => {
            connectPersistStore(eventrix, config);
            // const savedStates = storage.getItem('myStorageKey');
            expect(eventrix.getState()).toEqual({
                data: [
                    ['c', 'c test'],
                    ['d', 'd test'],
                ],
            });
        });

        // it('should run getItem method from storage and compare returned items with white list', () => {});
    });

    describe('async', () => {
        const storage = {
            setItem: jest.fn(() => Promise.resolve()),
            getItem: jest.fn(() => Promise.resolve('')),
        };

        beforeEach(() => {
            eventrix = new Eventrix(initialState);
            config = {
                blackList: ['a', 'b'],
                whiteList: ['c', 'd'],
                storage,
                storageKey: 'myStorageKey',
            };
        });

        it('should add states from white list to the storage', () => {
            connectPersistStore(eventrix, config);
            eventrix.stateManager.setState('a', {});
            const serializedData = JSON.stringify({
                data: [
                    ['c', 'c state'],
                    ['d', 'd state'],
                ],
            });
            expect(storage.setItem).toHaveBeenCalledWith('myStorageKey', serializedData);
        });

        // it('should run getItem method from storage and compare returned items with white list', () => {});
    });
});
