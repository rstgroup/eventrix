import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { EventrixProvider, EventrixScope } from '../context';
import Eventrix from '../../Eventrix';
import withEventrixState from './withEventrixState';

describe('withEventrixState', () => {
    const ComponentTestFoo = ({ foo = '' }: { foo: string }) => {
        return <div data-testid="testFoo">{!!foo && <div data-testid="testFooValue">{foo}</div>}</div>;
    };

    interface FooStateI {
        foo: string;
    }
    const ComponentTestFooWS = withEventrixState<FooStateI>(ComponentTestFoo, ['foo']);

    const ComponentTestBarFoo = ({ barFoo = '' }: { barFoo: string }) => {
        return <div data-testid="testBarFoo">{!!barFoo && <div data-testid="testBarFooValue">{barFoo}</div>}</div>;
    };

    interface BarFooStateI {
        barFoo: string;
    }
    const ComponentTestBarFooWS = withEventrixState<BarFooStateI>(ComponentTestBarFoo, ['bar.foo'], (state) => ({
        barFoo: state['bar.foo'],
    }));

    const ComponentTestBarBarFoo = ({ barBarFoo = '' }: { barBarFoo: string }) => {
        return <div data-testid="testBarBarFoo">{!!barBarFoo && <div data-testid="testBarBarFooValue">{barBarFoo}</div>}</div>;
    };
    interface BarBarFooStateI {
        barBarFoo: string;
    }
    const ComponentTestBarBarFooWS = withEventrixState<BarBarFooStateI>(ComponentTestBarBarFoo, ['bar.bar.foo'], (state) => ({
        barBarFoo: state['bar.bar.foo'],
    }));

    const TestContainer = ({ eventrix, children }: any) => <EventrixProvider eventrix={eventrix}>{children}</EventrixProvider>;

    it('should change state when eventrix state has changed', async () => {
        const initialState = {
            foo: '',
            bar: {
                foo: '',
                bar: {
                    foo: '',
                },
            },
        };
        const eventrixInstance = new Eventrix(initialState);
        const { getByTestId } = render(
            <TestContainer eventrix={eventrixInstance}>
                <ComponentTestFooWS />
                <ComponentTestBarFooWS />
                <ComponentTestBarBarFooWS />
            </TestContainer>,
        );

        expect(getByTestId('testFoo').textContent).toEqual(initialState.foo);
        expect(getByTestId('testBarFoo').textContent).toEqual(initialState.bar.foo);
        expect(getByTestId('testBarBarFoo').textContent).toEqual(initialState.bar.bar.foo);

        act(() => {
            eventrixInstance.stateManager.setState('foo', 'newFoo');
        });
        await waitFor(() => getByTestId('testFooValue'));

        expect(getByTestId('testFoo').textContent).toEqual('newFoo');
        expect(getByTestId('testBarFoo').textContent).toEqual(initialState.bar.foo);
        expect(getByTestId('testBarBarFoo').textContent).toEqual(initialState.bar.bar.foo);
        act(() => {
            eventrixInstance.stateManager.setState('bar.foo', 'newBarFoo');
        });
        await waitFor(() => getByTestId('testBarFooValue'));

        expect(getByTestId('testFoo').textContent).toEqual('newFoo');
        expect(getByTestId('testBarFoo').textContent).toEqual('newBarFoo');
        expect(getByTestId('testBarBarFoo').textContent).toEqual(initialState.bar.bar.foo);
        act(() => {
            eventrixInstance.stateManager.setState('bar.bar.foo', 'newBarBarFoo');
        });
        await waitFor(() => getByTestId('testBarBarFooValue'));

        expect(getByTestId('testFoo').textContent).toEqual('newFoo');
        expect(getByTestId('testBarFoo').textContent).toEqual('newBarFoo');
        expect(getByTestId('testBarBarFoo').textContent).toEqual('newBarBarFoo');
    });

    it('should change state when eventrix state has changed with scope', async () => {
        const initialState = {
            scope1: {
                foo: 'foo1',
                bar: {
                    foo: 'barFoo1',
                    bar: {
                        foo: 'barBarFoo1',
                    },
                },
            },
        };
        const data = initialState.scope1;
        const eventrixInstance = new Eventrix(initialState);
        const { getByTestId } = render(
            <TestContainer eventrix={eventrixInstance}>
                <EventrixScope state="scope1">
                    <ComponentTestFooWS />
                    <ComponentTestBarFooWS />
                    <ComponentTestBarBarFooWS />
                </EventrixScope>
            </TestContainer>,
        );

        expect(getByTestId('testFoo').textContent).toEqual(data.foo);
        expect(getByTestId('testBarFoo').textContent).toEqual(data.bar.foo);
        expect(getByTestId('testBarBarFoo').textContent).toEqual(data.bar.bar.foo);

        act(() => {
            eventrixInstance.stateManager.setState('scope1.foo', 'newFoo');
        });
        await waitFor(() => getByTestId('testFooValue'));

        expect(getByTestId('testFoo').textContent).toEqual('newFoo');
        expect(getByTestId('testBarFoo').textContent).toEqual(data.bar.foo);
        expect(getByTestId('testBarBarFoo').textContent).toEqual(data.bar.bar.foo);
        act(() => {
            eventrixInstance.stateManager.setState('scope1.bar.foo', 'newBarFoo');
        });
        await waitFor(() => getByTestId('testBarFooValue'));

        expect(getByTestId('testFoo').textContent).toEqual('newFoo');
        expect(getByTestId('testBarFoo').textContent).toEqual('newBarFoo');
        expect(getByTestId('testBarBarFoo').textContent).toEqual(data.bar.bar.foo);
        act(() => {
            eventrixInstance.stateManager.setState('scope1.bar.bar.foo', 'newBarBarFoo');
        });
        await waitFor(() => getByTestId('testBarBarFooValue'));

        expect(getByTestId('testFoo').textContent).toEqual('newFoo');
        expect(getByTestId('testBarFoo').textContent).toEqual('newBarFoo');
        expect(getByTestId('testBarBarFoo').textContent).toEqual('newBarBarFoo');
    });
});
