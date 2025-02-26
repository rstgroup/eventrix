import React, { useState } from 'react';
import { useEventrixState, useEvent } from 'eventrix';
import { USERS_CHANGE_PREVIEW_COLOR } from '../userEvents';

const UserPreview = () => {
    const [color, setColor] = useState('black');
    const [user] = useEventrixState('user');

    useEvent(USERS_CHANGE_PREVIEW_COLOR, (data) => {
        setColor(data.color);
    });

    return (
        <div className="userPreview">
            <i>
                <b>&#34;user&#34;</b>
            </i>{' '}
            state in eventrix store:
            <pre style={{ color }}>{JSON.stringify(user, null, 2)}</pre>
        </div>
    );
};

export default UserPreview;
