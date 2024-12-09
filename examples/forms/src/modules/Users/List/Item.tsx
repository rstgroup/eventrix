import React from 'react';

interface UsersItemProps {
    id: number;
    username: string;
    name: string;
    surname: string;
    country: string;
    city: string;
    street: string;
    phone: string;
}

const UsersItem: React.FC<UsersItemProps> = ({ username, name, surname, country, city, street, phone }) => {
    return (
        <div className="usersItem">
            <div className="userItemColl">{username}</div>
            <div className="userItemColl">{name}</div>
            <div className="userItemColl">{surname}</div>
            <div className="userItemColl">{country}</div>
            <div className="userItemColl">{city}</div>
            <div className="userItemColl">{street}</div>
            <div className="userItemColl">{phone}</div>
        </div>
    );
};

export default UsersItem;
