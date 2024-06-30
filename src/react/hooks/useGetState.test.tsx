import React, { useState, useEffect } from 'react';
import { act, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EventrixProvider } from '../context';
import Eventrix from '../../Eventrix';
import useGetState from './useGetState';
import useSetState from './useSetState';

describe('useGetState', () => {
    const TestComponent = () => {
        const getState = useGetState<string>('test');
        const setState = useSetState<string>('test');
        const [stateValue, setStateValue] = useState<string | undefined>(getState());

        useEffect(() => {
            setStateValue(getState());
        }, [getState]);

        const handleSetState = () => {
            setState('newTestValue');
            setStateValue(getState());
        };

        return (
            <div>
                <div data-testid="testValue">{stateValue}</div>
                <button data-testid="setStateButton" onClick={handleSetState}>
                    Set State
                </button>
            </div>
        );
    };

    const TestContainer = ({ eventrix, children }: any) => <EventrixProvider eventrix={eventrix}>{children}</EventrixProvider>;

    it('should get the initial state', () => {
        const initialState = { test: 'initialTestValue' };
        const eventrixInstance = new Eventrix(initialState);

        const { getByTestId } = render(
            <TestContainer eventrix={eventrixInstance}>
                <TestComponent />
            </TestContainer>,
        );

        expect(getByTestId('testValue').textContent).toEqual(initialState.test);
    });

    it('should get the updated state after setState is called', async () => {
        const initialState = { test: 'initialTestValue' };
        const eventrixInstance = new Eventrix(initialState);

        const { getByTestId, rerender } = render(
            <TestContainer eventrix={eventrixInstance}>
                <TestComponent />
            </TestContainer>,
        );

        act(() => {
            getByTestId('setStateButton').click();
            rerender(
                <TestContainer eventrix={eventrixInstance}>
                    <TestComponent />
                </TestContainer>,
            );
        });
        await waitFor(() => expect(getByTestId('testValue').textContent).toEqual('newTestValue'));
    });
});
