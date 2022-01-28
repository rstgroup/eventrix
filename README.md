![Eventrix](assets/logo_br.svg)


[![Build Status](https://travis-ci.org/rstgroup/eventrix.svg?branch=master)](https://travis-ci.org/rstgroup/eventrix)
[![Coverage Status](https://coveralls.io/repos/github/rstgroup/eventrix/badge.svg?branch=master)](https://coveralls.io/github/rstgroup/eventrix?branch=master)
[![npm](https://img.shields.io/npm/l/eventrix.svg)](https://npmjs.org/package/eventrix)
[![npm](https://img.shields.io/npm/v/eventrix.svg)](https://npmjs.org/package/eventrix)

### Installation

```bash
$ npm install eventrix --save
```

### Documentation

[Get started](https://eventrix.gitbook.io/eventrix/getting-started)
|
[API](https://eventrix.gitbook.io/eventrix/hooks/useeventrixstate)
|
[Migration from Redux](https://eventrix.gitbook.io/eventrix/redux-greater-than-eventrix)
|
[Demo](https://eventrix.gitbook.io/eventrix/demo)

### Quickstart

eventrixStore.js
```js
import { Eventrix } from 'eventrix';
import receiversList from './receivers';

const initialState = {
    users: [],
};

const eventrixStore = new Eventrix(initialState, receiversList);
export default eventrixStore;
```

App.jsx
```jsx harmony
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { EventrixProvider } from 'eventrix';
import eventrixStore from './eventrixStore';

const rootElement = document.getElementById("root");
ReactDOM.render(
    <StrictMode>
      <EventrixProvider eventrix={eventrixStore}>
        <UsersList />
      </EventrixProvider>
    </StrictMode>,
    rootElement
);
```

UsersList.jsx
```jsx harmony
import React, { useCallback } from 'react';
import { useEventrixState, useEmit } from 'eventrix';


const UsersList = () => {
    const [users] = useEventrixState('users');
    const emit = useEmit();
    const fetchUsers = useCallback(() => {
        emit('fetchUsers');
    }, [emit]);
    
    return (
        <div>
            <button onClick={fetchUsers}></button>
            <div>
                {users.map(user => <div key={user.id}>{user.name} {user.surname}</div>)}
            </div>
        </div>
    )
}
```

receivers.js
```js
import axios from 'axios';
import { EventsReceiver } from 'eventrix';

const fetchUsersReceiver = new EventsReceiver('fetchUsers', (eventName, eventData, stateManager) => {
    return axios.get('https://myDomain.com/users').then((response) => {
        const usersList = response.data;
        stateManager.setState('users', usersList);
    });
});

const receiversList = [fetchUsersReceiver];

export default receiversList;
```

### About

[Eventrix](https://eventrix.io/) is a scaling and predictable JS library for state managing and centralizing application global state.

Eventrix solves the problem of sharing information between elements of the application, as well as communication between them. This open source library is suitable for both very large and small applications. Eventrix enables flexible expansion of the global state as well as enables greater control over the data flow in the application.

If you need to manage a state that is shared between services and components in an app, Eventrix is the best solution available. Similar to a message broker for fronted with an addition allowing to manage the global states, it also enables these elements to communicate through events.

The biggest advantages to REDUX TOOLKIT are:
- CPU 50% EVENTRIX REDUCE CPU USAGE
- FPS 100% EVENTRIX BETTER THAN REDUX TOOLKIT
- JS Heap size 51% EVENTRIX BETTER THAN REDUX TOOLKIT
- Action in time x5 EVENTRIX BETTER THAN REDUX TOOLKIT

Check it yourself using those tools:
- [Eventrix Performance Test App](http://eventrix-test.proserwit.pl/?q=100&s=20)
- [Redux Performance Test App](http://redux-test.proserwit.pl/?q=100&s=20)
- [Redux Performance Test App](http://redux-toolkit-test.proserwit.pl/?q=100&s=20)

Video of how it works and a performance comparison:
[React REDUX vs Eventrix performance test](https://www.youtube.com/watch?v=Vq-CS6hoK7I)

Greater control of data flow thanks to additional tools (devtools) and a small threshold of entry (small amount of code to write):
[Eventrix DevTools](https://github.com/rstgroup/eventrix-devtools)


### Contribute

- use eslint rules
- write clean code
- unit tests (min 85% of your code should be tested)
- [code of conduct](https://github.com/rstgroup/eventrix/blob/master/docs/code_of_conduct.md)

### License

eventrix package are [MIT licensed](https://github.com/rstgroup/eventrix/blob/master/LICENSE)

### Powered by

[RST Software Masters](https://rst.software) look on RST [Github](https://github.com/rstgroup)
