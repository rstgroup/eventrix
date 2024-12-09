import React from 'react';
import UsersList from './List/List';
import UserForm from './Form/Form';

const UsersModule = () => {
    return (
        <div className="usersModuleWrapper">
            <UserForm />
            <UsersList />
        </div>
    );
};

export default UsersModule;
