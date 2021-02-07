import React, { useEffect } from 'react';
import { render } from '@testing-library/react';
import EventrixProvider from '../context/EventrixProvider';
import Eventrix from '../../Eventrix';
import useEmit from './useEmit';

describe('useEmit', () => {
    const ItemComponent = () => {
        const emit = useEmit();
        useEffect(() => {
            emit('testEvent', 'test');
        }, []);
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

    it('should emit event when component did mount', () => {
        const eventrixInstance = new Eventrix({});
        const mockListener = jest.fn();
        eventrixInstance.listen('testEvent', mockListener);

        render(
            <TestContainer eventrix={eventrixInstance}>
                <ItemComponent />
            </TestContainer>,
        );
        expect(mockListener).toHaveBeenCalledWith('test', []);
    });
});
