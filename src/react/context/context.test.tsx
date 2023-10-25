import React from 'react';
import { render } from '@testing-library/react';
import EventrixProvider from '../context/EventrixProvider';
import useEvent from '../hooks/useEvent';
import EventrixScope from '../context/EventrixScope';
import { defaultEventrixInstance } from './context';

describe('context with default eventrix instance', () => {
    const ItemComponent = ({ callback }: any) => {
        useEvent('testEvent', callback);
        return <div>Test Item Component</div>;
    };
    // @ts-ignore
    const TestContainer = ({ children }: any) => <EventrixProvider>{children}</EventrixProvider>;

    it('should invoke callback when event emitted', () => {
        const eventrixInstance = defaultEventrixInstance;
        const callbackMock = jest.fn();

        render(
            <TestContainer>
                <ItemComponent callback={callbackMock} />
            </TestContainer>,
        );
        eventrixInstance.emit('testEvent', 'test');
        expect(callbackMock).toHaveBeenCalledWith('test', []);
    });

    it('should invoke callback when event emitted with scope', () => {
        const eventrixInstance = defaultEventrixInstance;
        const callbackMock = jest.fn();

        render(
            <TestContainer>
                <EventrixScope event="Test">
                    <ItemComponent callback={callbackMock} />
                </EventrixScope>
            </TestContainer>,
        );
        eventrixInstance.emit('Test:testEvent', 'test');
        expect(callbackMock).toHaveBeenCalledWith('test', []);
    });

    it('should invoke callback when event emitted with deep scope', () => {
        const eventrixInstance = defaultEventrixInstance;
        const callbackMock = jest.fn();

        render(
            <TestContainer>
                <EventrixScope event="Test">
                    <EventrixScope event="List">
                        <ItemComponent callback={callbackMock} />
                    </EventrixScope>
                </EventrixScope>
            </TestContainer>,
        );
        eventrixInstance.emit('Test:List:testEvent', 'test');
        expect(callbackMock).toHaveBeenCalledWith('test', []);
    });
});
