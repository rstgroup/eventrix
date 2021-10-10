import React from 'react';
import { render } from '@testing-library/react';
import { EventrixProvider } from '../context';
import Eventrix from '../../Eventrix';
import useEventState from './useEventState';

describe('useEventState', () => {
    const ItemComponent = () => {
        const [eventData] = useEventState<string>('testEvent');
        return <div data-testid="eventData">{eventData}</div>;
    };
    const TestContainer = ({ eventrix, children }: any) => <EventrixProvider eventrix={eventrix}>{children}</EventrixProvider>;

    it('should save event data in state', () => {
        const eventrixInstance = new Eventrix({});

        const { getByTestId } = render(
            <TestContainer eventrix={eventrixInstance}>
                <ItemComponent />
            </TestContainer>,
        );
        eventrixInstance.emit('testEvent', 'testData');
        expect(getByTestId('eventData').textContent).toEqual('testData');
    });
});
