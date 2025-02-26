import { Eventrix } from 'eventrix';
import taskEventsReceivers from './tasks';

const initialState = {
    tasks: [],
};

export default new Eventrix(initialState, taskEventsReceivers);
