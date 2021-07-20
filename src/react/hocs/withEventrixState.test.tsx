import React from 'react';
import { render } from '@testing-library/react';
import { EventrixProvider } from '../context';
import Eventrix from '../../Eventrix';
import withEventrixState from "./withEventrixState";

interface PropsI {
    title: string;
}

interface StateI {
    test: string;
}

interface OtherPropsI {
    title: string;
    test: string;
}

describe('withEventrixState', () => {
    const OtherStateComponent = ({ test, title }: OtherPropsI) => {
        return (
            <div>
                <div data-testid="testData">{test}</div>
            </div>
        );
    };
    const OtherStateComponentWithState = withEventrixState<PropsI, StateI>(OtherStateComponent, ['test']);

    const FooInFooComponent = ({ foo = {} }: any) => {
        return (
            <div>
                <div data-testid="fooDescription">{foo.description}</div>
            </div>
        );
    };
    const FooInFooComponentWithState = withEventrixState(FooInFooComponent, ['foo']);

    const FooBarComponent = ({ fooBar }: any) => {
        return (
            <div data-testid="fooBarData">
                {fooBar}
            </div>
        );
    };
    const FooBarComponentWithState = withEventrixState(FooBarComponent, ['foo.bar'], state => ({ fooBar: state['foo.bar'] }));

    const FooComponent = ({ foo = {} }: any) => {
        return (
            <div>
                <div data-testid="fooTitle">{foo.title}</div>
                <FooInFooComponentWithState />
                <FooBarComponentWithState />
                <OtherStateComponentWithState title={"blabla"} />
            </div>
        );
    };
    const FooComponentWithState = withEventrixState(FooComponent, ['foo']);

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
                <FooComponentWithState />
            </TestContainer>,
        );
        expect(getByTestId('fooTitle').textContent).toEqual(initialState.foo.title);
        expect(getByTestId('fooDescription').textContent).toEqual(initialState.foo.description);
        expect(getByTestId('fooBarData').textContent).toEqual(initialState.foo.bar);
        expect(getByTestId('testData').textContent).toEqual(initialState.test);

        eventrixInstance.emit('setState', { stateName: 'test', value: secondTestData });

        expect(getByTestId('fooTitle').textContent).toEqual(initialState.foo.title);
        expect(getByTestId('fooDescription').textContent).toEqual(initialState.foo.description);
        expect(getByTestId('fooBarData').textContent).toEqual(initialState.foo.bar);
        expect(getByTestId('testData').textContent).toEqual(secondTestData);

        eventrixInstance.emit('setState', { stateName: 'foo', value: secondFooData });

        expect(getByTestId('fooTitle').textContent).toEqual(secondFooData.title);
        expect(getByTestId('fooDescription').textContent).toEqual(secondFooData.description);
        expect(getByTestId('fooBarData').textContent).toEqual(secondFooData.bar);
        expect(getByTestId('testData').textContent).toEqual(secondTestData);
    });
});
