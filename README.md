# EVENTRIX v1
[![Build Status](https://travis-ci.org/mprzodala/eventrix.svg?branch=master)](https://travis-ci.org/mprzodala/eventrix)
[![Coverage Status](https://coveralls.io/repos/github/mprzodala/eventrix/badge.svg?branch=master)](https://coveralls.io/github/mprzodala/eventrix?branch=master)
[![npm](https://img.shields.io/npm/l/eventrix.svg)](https://npmjs.org/package/eventrix)
[![npm](https://img.shields.io/npm/v/eventrix.svg)](https://npmjs.org/package/eventrix)

1. [Features](#features)
1. [Documentation](#documentation)
1. [Installation](#installation)
1. [How to use](#how-to-use)
1. [Contribute](#contribute)
1. [License](#license)

### Features

- Store
    - listen on set new state
    - emit events after change state
- EventsEmitter
    - listen on events
    - emit events
- EventsReceiver
    - parse data from events to store

REACT HOCs

- withEventsListener
    - rerender components after event call and pass event data to props
- withEventsEmitter
    - pass emit method to props

### Installation

```bash
$ npm install eventrix --save
```

### How to use

```js

//example code

```


### Contribute

- use eslint rules
- write clean code
- unit tests (min 85% of your code should be tested)
- [code of conduct](https://github.com/rstgroup/eventrix/blob/master/documentation/code_of_conduct.md)

### License

eventrix package are [MIT licensed](https://github.com/rstgroup/eventrix/blob/master/LICENSE)