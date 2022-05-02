import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { EventrixProvider } from '../context';
import Eventrix from '../../Eventrix';
import useEventState from './useEventState';

describe('useEventState', () => {
    const ItemComponent = () => {
        const [eventData] = useEventState<string>('testEvent');
        return <div data-testid="eventData">{!!eventData && <div data-testid="eventDataValue">{eventData}</div>}</div>;
    };
    const TestContainer = ({ eventrix, children }: any) => <EventrixProvider eventrix={eventrix}>{children}</EventrixProvider>;

    it('should save event data in state', async () => {
        const eventrixInstance = new Eventrix({});

        const { getByTestId } = render(
            <TestContainer eventrix={eventrixInstance}>
                <ItemComponent />
            </TestContainer>,
        );
        act(() => {
            eventrixInstance.emit('testEvent', 'testData');
        });
        await waitFor(() => getByTestId('eventDataValue'));
        expect(getByTestId('eventData').textContent).toEqual('testData');
    });
});
