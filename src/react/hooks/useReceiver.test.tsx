import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { EventrixProvider } from '../context';
import Eventrix from '../../Eventrix';
import useEmit from './useEmit';
import useEvent from './useEvent';
import useEventrixState from './useEventrixState';
import useReceiver from './useReceiver';

describe('useReceiver', () => {
    const ItemComponent = () => {
        const emit = useEmit();
        useReceiver<string>('testEvent', (eventName, eventData, stateManager) => {
            act(() => {
                stateManager.setState('foo', eventData);
            });
        });
        useEvent('remoteFetch', () => {
            act(() => {
                emit('testEvent', 'testData').then(() => {
                    emit('fetchData.success');
                });
            });
        });
        const [foo] = useEventrixState<string>('foo');
        return (
            <div>
                <button
                    data-testid="fetchDataButton"
                    onClick={() => {
                        emit('testEvent', 'testData');
                    }}
                >
                    Fetch data
                </button>
                {foo ? <div data-testid="eventData">{foo}</div> : null}
            </div>
        );
    };
    const TestContainer = ({ eventrix, children }: any) => <EventrixProvider eventrix={eventrix}>{children}</EventrixProvider>;

    it('should set state on emit event', async () => {
        const eventrixInstance = new Eventrix({});
        const { getByTestId } = render(
            <TestContainer eventrix={eventrixInstance}>
                <ItemComponent />
            </TestContainer>,
        );
        act(() => {
            eventrixInstance.emit('remoteFetch');
        });
        await waitFor(() => getByTestId('eventData'));
        expect(getByTestId('eventData').textContent).toEqual('testData');
    });
});
