import { connectPersistStore } from './persistStore';
import Eventrix from './Eventrix';

interface LocalStorageI {
    setItem: (string, any) => void;
    getItem: (string) => any;
}

class LocalStorage implements LocalStorageI {
    storage: object;
    constructor() {
        this.storage = {}
    }

    setItem(key, value) {
        this.storage[key] = value.toString();
    }

    getItem(key) {
        return this.storage[key] || null;
    }
}

describe('persistStore', () => {
    describe('async', () => {
        const localStorage = new LocalStorage();
        const initialState = {
            a: 'a test',
            b: 'b test',
            c: 'c test',
            d: 'd test',
        }

        let eventrix;
        let config;

        beforeEach(() => {
            eventrix = new Eventrix(initialState);
            config = {
                blackList: ['a', 'b'],
                whiteList: ['c', 'd'],
                storage: localStorage,
                storageKey: 'myPersistStoreKey',
            };
        })

        it('should check if whiteList states are saved to persist store', () => {
            const spyStorageSetItem = jest.spyOn(localStorage, 'setItem');
            connectPersistStore(eventrix, config);
            const serializedData = JSON.stringify({ data: [['c', 'c test'], ['d', 'd test']] });
            expect(spyStorageSetItem).toHaveBeenCalledWith('myPersistStoreKey', serializedData);
        })

        it('should check if in localstorage are items only from whiteList', () => {
            connectPersistStore(eventrix, config);
            const savedStates = localStorage.getItem('myPersistStoreKey')
            expect(savedStates).toEqual({ data: [['c', 'c test'], ['d', 'd test']] })
        })

        it('should check if getItem from localstorage was invoked', () => {
            const spyStorageGetItem = jest.spyOn(localStorage, 'getItem');
            connectPersistStore(eventrix, config);
            expect(spyStorageGetItem).toHaveBeenCalled();
        })
    });
})