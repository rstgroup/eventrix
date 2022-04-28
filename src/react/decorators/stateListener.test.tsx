import * as React from 'react';
import { act, render } from '@testing-library/react';
import EventrixProvider from '../context/EventrixProvider';
import Eventrix from '../../Eventrix';
import eventrixComponent from './eventrixComponent';
import stateListener from './stateListener';

interface PropsI {
    callback(state: any): void;
}

describe('stateListener', () => {
    @eventrixComponent
    class ItemComponent extends React.Component<PropsI> {
        @stateListener('foo.bar')
        testListen(state: any) {
            this.props.callback(state);
        }
        render() {
            return <div>Test Item Component</div>;
        }
    }
    const TestContainer = ({ eventrix, children }: any) => <EventrixProvider eventrix={eventrix}>{children}</EventrixProvider>;

    it('should invoke callback when state changed', () => {
        const eventrixInstance = new Eventrix({});
        const callbackMock = jest.fn();

        render(
            <TestContainer eventrix={eventrixInstance}>
                <ItemComponent callback={callbackMock} />
            </TestContainer>,
        );
        act(() => {
            eventrixInstance.stateManager.setState('foo.bar', 'test');
        });
        expect(callbackMock).toHaveBeenCalledWith('test');
    });
});
