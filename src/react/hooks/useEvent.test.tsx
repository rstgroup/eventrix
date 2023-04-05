import React from 'react';
import { render } from '@testing-library/react';
import EventrixProvider from '../context/EventrixProvider';
import Eventrix from '../../Eventrix';
import useEvent from './useEvent';
import EventrixScope from '../context/EventrixScope';

describe('useEvent', () => {
    const ItemComponent = ({ callback }: any) => {
        useEvent('testEvent', callback);
        return <div>Test Item Component</div>;
    };
    const TestContainer = ({ eventrix, children }: any) => <EventrixProvider eventrix={eventrix}>{children}</EventrixProvider>;

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

    it('should invoke callback when event emitted with scope', () => {
        const eventrixInstance = new Eventrix({});
        const callbackMock = jest.fn();

        render(
            <TestContainer eventrix={eventrixInstance}>
                <EventrixScope event="Test">
                    <ItemComponent callback={callbackMock} />
                </EventrixScope>
            </TestContainer>,
        );
        eventrixInstance.emit('Test:testEvent', 'test');
        expect(callbackMock).toHaveBeenCalledWith('test', []);
    });

    it('should invoke callback when event emitted with deep scope', () => {
        const eventrixInstance = new Eventrix({});
        const callbackMock = jest.fn();

        render(
            <TestContainer eventrix={eventrixInstance}>
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
