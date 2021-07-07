import React from 'react';
import { render } from '@testing-library/react';
import { EventrixProvider } from '../context';
import Eventrix from '../../Eventrix';
import useEvent from './useEvent';
import useEventrixState from './useEventrixState';

describe('useEventrixState', () => {
    const OtherStateComponent = () => {
        const [test, setTest] = useEventrixState<string>('test');
        useEvent('changeTest', newState => setTest(newState));
        return (
            <div>
                <div data-testid="testData">{test}</div>
            </div>
        );
    };

    const FooInFooComponent = () => {
        const [foo = {}] = useEventrixState<any>('foo');
        return (
            <div>
                <div data-testid="fooDescription">{foo.description}</div>
            </div>
        );
    };

    const FooBarComponent = () => {
        const [fooBar] = useEventrixState<string>('foo.bar');
        return (
            <div data-testid="fooBarData">
                {fooBar}
            </div>
        );
    };

    const FooComponent = () => {
        const [foo = {}, setFoo] = useEventrixState<any>('foo');
        useEvent('changeFoo', newState => setFoo(newState));
        return (
            <div>
                <div data-testid="fooTitle">{foo.title}</div>
                <FooInFooComponent />
                <FooBarComponent />
                <OtherStateComponent />
            </div>
        );
    };

    const TestContainer = ({ eventrix, children }: any) => (
        <EventrixProvider eventrix={eventrix}>
            {children}
        </EventrixProvider>
    );

    it('should change state when eventrix state has changed', () => {
        const initialState = {
            foo: {
                title: 'initialTitle',
                description: 'initialDescription',
                bar: 'initialBar',
            },
            test: 'initialTest',
        };
        const eventrixInstance = new Eventrix(initialState);
        const secondFooData = {
            title: 'secondTitle',
            description: 'secondDescription',
            bar: 'initialBar',
        };
        const secondTestData = 'secondTest';

        const { getByTestId } = render(
            <TestContainer eventrix={eventrixInstance}>
                <FooComponent />
            </TestContainer>,
        );
        expect(getByTestId('fooTitle').textContent).toEqual(initialState.foo.title);
        expect(getByTestId('fooDescription').textContent).toEqual(initialState.foo.description);
        expect(getByTestId('fooBarData').textContent).toEqual(initialState.foo.bar);
        expect(getByTestId('testData').textContent).toEqual(initialState.test);

        eventrixInstance.emit('changeTest', secondTestData);

        expect(getByTestId('fooTitle').textContent).toEqual(initialState.foo.title);
        expect(getByTestId('fooDescription').textContent).toEqual(initialState.foo.description);
        expect(getByTestId('fooBarData').textContent).toEqual(initialState.foo.bar);
        expect(getByTestId('testData').textContent).toEqual(secondTestData);

        eventrixInstance.emit('changeFoo', secondFooData);

        expect(getByTestId('fooTitle').textContent).toEqual(secondFooData.title);
        expect(getByTestId('fooDescription').textContent).toEqual(secondFooData.description);
        expect(getByTestId('fooBarData').textContent).toEqual(secondFooData.bar);
        expect(getByTestId('testData').textContent).toEqual(secondTestData);
    });
});
