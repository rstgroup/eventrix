import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EventrixProvider } from '../context';
import Eventrix from '../../Eventrix';
import useEvent from './useEvent';
import useEventrixState from './useEventrixState';
import EventrixScope from '../context/EventrixScope';

describe('useEventrixState', () => {
    const OtherStateComponent = () => {
        const [test, setTest] = useEventrixState<string>('test');
        useEvent('changeTest', (newState) => setTest(newState));
        return <div data-testid="testData">{!!test && <div data-testid="testDataValue">{test}</div>}</div>;
    };

    const FooInFooComponent = () => {
        const [foo = {}] = useEventrixState<any>('foo');
        return (
            <div data-testid="fooDescription">{!!foo.description && <div data-testid="fooDescriptionValue">{foo.description}</div>}</div>
        );
    };

    const FooBarComponent = () => {
        const [fooBar] = useEventrixState<string>('foo.bar');
        return <div data-testid="fooBarData">{!!fooBar && <div data-testid="fooBarDataValue">{fooBar}</div>}</div>;
    };

    const FooComponent = () => {
        const [foo = {}, setFoo] = useEventrixState<any>('foo');
        useEvent('changeFoo', (newState) => setFoo(newState));
        return (
            <div>
                <div data-testid="fooTitle">{!!foo.title && <div data-testid="fooTitleValue">{foo.title}</div>}</div>
                <FooInFooComponent />
                <FooBarComponent />
                <OtherStateComponent />
            </div>
        );
    };

    const TestContainer = ({ eventrix, children }: any) => <EventrixProvider eventrix={eventrix}>{children}</EventrixProvider>;

    it('should change state when eventrix state has changed', async () => {
        const initialState = {
            foo: {
                title: 'fooTitle1',
                description: 'fooDescription1',
                bar: 'fooBar1',
            },
            test: 'test1',
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
        act(() => {
            eventrixInstance.emit('changeTest', secondTestData);
        });
        await waitFor(() => getByTestId('testDataValue'));

        expect(getByTestId('fooTitle').textContent).toEqual(initialState.foo.title);
        expect(getByTestId('fooDescription').textContent).toEqual(initialState.foo.description);
        expect(getByTestId('fooBarData').textContent).toEqual(initialState.foo.bar);
        expect(getByTestId('testData').textContent).toEqual(secondTestData);
        act(() => {
            eventrixInstance.emit('changeFoo', secondFooData);
        });
        await waitFor(() => getByTestId('fooTitleValue'));
        await waitFor(() => getByTestId('fooDescriptionValue'));
        await waitFor(() => getByTestId('fooBarDataValue'));

        expect(getByTestId('fooTitle').textContent).toEqual(secondFooData.title);
        expect(getByTestId('fooDescription').textContent).toEqual(secondFooData.description);
        expect(getByTestId('fooBarData').textContent).toEqual(secondFooData.bar);
        expect(getByTestId('testData').textContent).toEqual(secondTestData);
    });

    it('should change state when eventrix state has changed with scope', async () => {
        const initialState = {
            testScope: {
                foo: {
                    title: 'fooTitle1',
                    description: 'fooDescription1',
                    bar: 'fooBar1',
                },
                test: 'test1',
            },
        };
        const initialData = initialState.testScope;
        const eventrixInstance = new Eventrix(initialState);
        const secondFooData = {
            title: 'secondTitle',
            description: 'secondDescription',
            bar: 'initialBar',
        };
        const secondTestData = 'secondTest';

        const { getByTestId } = render(
            <TestContainer eventrix={eventrixInstance}>
                <EventrixScope state="testScope">
                    <FooComponent />
                </EventrixScope>
            </TestContainer>,
        );
        expect(getByTestId('fooTitle').textContent).toEqual(initialData.foo.title);
        expect(getByTestId('fooDescription').textContent).toEqual(initialData.foo.description);
        expect(getByTestId('fooBarData').textContent).toEqual(initialData.foo.bar);
        expect(getByTestId('testData').textContent).toEqual(initialData.test);
        act(() => {
            eventrixInstance.emit('changeTest', secondTestData);
        });
        await waitFor(() => getByTestId('testDataValue'));

        expect(getByTestId('fooTitle').textContent).toEqual(initialData.foo.title);
        expect(getByTestId('fooDescription').textContent).toEqual(initialData.foo.description);
        expect(getByTestId('fooBarData').textContent).toEqual(initialData.foo.bar);
        expect(getByTestId('testData').textContent).toEqual(secondTestData);
        act(() => {
            eventrixInstance.emit('changeFoo', secondFooData);
        });
        await waitFor(() => getByTestId('fooTitleValue'));
        await waitFor(() => getByTestId('fooDescriptionValue'));
        await waitFor(() => getByTestId('fooBarDataValue'));

        expect(getByTestId('fooTitle').textContent).toEqual(secondFooData.title);
        expect(getByTestId('fooDescription').textContent).toEqual(secondFooData.description);
        expect(getByTestId('fooBarData').textContent).toEqual(secondFooData.bar);
        expect(getByTestId('testData').textContent).toEqual(secondTestData);
    });

    it('should change state when eventrix state has changed with deep scope', async () => {
        const initialState = {
            scopeLvl1: {
                testScope: {
                    foo: {
                        title: 'fooTitle1',
                        description: 'fooDescription1',
                        bar: 'fooBar1',
                    },
                    test: 'test1',
                },
            },
        };
        const initialData = initialState.scopeLvl1.testScope;
        const eventrixInstance = new Eventrix(initialState);
        const secondFooData = {
            title: 'secondTitle',
            description: 'secondDescription',
            bar: 'initialBar',
        };
        const secondTestData = 'secondTest';

        const { getByTestId } = render(
            <TestContainer eventrix={eventrixInstance}>
                <EventrixScope state="scopeLvl1">
                    <EventrixScope state="testScope">
                        <FooComponent />
                    </EventrixScope>
                </EventrixScope>
            </TestContainer>,
        );
        expect(getByTestId('fooTitle').textContent).toEqual(initialData.foo.title);
        expect(getByTestId('fooDescription').textContent).toEqual(initialData.foo.description);
        expect(getByTestId('fooBarData').textContent).toEqual(initialData.foo.bar);
        expect(getByTestId('testData').textContent).toEqual(initialData.test);
        act(() => {
            eventrixInstance.emit('changeTest', secondTestData);
        });
        await waitFor(() => getByTestId('testDataValue'));

        expect(getByTestId('fooTitle').textContent).toEqual(initialData.foo.title);
        expect(getByTestId('fooDescription').textContent).toEqual(initialData.foo.description);
        expect(getByTestId('fooBarData').textContent).toEqual(initialData.foo.bar);
        expect(getByTestId('testData').textContent).toEqual(secondTestData);
        act(() => {
            eventrixInstance.emit('changeFoo', secondFooData);
        });
        await waitFor(() => getByTestId('fooTitleValue'));
        await waitFor(() => getByTestId('fooDescriptionValue'));
        await waitFor(() => getByTestId('fooBarDataValue'));

        expect(getByTestId('fooTitle').textContent).toEqual(secondFooData.title);
        expect(getByTestId('fooDescription').textContent).toEqual(secondFooData.description);
        expect(getByTestId('fooBarData').textContent).toEqual(secondFooData.bar);
        expect(getByTestId('testData').textContent).toEqual(secondTestData);
    });
});
