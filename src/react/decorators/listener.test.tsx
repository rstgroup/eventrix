import * as React from 'react';
import { render } from '@testing-library/react';
import EventrixProvider from '../context/EventrixProvider';
import Eventrix from '../../Eventrix';
import useEventrix from './useEventrix';
import listener from './listener';

interface PropsI {
    callback?(a?: any,b?: any): void;
    didMountCallback?(a?: any,b?: any): void;
    willUnmountCallback?(a?: any,b?: any): void;
}

describe('listener', () => {
    @useEventrix
    class ItemComponent extends React.Component<PropsI> {
        @listener('testEvent')
        testListen(...args) {
            this.props.callback(...args);
        }

        render() {
            return (
                <div>
                    Test Item Component
                </div>
            );
        }
    }

    @useEventrix
    class ItemComponentDidMount extends React.Component<PropsI> {
        componentDidMount() {
            this.props.didMountCallback();
        }

        @listener('testEvent')
        testListen(...args) {
            this.props.callback(...args);
        }

        render() {
            return (
                <div>
                    Test Item Component
                </div>
            );
        }
    }

    @useEventrix
    class ItemComponentWillUnmount extends React.Component<PropsI> {
        componentWillUnmount() {
            this.props.willUnmountCallback();
        }

        @listener('testEvent')
        testListen(...args) {
            this.props.callback(...args);
        }

        render() {
            return (
                <div>
                    Test Item Component
                </div>
            );
        }
    }

    const TestContainer = ({ eventrix, children }) => (
        <EventrixProvider eventrix={eventrix}>
            {children}
        </EventrixProvider>
    );

    it('should invoke callback when event emitted', () => {
        const eventrixInstance = new Eventrix({});
        const callbackMock = jest.fn();

        render(
            <TestContainer eventrix={eventrixInstance}>
                <ItemComponent callback={callbackMock} />
            </TestContainer>,
        );
        eventrixInstance.emit('testEvent', 'test');
        expect(callbackMock).toHaveBeenCalledWith('test', []);
    });

    it('should invoke callback when event emitted and extend componentDidMount method', () => {
        const eventrixInstance = new Eventrix({});
        const callbackMock = jest.fn();
        const didMountCallbackMock = jest.fn();

        render(
            <TestContainer eventrix={eventrixInstance}>
                <ItemComponentDidMount
                    callback={callbackMock}
                    didMountCallback={didMountCallbackMock}
                />
            </TestContainer>,
        );
        eventrixInstance.emit('testEvent', 'test');
        expect(didMountCallbackMock).toHaveBeenCalled();
        expect(callbackMock).toHaveBeenCalledWith('test', []);
    });

    it('should invoke callback when event emitted and extend componentDidMount method', () => {
        const eventrixInstance = new Eventrix({});
        const callbackMock = jest.fn();
        const willUnmountCallbackMock = jest.fn();

        const { unmount } = render(
            <TestContainer eventrix={eventrixInstance}>
                <ItemComponentWillUnmount
                    callback={callbackMock}
                    willUnmountCallback={willUnmountCallbackMock}
                />
            </TestContainer>,
        );
        eventrixInstance.emit('testEvent', 'test');
        expect(callbackMock).toHaveBeenCalledWith('test', []);
        unmount();
        expect(willUnmountCallbackMock).toHaveBeenCalled();
    });
});
