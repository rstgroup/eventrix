import { Eventrix } from 'eventrix';
import usersEventsReceiver from './users';

const initialState = {
    user: {},
    users: [],
};

const eventsReceivers = [usersEventsReceiver];

export default new Eventrix(initialState, eventsReceivers);
