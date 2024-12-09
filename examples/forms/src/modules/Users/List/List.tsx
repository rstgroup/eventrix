import React from 'react';
import { useEventrixState } from 'eventrix';
import UserItem from './Item';

const UsersList = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [users] = useEventrixState<any[]>('users');
    return (
        <div className="usersList">
            <div className="usersListHeader">
                <div className="usersListHeaderColl">username</div>
                <div className="usersListHeaderColl">name</div>
                <div className="usersListHeaderColl">surname</div>
                <div className="usersListHeaderColl">country</div>
                <div className="usersListHeaderColl">city</div>
                <div className="usersListHeaderColl">street</div>
                <div className="usersListHeaderColl">phone</div>
            </div>
            {users.length === 0 && <div className="usersListPlaceholder">Users list is empty</div>}
            {users.map((user) => (
                <UserItem key={user.id} {...user} />
            ))}
        </div>
    );
};

export default UsersList;
