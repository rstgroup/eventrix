import React from 'react';
import { render } from '@testing-library/react';
import EventrixProvider from '../context/EventrixProvider';
import Eventrix from '../../Eventrix';
import useEventrixEvent from './useEventrixEvent';

describe('useEventrixEvent', () => {
    const ItemComponent = ({ callback }) => {
        useEventrixEvent('testEvent', callback);
        return (
            <div>
                Test Item Component
            </div>
        );
    };
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
});
