import React, { useEffect } from 'react';
import { act, render } from '@testing-library/react';
import { EventrixProvider } from '../context';
import Eventrix from '../../Eventrix';
import useEmit from './useEmit';
import EventrixScope from '../context/EventrixScope';

describe('useEmit', () => {
    const ItemComponent = () => {
        const emit = useEmit();
        useEffect(() => {
            act(() => {
                emit('testEvent', 'test');
            });
        }, []);
        return <div>Test Item Component</div>;
    };
    const TestContainer = ({ eventrix, children }: any) => <EventrixProvider eventrix={eventrix}>{children}</EventrixProvider>;

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

    it('should emit event when component did mount with scope', () => {
        const eventrixInstance = new Eventrix({});
        const mockListener = jest.fn();
        eventrixInstance.listen('Test:testEvent', mockListener);

        render(
            <TestContainer eventrix={eventrixInstance}>
                <EventrixScope event="Test">
                    <ItemComponent />
                </EventrixScope>
            </TestContainer>,
        );
        expect(mockListener).toHaveBeenCalledWith('test', []);
    });

    it('should emit event when component did mount with deep scope', () => {
        const eventrixInstance = new Eventrix({});
        const mockListener = jest.fn();
        eventrixInstance.listen('Test:List:testEvent', mockListener);

        render(
            <TestContainer eventrix={eventrixInstance}>
                <EventrixScope event="Test">
                    <EventrixScope event="List">
                        <ItemComponent />
                    </EventrixScope>
                </EventrixScope>
            </TestContainer>,
        );
        expect(mockListener).toHaveBeenCalledWith('test', []);
    });
});
