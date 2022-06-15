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

const getStateKeys = <StateI>(storeState: StateI): StateKeysList<StateI> => {
    return Object.keys(storeState) as StateKeysList<StateI>;
};

const isDirectSetStateEvent = (eventName: string): boolean => eventName.indexOf('setState:') === 0 && eventName.indexOf('*') < 0;

const isBlackListSetStateEvent = <StateI>(eventName: string, blackList: StateKeysList<StateI>): boolean =>
    isDirectSetStateEvent(eventName) && blackList.findIndex((state) => eventName.indexOf(`setState:${state as string}`) === 0) > -1;

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

    if (blackList) {
        const blackListReceiver = new EventsReceiver<unknown, void>('*', (eventName: string) => {
            if (!isBlackListSetStateEvent<StateI>(eventName, blackList)) {
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
    eventrix.persistStoreLoadPromise = eventrix.emit(GET_PERSIST_STORE_STATE);
};
