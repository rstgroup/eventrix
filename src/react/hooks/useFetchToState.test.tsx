import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { EventrixProvider } from '../context';
import Eventrix from '../../Eventrix';
import useEmit from './useEmit';
import useEvent from './useEvent';
import useEventrixState from './useEventrixState';
import useFetchToState from './useFetchToState';

describe('useFetchToState', () => {
    const ItemComponent = () => {
        const emit = useEmit();
        const [emitFetch] = useFetchToState('testEvent', 'foo', (eventData) => Promise.resolve(eventData));
        useEvent('remoteFetch', () => {
            act(() => {
                emitFetch('testData').then(() => {
                    act(() => {
                        emit('fetchData.success');
                    });
                });
            });
        });
        const [foo] = useEventrixState<string>('foo');
        return (
            <div>
                <button
                    data-testid="fetchDataButton"
                    onClick={() => {
                        act(() => {
                            emitFetch('testData');
                        });
                    }}
                >
                    Fetch data
                </button>
                {foo ? <div data-testid="eventData">{foo}</div> : null}
            </div>
        );
    };
    const TestContainer = ({ eventrix, children }: any) => <EventrixProvider eventrix={eventrix}>{children}</EventrixProvider>;

    it('should fetch data and set state', async () => {
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
