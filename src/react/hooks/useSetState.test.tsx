import React, { PropsWithChildren } from 'react';
import { act, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EventrixProvider } from '../context';
import Eventrix from '../../Eventrix';
import useSetState from './useSetState';
import EventrixScope from '../context/EventrixScope';

describe('useSetState', () => {
    const TestComponent = ({ stateName }: { stateName: string }) => {
        const setState = useSetState(stateName);

        const handleClick = () => {
            setState('newState');
        };

        return (
            <button data-testid="setStateButton" onClick={handleClick}>
                Set State
            </button>
        );
    };

    const TestContainer = ({
        eventrix,
        children,
    }: PropsWithChildren<{
        eventrix: Eventrix;
    }>) => <EventrixProvider eventrix={eventrix}>{children}</EventrixProvider>;

    it('should set the state', async () => {
        const initialState = { test: 'initialState' };
        const eventrixInstance = new Eventrix(initialState);

        const { getByTestId } = render(
            <TestContainer eventrix={eventrixInstance}>
                <TestComponent stateName="test" />
            </TestContainer>,
        );

        act(() => {
            getByTestId('setStateButton').click();
        });

        await waitFor(() => expect(eventrixInstance.getState('test')).toEqual('newState'));
    });

    it('should set the state with scope', async () => {
        const initialState = {
            testScope: {
                test: 'initialScopedState',
            },
        };
        const eventrixInstance = new Eventrix(initialState);

        const { getByTestId } = render(
            <TestContainer eventrix={eventrixInstance}>
                <EventrixScope state="testScope">
                    <TestComponent stateName="test" />
                </EventrixScope>
            </TestContainer>,
        );

        act(() => {
            getByTestId('setStateButton').click();
        });

        await waitFor(() => expect(eventrixInstance.getState('testScope.test')).toEqual('newState'));
    });
});
