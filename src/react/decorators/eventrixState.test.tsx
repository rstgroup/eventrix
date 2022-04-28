import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import EventrixProvider from '../context/EventrixProvider';
import Eventrix from '../../Eventrix';
import eventrixComponent from './eventrixComponent';
import eventrixState from './eventrixState';

describe('eventrixState', () => {
    @eventrixComponent
    @eventrixState('foo.bar', 'fooBar')
    class ItemComponent extends React.Component<any> {
        render() {
            const { fooBar }: any = this.state;
            return (
                <div data-testid="stateData">
                    {fooBar === 'test' && <div data-testid="testData" />}
                    {fooBar}
                </div>
            );
        }
    }

    @eventrixComponent
    @eventrixState('foo.bar', 'fooBar')
    class ItemComponentWithState extends React.Component<any> {
        constructor(props: any, context: any) {
            super(props, context);
            this.state = {
                componentState: 'test',
            };
        }

        render() {
            const { fooBar, componentState }: any = this.state;
            return (
                <div data-testid="stateData">
                    {fooBar === 'test' && <div data-testid="testData" />}
                    {fooBar} {componentState}
                </div>
            );
        }
    }

    const TestContainer = ({ eventrix, children }: any) => <EventrixProvider eventrix={eventrix}>{children}</EventrixProvider>;

    it('should change component state when eventrix state changed', async () => {
        const eventrixInstance = new Eventrix({
            foo: {
                bar: 'empty',
            },
        });
        const callbackMock = jest.fn();

        const { getByTestId } = render(
            <TestContainer eventrix={eventrixInstance}>
                <ItemComponent callback={callbackMock} />
            </TestContainer>,
        );
        act(() => {
            eventrixInstance.stateManager.setState('foo.bar', 'test');
        });
        await waitFor(() => getByTestId('testData'));
        expect(getByTestId('stateData').textContent).toEqual('test');
    });

    it('should change component state when eventrix state changed and component has own state', async () => {
        const eventrixInstance = new Eventrix({
            foo: {
                bar: 'empty',
            },
        });
        const callbackMock = jest.fn();

        const { getByTestId } = render(
            <TestContainer eventrix={eventrixInstance}>
                <ItemComponentWithState callback={callbackMock} />
            </TestContainer>,
        );
        act(() => {
            eventrixInstance.stateManager.setState('foo.bar', 'test');
        });
        await waitFor(() => getByTestId('testData'));
        expect(getByTestId('stateData').textContent).toEqual('test test');
    });
});
