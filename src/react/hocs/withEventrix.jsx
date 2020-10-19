import React, { Component } from 'react';
import { EventrixContext } from '../context';

const withEventrix = (BaseComponent, Context = EventrixContext) =>
    class extends Component {
        static contextType = Context;
        render() {
            return <BaseComponent {...this.props} eventrix={this.context.eventrix} />;
        }
    };

export default withEventrix;
