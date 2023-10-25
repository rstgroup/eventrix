import React, { useContext } from 'react';
import { render } from '@testing-library/react';
import EventrixScope from './EventrixScope';
import Eventrix from '../../Eventrix';
import { EventrixI } from '../../interfaces';
import EventrixContext from './context';
import { EventrixProvider } from './index';

describe('EventrixScope', () => {
    const TestComponent = () => {
        const { eventrix } = useContext(EventrixContext);
        return (
            <div data-testid="testComponent">
                <div data-testid="stateScope">{eventrix.stateScope}</div>
                <div data-testid="eventScope">{eventrix.eventScope}</div>
            </div>
        );
    };
    let eventrix: EventrixI;
    beforeEach(() => {
        eventrix = new Eventrix();
    });

    it('should render component with event scope', () => {
        const { getByTestId } = render(
            <EventrixProvider eventrix={eventrix}>
                <EventrixScope event="Users">
                    <TestComponent />
                </EventrixScope>
            </EventrixProvider>,
        );
        expect(getByTestId('eventScope').textContent).toEqual('Users');
    });

    it('should render component with state scope', () => {
        const { getByTestId } = render(
            <EventrixProvider eventrix={eventrix}>
                <EventrixScope state="users">
                    <TestComponent />
                </EventrixScope>
            </EventrixProvider>,
        );
        expect(getByTestId('stateScope').textContent).toEqual('users');
    });

    it('should render component with state and event scope', () => {
        const { getByTestId } = render(
            <EventrixProvider eventrix={eventrix}>
                <EventrixScope state="users" event="Users">
                    <TestComponent />
                </EventrixScope>
            </EventrixProvider>,
        );
        expect(getByTestId('stateScope').textContent).toEqual('users');
        expect(getByTestId('eventScope').textContent).toEqual('Users');
    });

    it('should render component with deep state and event scope', () => {
        const { getByTestId } = render(
            <EventrixProvider eventrix={eventrix}>
                <EventrixScope state="users" event="Users">
                    <EventrixScope state={'list'} event="List">
                        <TestComponent />
                    </EventrixScope>
                </EventrixScope>
            </EventrixProvider>,
        );
        expect(getByTestId('stateScope').textContent).toEqual('users.list');
        expect(getByTestId('eventScope').textContent).toEqual('Users:List');
    });
});
