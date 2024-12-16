import React from 'react';
import { useEmit } from 'eventrix';
import Input from './Input';
import UserPreview from './UserPreview';
import { USERS_CHANGE_PREVIEW_COLOR, USERS_CREATE } from '../userEvents';

const UserForm = () => {
    const emit = useEmit();
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        emit(USERS_CREATE);
    };

    return (
        <div className="formContainer">
            <div>
                <form onSubmit={onSubmit}>
                    <Input name="username" placeholder="username" />
                    <Input name="name" placeholder="name" />
                    <Input name="surname" placeholder="surname" />
                    <Input name="country" placeholder="country" />
                    <Input name="city" placeholder="city" />
                    <Input name="street" placeholder="street" />
                    <Input name="phone" placeholder="phone" />
                    <button type="submit">Create</button>
                </form>
                <button onClick={() => emit(USERS_CHANGE_PREVIEW_COLOR, { color: 'red' })}>Change preview color to red</button>
                <button onClick={() => emit(USERS_CHANGE_PREVIEW_COLOR, { color: 'black' })}>Change preview color to black</button>
            </div>
            <div>
                <UserPreview />
            </div>
        </div>
    );
};

export default UserForm;
