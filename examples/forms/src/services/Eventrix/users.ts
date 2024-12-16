import { EventsReceiver } from 'eventrix';
import { USERS_CREATE } from '../../modules/Users/userEvents';

const usersEventsReceiver = new EventsReceiver(USERS_CREATE, (eventName, eventData, storeManager) => {
    const user = storeManager.getState('user');
    const users = storeManager.getState('users');
    storeManager.setState('users', [user, ...users]);
    storeManager.setState('user', {});
});

export default usersEventsReceiver;
