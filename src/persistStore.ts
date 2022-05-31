import { EventsReceiver } from './index';
import { GET_PERSIST_STORE_STATE } from './eventsNames/persistStore';
import { AsyncStorage, EventrixI, PersistStoreConfig, StorageDataItem, SyncStorage } from './interfaces';
import { registerListeners } from './helpers';

const getStorageData = (storage: SyncStorage | AsyncStorage, storageKey: string): StorageDataItem | Promise<StorageDataItem> => {
    const defaultData = '{"data": []}';
    const storageData = storage.getItem(storageKey);
    if (storageData instanceof Promise) {
        return storageData.then((data) => {
            return JSON.parse(data || defaultData).data;
        });
    }
    return JSON.parse(storageData || defaultData).data;
};

export const connectPersistStore = (eventrix: EventrixI, config: PersistStoreConfig): void => {
    const {
        blackList,
        whiteList,
        storage,
        storageKey,
        parseFromStorage = (state: any) => state,
        parseToStorage = (state: any) => state,
    } = config;
    const setPersistStoreState = () => {
        if (blackList) {
            const storeState = eventrix.getState<any>();
            const mappedState: StorageDataItem[] = [];
            Object.keys(storeState).forEach((key) => {
                if (!blackList.includes(key)) {
                    mappedState.push([key, parseToStorage(storeState[key], key)]);
                }
            });
            const serializedData = JSON.stringify({ data: mappedState });
            storage.setItem(storageKey, serializedData);
        }
        if (whiteList) {
            const mappedState = whiteList.map((key) => [key, parseToStorage(eventrix.getState(key), key)]);
            const serializedData = JSON.stringify({ data: mappedState });
            storage.setItem(storageKey, serializedData);
        }
    };

    const getPersistStoreStateReceiver = new EventsReceiver(GET_PERSIST_STORE_STATE, (eventName, eventData, stateManager) => {
        const mappedStoreData = getStorageData(storage, storageKey);
        if (mappedStoreData instanceof Promise) {
            return mappedStoreData.then((data) => {
                data.forEach(([stateName, value]) => {
                    stateManager.setState(stateName, parseFromStorage(value, stateName));
                });
            });
        }
        mappedStoreData.forEach(([stateName, value]) => {
            stateManager.setState(stateName, parseFromStorage(value, stateName));
        });
    });
    eventrix.useReceiver(getPersistStoreStateReceiver);

    if (blackList) {
        const blackListReceiver = new EventsReceiver('*', (eventName) => {
            if (eventName.indexOf('setState:') === 0) {
                const [, stateName] = eventName.split(':');
                if (blackList.includes(stateName)) {
                    setPersistStoreState();
                }
            }
        });
        eventrix.useReceiver(blackListReceiver);
        return;
    }
    whiteList.forEach((stateName) => {
        registerListeners(eventrix, stateName, setPersistStoreState);
    });
    eventrix.persistStoreLoadPromise = eventrix.emit(GET_PERSIST_STORE_STATE);
};
