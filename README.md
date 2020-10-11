# EVENTRIX v1
[![Build Status](https://travis-ci.org/mprzodala/eventrix.svg?branch=master)](https://travis-ci.org/mprzodala/eventrix)
[![Coverage Status](https://coveralls.io/repos/github/mprzodala/eventrix/badge.svg?branch=master)](https://coveralls.io/github/mprzodala/eventrix?branch=master)
[![npm](https://img.shields.io/npm/l/eventrix.svg)](https://npmjs.org/package/eventrix)
[![npm](https://img.shields.io/npm/v/eventrix.svg)](https://npmjs.org/package/eventrix)

1. [Features](#features)
1. [Installation](#installation)
1. [React HOCs](#react-hocs)
1. [React HOOKS](#react-hooks)
1. [How to use](#how-to-use)
1. [Contribute](#contribute)
1. [License](#license)

### Features

- StateManager
    - listen on set new state
    - emit events after change state
- EventsEmitter
    - listen on events
    - emit events
- EventsReceiver
    - parse data from events to store

### React HOCs

- withEventrix
    - pass eventrix to props
    
```jsx
import React from 'react';
import { withEventrix } from 'eventrix';

class UsersList extends React.Component {
    render() {
        const { eventrix } = this.props;
        const users = eventrix.getState('users');
        return (
            <div>
                {users.map(user => <div>{user.name}</div>)}
            </div>
        );
    }
}

export default withEventrix(UsersList);
```

- withEventrixState
    - rerender component on state manager state change

```jsx
import React from 'react';
import { withEventrixState } from 'eventrix';

class UsersList extends React.Component {
    render() {
        const { users } = this.props;
        return (
            <div>
                {users.map(user => <div>{user.name}</div>)}
            </div>
        );
    }
}

export default withEventrixState(UsersList, ['users']);
```
    
### React HOOKS

- useEventrixState
    - return eventrix state form state and setState method

```jsx
import React from 'react';
import { useEventrixState } from 'eventrix';

const UsersList = () => {
    const [users, setUsers] = useEventrixState('users');
    return (
        <div>
            {users.map(user => <div>{user.name}</div>)}
        </div>
    );
}
```

- useEventrixEmit
    - return eventrix emit method

```jsx
import React from 'react';
import { useEventrixEmit } from 'eventrix';

const RemoveUserButton = ({ user }) => {
    const emit = useEventrixEmit();
    return (
        <button onClick={() => emit('removeUser', user)}>
            Remove user
        </button>
    );
}
```

- useEventrixEvent
    - rerender component on emit event and return event data

```jsx
import React from 'react';
import { useEventrixEvent, useEventrixEmit } from 'eventrix';

const UndoDeleteUserButton = () => {
    const [eventData, setEventData] = useEventrixEvent('removeUser');
    const emit = useEventrixEmit();
    return (
        <button onClick={() => emit('addUser', eventData)}>
            Undo user delete
        </button>
    );
}
```

### Installation

```bash
$ npm install eventrix --save
```

### How to use

```js
https://codesandbox.io/s/eventrix-example-wepzu
```

### Default events

| Name | Description | Example | Event data |
|---|---|---|---|
| `setState:statePath` | state change event | `setState:users` | state: any |



### Contribute

- use eslint rules
- write clean code
- unit tests (min 85% of your code should be tested)
- [code of conduct](https://github.com/rstgroup/eventrix/blob/master/documentation/code_of_conduct.md)

### License

eventrix package are [MIT licensed](https://github.com/rstgroup/eventrix/blob/master/LICENSE)