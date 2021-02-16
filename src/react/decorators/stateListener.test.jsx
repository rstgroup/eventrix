import React from 'react';
import { render } from '@testing-library/react';
import EventrixProvider from '../context/EventrixProvider';
import Eventrix from '../../Eventrix';
import useEventrix from './useEventrix';
import stateListener from './stateListener';

describe('stateListener', () => {
    @useEventrix
    class ItemComponent extends React.Component {
        @stateListener('foo.bar')
        testListen(state) {
            this.props.callback(state);
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

    it('should invoke callback when state changed', () => {
        const eventrixInstance = new Eventrix({});
        const callbackMock = jest.fn();

        render(
            <TestContainer eventrix={eventrixInstance}>
                <ItemComponent callback={callbackMock} />
            </TestContainer>,
        );
        eventrixInstance.stateManager.setState('foo.bar', 'test');
        expect(callbackMock).toHaveBeenCalledWith('test');
    });
});
