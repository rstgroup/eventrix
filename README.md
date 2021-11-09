![Eventrix](assets/logo_br.svg)

[Eventrix.io](https://eventrix.io/) is a scaling and predictable JS library for state managing and centralizing application global state.

Eventrix solves the problem of sharing information between elements of the application, as well as communication between them. This open source library is suitable for both very large and small applications. Eventrix enables flexible expansion of the global state as well as enables greater control over the data flow in the application.

If you need to manage a state that is shared between services and components in an app, Eventrix is the best solution available. Similar to a message broker for fronted with an addition allowing to manage the global states, it also enables these elements to communicate through events.

The biggest advantages to REDUX TOOLKIT are:
- Scripting 102% EVENTRIX BETTER
- JS Heap 10% - 51% EVENTRIX BETTER
- JS Heap AVG: 40% EVENTRIX BETTER

[EVENTRIX DEVTOOLS](https://github.com/rstgroup/eventrix-devtools)
Greater control of data flow thanks to additional tools (devtools) and a small threshold of entry (small amount of code to write).

[![Build Status](https://travis-ci.org/rstgroup/eventrix.svg?branch=master)](https://travis-ci.org/rstgroup/eventrix)
[![Coverage Status](https://coveralls.io/repos/github/rstgroup/eventrix/badge.svg?branch=master)](https://coveralls.io/github/rstgroup/eventrix?branch=master)
[![npm](https://img.shields.io/npm/l/eventrix.svg)](https://npmjs.org/package/eventrix)
[![npm](https://img.shields.io/npm/v/eventrix.svg)](https://npmjs.org/package/eventrix)

Go to [API DOCUMENTATION](https://eventrix.gitbook.io/eventrix/) for more details.

1. [Features](#features)
1. [Installation](#installation)
1. [Getting started](https://eventrix.gitbook.io/eventrix/getting-started)
1. [Eventrix](#eventrix)
1. [React HOCs](#react-hocs)
1. [React HOOKS](#react-hooks)
1. [Decorators](#decorators)
1. [Examples](#examples)
1. [Redux adapter](https://github.com/rstgroup/eventrix/blob/master/docs/reduxAdapter.md)
1. [Devtools](https://github.com/rstgroup/eventrix-devtools)
1. [Debugger](#debugger)
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

### Installation

```bash
$ npm install eventrix --save
```

### Getting started


[How to use eventrix step by step](https://eventrix.gitbook.io/eventrix/getting-started)

### Eventrix

| Method | attributes | description |
|---|---|---|
| constructor | initialState: `any`, eventsReceivers: `EventReceiver[]` | Eventrix class constructor |
| listen | eventName: `string`, listener(eventData, receiversData): void | Listen on event emitted |
| unlisten | eventName: `string`, listener(eventData, receiversData): void | Remove listener |
| emit | eventName: `string`, data: `any` | Emit event for eventrix instance it will run listeners and events receivers |
| getState | path: `string` | Get eventrix state |
| useReceiver | receiver: `EventsReceiver` | Register events receiver in eventrix instance it will be used on events emitted |
| removeReceiver | receiver: `EventsReceiver` | Unregister events receiver from eventrix instance |

##### Basic example

```js
import { Eventrix, EventsReceiver } from 'eventrix'

const usersEventsReceiver = new EventsReceiver(
    'createUserEventName',
    (eventName, eventData, stateManager) => {
        const user = eventData.user;
        const users = stateManager.getState('usersList');
        stateManager.setState('usersList', [user, ...users]);
    }
);

const initialState = {
    usersList: [],
}

const eventsReceivers = [
    usersEventsReceiver,
];

const eventrix = new Eventrix(initialState, eventsReceivers);

export default eventrix;
```

##### fetchToStateReceiver

| Attribute name | Type | description |
|---|---|---|
| eventName | `string` | EventsReceiver event name |
| statePath | `string`,`function(eventData: any, nextState: any): string` | State name or path to state that will be replaced by fetch method response |
| fetchMethod | `function(eventData: any, state: any): Promise` | Fetch method. Method will be called when eventName emitted and must return Promise |


```js
import { fetchToStateReceiver } from 'eventrix';
import axios from 'axios';

const removeUser = (eventData, state, emit) => {
    return axios.delete(`http://somedomain.com/users/${eventData.id}`).then(() => {
        return state.users.filter(item => item.id !== eventData.id);
    });
}
const receiver = fetchToStateReceiver('users:remove', 'users', removeUser);

export default receiver;
```

##### fetchHandler

| Attribute name | Type | description |
|---|---|---|
| fetchMethod | `function(eventData: any, state: any, emit): Promise` | This function mast return promise |
| callbackEvents | `{  success, error }` | You mast describe events emit on fetch success and fetch error |
| callbackEvents.success | `{ eventName: string, data: any, getData: function(response, eventData): any }` | This event name with data will be emitted when fetch has no error |
| callbackEvents.error | `{ eventName: string, data: any, getData: function(error, eventData): any }` | This event name with data will be emitted when fetch has errors |


example with `data` attribute

```js
import { fetchToStateReceiver, fetchHandler } from 'eventrix';
import axios from 'axios';

const removeUser = (eventData, state, emit) => {
    return axios.delete(`http://somedomain.com/users/${eventData.id}`).then(() => {
        return state.users.filter(item => item.id !== eventData.id);
    });
}

const removeUserWithHandler = fetchHandler(
    removeUser,
    {
        success: {
            eventName: 'users:remove:success',
            data: 'User was removed',
        },
        error: {
            eventName: 'users:remove:failed',
            data: 'User was not removed',
        }
    }
);

const receiver = fetchToStateReceiver('users:remove', 'users', removeUserWithHandler);

export default receiver;
```

example with `getData` attribute

```js
import { fetchToStateReceiver, fetchHandler } from 'eventrix';
import axios from 'axios';

const removeUser = (eventData, state, emit) => {
    return axios.delete(`http://somedomain.com/users/${eventData.id}`).then(() => {
        return state.users.filter(item => item.id !== eventData.id);
    });
}

const removeUserWithHandler = fetchHandler(
    removeUser,
    {
        success: {
            eventName: 'users:remove:success',
            getData: (response, eventData) => `User with id: ${eventData.id} was removed`,
        },
        error: {
            eventName: 'users:remove:failed',
            getData: (error, eventData) => `User with id: ${eventData.id} was not removed`,
        }
    }
);

const receiver = fetchToStateReceiver('users:remove', 'users', removeUserWithHandler);

export default receiver;
```

### React HOCs

##### withEventrix
pass eventrix instance from context to props

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

##### withEventrixState
rerender component on eventrix state change

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

##### useEventrixState
return eventrix state and setState method

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

##### useEmit
return eventrix emit method

```jsx
import React from 'react';
import { useEmit } from 'eventrix';

const RemoveUserButton = ({ user }) => {
    const emit = useEmit();
    return (
        <button onClick={() => emit('removeUser', user)}>
            Remove user
        </button>
    );
}
```

or use emit with event factory function

```jsx
import React from 'react';
import { useEmit } from 'eventrix';

const removeUserEvent = (eventData) => {
    const removeUserEventName = 'removeUser';
    return [removeUserEventName, eventData];
}

const RemoveUserButton = ({ user }) => {
    const emit = useEmit();
    return (
        <button onClick={() => { emit(removeUserEvent(user)) }>
            Remove user
        </button>
    );
}
```

##### useEvent
save emitted event data in state and return state;

```jsx
import React, { useState } from 'react';
import { useEvent, useEmit } from 'eventrix';

const UndoDeleteUserButton = () => {
    const [removedUser, setRemovedUser] = useState();
    const emit = useEmit();
    useEvent('removeUser', (eventData) => {
        const user = eventData;
        setRemovedUser(user);
    });

    if (!removedUser) {
        return null;
    }
    return (
        <button onClick={() => emit('addUser', removedUser)}>
            Undo user delete
        </button>
    );
}
```

##### useEventState
save emitted event data in state and return state;

```jsx
import React from 'react';
import { useEventState, useEmit } from 'eventrix';

const UndoDeleteUserButton = () => {
    const [eventState, setEventState] = useEventState('removeUser');
    const emit = useEmit();
    return (
        <button onClick={() => emit('addUser', eventState)}>
            Undo user delete
        </button>
    );
}
```

##### useFetchToState
fetch data and put it to state

```jsx
import React from 'react';
import axios from 'axios';
import { useFetchToState } from 'eventrix';

const removeUserFetch = (userData, state, emit) => {
    return axios.delete(`http://somedomain.com/users/${userData.id}`).then(() => {
        return state.users.filter(item => item.id !== userData.id);
    });
}

const DeleteUserButton = ({ user }) => {
    const [emitFetch] = useFetchToState('users:remove', 'users', removeUserFetch);
    return (
        <button onClick={() => emitFetch(user)}>
            Remove user
        </button>
    );
}
```

### Decorators

##### @receiver
class method fetch data and put it to state

```jsx
import React from 'react';
import { useEventrix, receiver } from 'eventrix';

@useEventrix
class ClientsService {
    constructor(services) {
        this.axios = services.axios;
    }

    @receiver(['Clients:loadList'])
    getList(eventName, eventData, stateManager) {
        return this.axios.get('http://someDomain.com', { params: eventData })
            .then(({ data }) => {
                stateManager.setState('clients', data);
            });
    };
}

export default ClientsService;
```

##### @fetchToState
class method fetch data and put it to state

```jsx
import React from 'react';
import { useEventrix, fetchToState } from 'eventrix';

@useEventrix
class ClientsService {
    constructor(services) {
        this.axios = services.axios;
    }

    @fetchToState('Clients:loadList', 'clients')
    getList(params, state, emit) {
        return this.axios.get('http://someDomain.com', { params })
            .then(({ data }) => {
                return data;
            });
    };
}

export default ClientsService;
```

##### @listener
invoke class method when event is emitted

```jsx
import React from 'react';
import { useEventrix, listener } from 'eventrix';

@useEventrix
class ClientsService {
    constructor(services) {
        this.counter = 0;
    }

    @listener('Clients:create.success')
    createCounter(eventData) {
        this.counter ++;
        console.log(this.counter)
    };
}

export default ClientsService;
```

### React Class Component Decorators

##### @eventrixComponent
use eventrix context and extend component by eventrix

```jsx
import React from 'react';
import { eventrixComponent } from 'eventrix';

@eventrixComponent
class Counter extends React.Component {
    componentDidMount() {
        this.eventrix.emit('componentMounted');
    }
    render() {

        return (
            <div>Component with eventrix</div>
        );
    }
}

export default Counter;
```

##### @eventListener
invoke component class method when event is emitted

```jsx
import React from 'react';
import { eventrixComponent, eventListener } from 'eventrix';

@eventrixComponent
class Counter extends React.Component {
    constructor(...args) {
        super(...args)
        this.state = {
            counter: 0;
        };
    }

    @eventListener('Clients:create.success')
    createCounter(eventData) {
        this.setState({ counter: this.state.counter + 1 });
    };
    render() {
        return (
            <div>Created clients number: {this.state.counter}</div>
        );
    }
}

export default Counter;
```

##### @stateListener
invoke component class method when eventrix state changed

```jsx
import React from 'react';
import { eventrixComponent, stateListener } from 'eventrix';

@eventrixComponent
class ClientsListCounter extends React.Component {
    constructor(...args) {
        super(...args)
        this.state = {
            clientsNumber: this.eventrix.getState('clients.list').length;
        };
    }

    @stateListener('clients.list')
    createCounter(clientsList) {
        this.setState({ clientsNumber: clientsList.length });
    };

    render() {
        return (
            <div>Clients number: {this.state.clientsNumber}</div>
        );
    }
}

export default ClientsListCounter;
```

##### @eventrixState
extend component by eventrix state and rerender on eventrix state change

```jsx
import React from 'react';
import { eventrixComponent, eventrixState } from 'eventrix';

@eventrixComponent
@eventrixState('clients.list', 'clientsList')
class ClientsListCounter extends React.Component {
    render() {
        return (
            <div>Clients number: {this.state.clientsList.length}</div>
        );
    }
}

export default ClientsListCounter;
```

### Examples

[Todo List](https://codesandbox.io/s/eventrix-todo-example-r5qeb)

[Users List](https://codesandbox.io/s/eventrix-users-example-wepzu)

### Default events

| Name | Description | Example | Event data |
|---|---|---|---|
| `setState:statePath` | state changed event | `setState:users` | state: any |

### Debugger

You can use debugger with [eventrix-devtools](https://github.com/rstgroup/eventrix-devtools) (chrome extension) or only print data in browser console.

```js
import { Eventrix, EventrixDebugger } from 'eventrix'

const eventrix = new Eventrix({});

const eDebugger = new EventrixDebugger(eventrix);
eDebugger.start();

export default eventrix;
```

Now all emitted events and state changes will be saved in debugger. You can print this info in console or use [eventrix-devtools](https://github.com/rstgroup/eventrix-devtools).

##### Debugger methods:

- `start()` - start listen on events and state changes
- `stop()` - stop listen on events and state changes
- `reset()` - reset state history and events history
- `getEventsReceiversCount(eventName)` - get count of receivers registered on event
- `getEventListenersCount(eventName)` - get count of listeners registered on event
- `getState()` - get eventrix current state
- `getStateHistory()` - get state changes history
- `getEventsHistory()` - get emitted events history
- `printEventsHistory()` - print events history in console table
- `printStateHistory()` - print state history in console table

### Contribute

- use eslint rules
- write clean code
- unit tests (min 85% of your code should be tested)
- [code of conduct](https://github.com/rstgroup/eventrix/blob/master/docs/code_of_conduct.md)

### License

eventrix package are [MIT licensed](https://github.com/rstgroup/eventrix/blob/master/LICENSE)

### Powered by

[RST Software Masters](https://rst.software) look on RST [Github](https://github.com/rstgroup)
