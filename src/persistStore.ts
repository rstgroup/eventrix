import { EventsReceiver } from './index';
import { GET_PERSIST_STORE_STATE } from './eventsNames/persistStore';
import { AsyncStorage, EventrixI, PersistStoreConfig, StateKeysList, StorageDataItem, SyncStorage } from './interfaces';
import { isPromise, registerListeners } from './helpers';

const getStorageData = (storage: SyncStorage | AsyncStorage, storageKey: string): StorageDataItem | Promise<StorageDataItem> => {
    const defaultData = '{"data": []}';
    const storageData = storage.getItem(storageKey);
    if (isPromise(storageData)) {
        return storageData.then((data: string) => {
            return JSON.parse(data || defaultData).data;
        });
    }
    return JSON.parse(storageData || defaultData).data;
};

const getStateKeys = <StateI extends {}>(storeState: StateI): StateKeysList<StateI> => {
    return Object.keys(storeState) as StateKeysList<StateI>;
};

const connectPersistStore = <StateI extends {}>(eventrix: EventrixI, config: PersistStoreConfig<StateI>): void => {
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
                return mappedStoreData.then((data) => {
                    data.forEach(([stateName, value]) => {
                        stateManager.setState(stateName, parseFromStorage(value, stateName));
                    });
                });
            }
            mappedStoreData.forEach(([stateName, value]: StorageDataItem) => {
                stateManager.setState(stateName, parseFromStorage(value, stateName));
            });
        },
    );
    eventrix.useReceiver(getPersistStoreStateReceiver);
    eventrix.persistStoreLoadPromise = eventrix.emit(GET_PERSIST_STORE_STATE);

    const isOnBlackList = <StateItem>(blackListKey: StateItem, eventName: string): boolean => {
        return eventName.indexOf(`setState:${blackListKey}`) > -1;
    };

    const isBlackListEvent = <StateI>(blackList: StateKeysList<StateI>, eventName: string): boolean =>
        !eventName.includes(':*') &&
        !eventName.includes('.*') &&
        blackList.findIndex((key) => isOnBlackList<keyof StateI>(key, eventName)) < 0;

    if (blackList) {
        const blackListReceiver = new EventsReceiver<unknown, void>('*', (eventName: string) => {
            if (isBlackListEvent<StateI>(blackList, eventName)) {
                setPersistStoreState();
            }
        });
        eventrix.useReceiver(blackListReceiver);
        return;
    }

    if (whiteList) {
        whiteList.forEach((stateName) => {
            if (typeof stateName === 'string') {
                registerListeners(eventrix, stateName, setPersistStoreState);
            }
        });
    }
};

export default connectPersistStore;
