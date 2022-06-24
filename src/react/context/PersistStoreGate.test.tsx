import React from 'react';
import { render, waitFor } from '@testing-library/react';
import PersistStoreGate from './PersistStoreGate';
import Eventrix from '../../Eventrix';
import connectPersistStore from '../../persistStore';
import { AsyncStorage, PersistStoreConfig, SyncStorage } from '../../interfaces';

describe('PersistStoreGate', () => {
    const Loader = () => <div data-testid="loaderComponent">Loading</div>;
    const TestComponent = () => <div data-testid="testComponent">TestComponent</div>;
    describe('async storage', () => {
        let storage: AsyncStorage;
        beforeEach(() => {
            storage = {
                setItem: jest.fn(() => Promise.resolve()),
                getItem: jest.fn(() => Promise.resolve('')),
            };
        });

        it('should render loader when storage not loaded', () => {
            const eventrixInstance = new Eventrix({});
            const config: PersistStoreConfig<any> = {
                whiteList: [],
                storage,
                storageKey: 'myStorageKey',
            };
            connectPersistStore(eventrixInstance, config);

            const { getByTestId } = render(
                <PersistStoreGate eventrix={eventrixInstance} loader={Loader}>
                    <TestComponent />
                </PersistStoreGate>,
            );
            expect(getByTestId('loaderComponent').textContent).toEqual('Loading');
        });

        it('should render component when storage loaded', async () => {
            const eventrixInstance = new Eventrix({});
            const config: PersistStoreConfig<any> = {
                whiteList: [],
                storage,
                storageKey: 'myStorageKey',
            };
            connectPersistStore(eventrixInstance, config);

            const { getByTestId } = render(
                <PersistStoreGate eventrix={eventrixInstance} loader={Loader}>
                    <TestComponent />
                </PersistStoreGate>,
            );

            await waitFor(() => getByTestId('testComponent'));

            expect(getByTestId('testComponent').textContent).toEqual('TestComponent');
        });
    });
    describe('sync storage', () => {
        let storage: SyncStorage;
        beforeEach(() => {
            storage = {
                setItem: jest.fn(),
                getItem: jest.fn(() => ''),
            };
        });

        it('should render loader when storage not loaded', () => {
            const eventrixInstance = new Eventrix({});
            const config: PersistStoreConfig<any> = {
                whiteList: [],
                storage,
                storageKey: 'myStorageKey',
            };
            connectPersistStore(eventrixInstance, config);

            const { getByTestId } = render(
                <PersistStoreGate eventrix={eventrixInstance} loader={Loader}>
                    <TestComponent />
                </PersistStoreGate>,
            );
            expect(getByTestId('loaderComponent').textContent).toEqual('Loading');
        });

        it('should render component when storage loaded', async () => {
            const eventrixInstance = new Eventrix({});
            const config: PersistStoreConfig<any> = {
                whiteList: [],
                storage,
                storageKey: 'myStorageKey',
            };
            connectPersistStore(eventrixInstance, config);

            const { getByTestId } = render(
                <PersistStoreGate eventrix={eventrixInstance} loader={Loader}>
                    <TestComponent />
                </PersistStoreGate>,
            );

            await waitFor(() => getByTestId('testComponent'));

            expect(getByTestId('testComponent').textContent).toEqual('TestComponent');
        });
    });
    describe('persist storage not connected', () => {
        it('should render component when storage is not connected', () => {
            const eventrixInstance = new Eventrix({});

            const { getByTestId } = render(
                <PersistStoreGate eventrix={eventrixInstance} loader={Loader}>
                    <TestComponent />
                </PersistStoreGate>,
            );
            expect(getByTestId('testComponent').textContent).toEqual('TestComponent');
        });
    });
});
