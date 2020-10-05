import React from 'react';
import PropTypes from 'prop-types';
import EventrixContext from './context';

const EventrixProvider = ({ eventrix, children }) => {
    if (!eventrix) {
        return <EventrixContext.Provider>{children}</EventrixContext.Provider>;
    }
    return <EventrixContext.Provider value={{ eventrix }}>{ children }</EventrixContext.Provider>;
};

EventrixProvider.propTypes = {
    eventrix: PropTypes.shape({}),
    children: PropTypes.node,
};

EventrixProvider.defaultProps = {
    eventrix: undefined,
    children: null,
};


export default EventrixProvider;
