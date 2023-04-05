import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { EventrixProvider } from '../context';
import Eventrix from '../../Eventrix';
import useFetchState from './useFetchState';
import { fetchStateReceiver } from '../../EventsReceiver';
import { FetchStateStatus } from '../../interfaces';
import EventrixScope from '../context/EventrixScope';

describe('useFetchState', () => {
    interface FetchParamsI {
        search: string;
    }

    interface UserI {
        name: string;
        surname: string;
    }

    const UsersListComponent = () => {
        const [{ isLoading, data: users, isSuccess, isError, error, status }, emitFetch] = useFetchState<UserI[], FetchParamsI>('users');
        return (
            <div>
                <button
                    data-testid="fetchDataButton"
                    onClick={() => {
                        emitFetch({ search: 'Jan' });
                    }}
                >
                    Search Jan
                </button>
                <div data-testid="status">{status}</div>
                {isError && <div data-testid="error">{error?.message}</div>}
                {isSuccess && <div data-testid="success">Success loaded list</div>}
                {isLoading && <div data-testid="loading">Loading</div>}
                {users && users.length ? (
                    <div data-testid="usersList">
                        {users.map((user, index) => (
                            <div key={index}>
                                {user.name} {user.surname}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        );
    };
    const TestContainer = ({ eventrix, children }: any) => <EventrixProvider eventrix={eventrix}>{children}</EventrixProvider>;

    it('should start fetch users and set loading', () => {
        const mockedUsersList: UserI[] = [];
        const mockedFetchMetchod = jest.fn(() => Promise.resolve(mockedUsersList));
        const usersFetchReceiver = fetchStateReceiver<FetchParamsI, UserI[]>('users', mockedFetchMetchod);
        const eventrixInstance = new Eventrix({}, [usersFetchReceiver]);
        const { getByTestId } = render(
            <TestContainer eventrix={eventrixInstance}>
                <UsersListComponent />
            </TestContainer>,
        );
        expect(getByTestId('status').textContent).toEqual(FetchStateStatus.Initial);
        act(() => {
            fireEvent.click(getByTestId('fetchDataButton'));
        });
        expect(getByTestId('loading').textContent).toEqual('Loading');
        expect(getByTestId('status').textContent).toEqual(FetchStateStatus.Loading);
    });
    it('should fetch users and show fetch success message', async () => {
        const mockedUsersList: UserI[] = [
            { name: 'Jan', surname: 'Kowalski' },
            { name: 'Jan', surname: 'Nowak' },
        ];
        const mockedFetchMetchod = jest.fn(() => Promise.resolve(mockedUsersList));
        const usersFetchReceiver = fetchStateReceiver<FetchParamsI, UserI[]>('users', mockedFetchMetchod);
        const eventrixInstance = new Eventrix({}, [usersFetchReceiver]);
        const { getByTestId } = render(
            <TestContainer eventrix={eventrixInstance}>
                <UsersListComponent />
            </TestContainer>,
        );
        act(() => {
            fireEvent.click(getByTestId('fetchDataButton'));
        });
        await waitFor(() => getByTestId('success'));
        expect(mockedFetchMetchod).toHaveBeenCalledWith({ search: 'Jan' });
        expect(getByTestId('success').textContent).toEqual('Success loaded list');
        expect(getByTestId('status').textContent).toEqual(FetchStateStatus.Success);
    });
    it('should fetch users and show fetch error message', async () => {
        const fetchErrorMessage = 'fetch error';
        const mockedFetchMetchod = jest.fn(() => Promise.reject({ message: fetchErrorMessage }));
        const usersFetchReceiver = fetchStateReceiver<FetchParamsI, UserI[]>('users', mockedFetchMetchod);
        const eventrixInstance = new Eventrix({}, [usersFetchReceiver]);
        const { getByTestId } = render(
            <TestContainer eventrix={eventrixInstance}>
                <UsersListComponent />
            </TestContainer>,
        );
        act(() => {
            fireEvent.click(getByTestId('fetchDataButton'));
        });
        await waitFor(() => getByTestId('error'));
        expect(mockedFetchMetchod).toHaveBeenCalledWith({ search: 'Jan' });
        expect(getByTestId('error').textContent).toEqual(fetchErrorMessage);
        expect(getByTestId('status').textContent).toEqual(FetchStateStatus.Error);
    });

    it('should start fetch users and set loading with scope', () => {
        const mockedUsersList: UserI[] = [];
        const mockedFetchMetchod = jest.fn(() => Promise.resolve(mockedUsersList));
        const usersFetchReceiver = fetchStateReceiver<FetchParamsI, UserI[]>('selectData.users', mockedFetchMetchod);
        const eventrixInstance = new Eventrix({}, [usersFetchReceiver]);
        const { getByTestId } = render(
            <TestContainer eventrix={eventrixInstance}>
                <EventrixScope state="selectData">
                    <UsersListComponent />
                </EventrixScope>
            </TestContainer>,
        );
        expect(getByTestId('status').textContent).toEqual(FetchStateStatus.Initial);
        act(() => {
            fireEvent.click(getByTestId('fetchDataButton'));
        });
        expect(getByTestId('loading').textContent).toEqual('Loading');
        expect(getByTestId('status').textContent).toEqual(FetchStateStatus.Loading);
    });
});
