import React from 'react';
import { render } from '@testing-library/react';
import PersistStoreGate from './PersistStoreGate';
import Eventrix from '../../Eventrix';

describe('PersistStoreGate', () => {
    const Loader = () => <div data-testid="loaderComponent">Loading</div>;
    const TestComponent = () => <div data-testid="testComponent">TestComponent</div>;

    it('should render component', async () => {
        const eventrixInstance = new Eventrix({});
        const { getByTestId } = render(
            <PersistStoreGate eventrix={eventrixInstance} loader={Loader}>
                <TestComponent />
            </PersistStoreGate>
        );
        expect(getByTestId('testComponent').textContent).toEqual('TestComponent');
    });

    it('should render loader', async () => {
        const eventrix = {
            persistStoreLoadPromise: Promise.resolve(),
        };
        const { getByTestId } = render(
            <PersistStoreGate eventrix={eventrix} loader={Loader}>
                <TestComponent />
            </PersistStoreGate>
        );
        expect(getByTestId('loaderComponent').textContent).toEqual('Loading');
    });
});
