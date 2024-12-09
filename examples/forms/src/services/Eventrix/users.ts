import { EventsReceiver } from 'eventrix';

const CREATE_USER_EVENT_NAME = 'users:createUser';

const usersEventsReceiver = new EventsReceiver(CREATE_USER_EVENT_NAME, (eventName, eventData, storeManager) => {
    const user = storeManager.getState('user');
    const users = storeManager.getState('users');
    storeManager.setState('users', [user, ...users]);
    storeManager.setState('user', {});
});

export default usersEventsReceiver;
