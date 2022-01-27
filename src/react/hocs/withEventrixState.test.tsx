import React from 'react';
import { render } from '@testing-library/react';
import { EventrixProvider } from '../context';
import Eventrix from '../../Eventrix';
import withEventrixState from './withEventrixState';

describe('withEventrixState', () => {
    const ComponentTestFoo = ({ foo = '' }: { foo: string }) => {
        return (
            <div>
                <div data-testid="testFoo">{foo}</div>
            </div>
        );
    };

    interface FooStateI {
        foo: string;
    }
    const ComponentTestFooWS = withEventrixState<FooStateI>(ComponentTestFoo, ['foo']);

    const ComponentTestBarFoo = ({ barFoo = '' }: { barFoo: string }) => {
        return (
            <div>
                <div data-testid="testBarFoo">{barFoo}</div>
            </div>
        );
    };

    interface BarFooStateI {
        barFoo: string;
    }
    const ComponentTestBarFooWS = withEventrixState<BarFooStateI>(ComponentTestBarFoo, ['bar.foo'], (state) => ({
        barFoo: state['bar.foo'],
    }));

    const ComponentTestBarBarFoo = ({ barBarFoo = '' }: { barBarFoo: string }) => {
        return (
            <div>
                <div data-testid="testBarBarFoo">{barBarFoo}</div>
            </div>
        );
    };
    interface BarBarFooStateI {
        barBarFoo: string;
    }
    const ComponentTestBarBarFooWS = withEventrixState<BarBarFooStateI>(ComponentTestBarBarFoo, ['bar.bar.foo'], (state) => ({
        barBarFoo: state['bar.bar.foo'],
    }));

    const TestContainer = ({ eventrix, children }: any) => <EventrixProvider eventrix={eventrix}>{children}</EventrixProvider>;

    it('should change state when eventrix state has changed', () => {
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

        eventrixInstance.stateManager.setState('foo', 'newFoo');

        expect(getByTestId('testFoo').textContent).toEqual('newFoo');
        expect(getByTestId('testBarFoo').textContent).toEqual(initialState.bar.foo);
        expect(getByTestId('testBarBarFoo').textContent).toEqual(initialState.bar.bar.foo);

        eventrixInstance.stateManager.setState('bar.foo', 'newBarFoo');

        expect(getByTestId('testFoo').textContent).toEqual('newFoo');
        expect(getByTestId('testBarFoo').textContent).toEqual('newBarFoo');
        expect(getByTestId('testBarBarFoo').textContent).toEqual(initialState.bar.bar.foo);

        eventrixInstance.stateManager.setState('bar.bar.foo', 'newBarBarFoo');

        expect(getByTestId('testFoo').textContent).toEqual('newFoo');
        expect(getByTestId('testBarFoo').textContent).toEqual('newBarFoo');
        expect(getByTestId('testBarBarFoo').textContent).toEqual('newBarBarFoo');
    });
});
