import { EventsReceiver } from './index';
import { GET_PERSIST_STORE_STATE } from './eventsNames/persistStore';
import { AsyncStorage, EventrixI, PersistStoreConfig, StateKeys, StateKeysList, StorageDataItem, SyncStorage } from './interfaces';
import { isPromise, registerListeners } from './helpers';

const getStorageData = (storage: SyncStorage | AsyncStorage, storageKey: string): StorageDataItem | Promise<StorageDataItem> => {
    const defaultData = '{"data": []}';
    const storageData = storage.getItem(storageKey);
    if (isPromise(storageData)) {
        const storagePromise = storageData as Promise<string>;
        return storagePromise.then((data: string) => {
            return JSON.parse(data || defaultData).data;
        });
    }
    const data = storageData as string;
    return JSON.parse(data || defaultData).data;
};

const getStateKeys = <StateI>(storeState: StateI): StateKeysList<StateI> => {
    return Object.keys(storeState) as StateKeysList<StateI>;
};

export const connectPersistStore = <StateI>(eventrix: EventrixI, config: PersistStoreConfig<StateI>): void => {
    const {
        blackList,
        whiteList,
        storage,
        storageKey,
        parseFromStorage = (state: any) => state,
        parseToStorage = (state: any) => state,
    } = config;
    const setPersistStoreState = (): void => {
        if (blackList) {
            const storeState = eventrix.getState<StateI>();
            const mappedState: StorageDataItem[] = [];
            getStateKeys(storeState).forEach((key): void => {
                if (!blackList.includes(key) && typeof key === 'string') {
                    mappedState.push([key, parseToStorage(storeState[key], key)]);
                }
            });
            const serializedData = JSON.stringify({ data: mappedState });
            storage.setItem(storageKey, serializedData);
        }
        if (whiteList) {
            const mappedState: StorageDataItem[] = [];
            whiteList.forEach((key): void => {
                if (typeof key === 'string') {
                    mappedState.push([key, parseToStorage(eventrix.getState(key), key)]);
                }
            });
            const serializedData = JSON.stringify({ data: mappedState });
            storage.setItem(storageKey, serializedData);
        }
    };

    const getPersistStoreStateReceiver = new EventsReceiver<undefined, void | Promise<void>>(
        GET_PERSIST_STORE_STATE,
        (eventName, eventData, stateManager) => {
            const mappedStoreData = getStorageData(storage, storageKey);
            if (isPromise(mappedStoreData)) {
                const storeDataPromise = mappedStoreData as Promise<StorageDataItem>;
                return storeDataPromise.then((data) => {
                    data.forEach(([stateName, value]) => {
                        stateManager.setState(stateName, parseFromStorage(value, stateName));
                    });
                });
            }
            const storeData = mappedStoreData as StorageDataItem;
            storeData.forEach(([stateName, value]: StorageDataItem) => {
                stateManager.setState(stateName, parseFromStorage(value, stateName));
            });
        },
    );
    eventrix.useReceiver(getPersistStoreStateReceiver);

    if (blackList) {
        const blackListReceiver = new EventsReceiver<unknown, void>('*', (eventName: string) => {
            if (eventName.indexOf('setState:') === 0) {
                const stateName = eventName.split(':')[1] as StateKeys<StateI>;
                if (blackList.includes(stateName)) {
                    setPersistStoreState();
                }
            }
        });
        eventrix.useReceiver(blackListReceiver);
        return;
    }
    whiteList.forEach((stateName) => {
        if (typeof stateName === 'string') {
            registerListeners(eventrix, stateName, setPersistStoreState);
        }
    });
    eventrix.persistStoreLoadPromise = eventrix.emit(GET_PERSIST_STORE_STATE);
};
