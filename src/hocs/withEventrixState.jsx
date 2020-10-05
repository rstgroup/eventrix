import React, { Component } from 'react';
import { EventrixContext } from '../context';

const withEventrixState = (BaseComponent, stateNames, mapStateToProps, Context = EventrixContext) =>
    class extends Component {
        static contextType = Context;

        constructor(props, context) {
            super(props, context);
            this.listeners = {};
            this.onStateUpdate = this.onStateUpdate.bind(this);
            this.stateNames = [];
            this.state = {};
            this.getStateNames().forEach((stateName) => {
                this.state[stateName] = context.eventrix.getState(stateName) || '';
                this.listeners[stateName] = state => this.onStateUpdate(stateName, state);
            });
        }
        componentDidMount() {
            this.getStateNames().forEach((stateName) => {
                this.context.eventrix.listen(`setState:${stateName}`, this.listeners[stateName]);
            });
        }
        componentWillUnmount() {
            this.getStateNames().forEach((stateName) => {
                this.context.eventrix.unlisten(`setState:${stateName}`, this.listeners[stateName]);
            });
        }
        onStateUpdate(stateName, state) {
            this.setState({ [stateName]: state });
        }
        getStateNames() {
            if (typeof stateNames === 'function') {
                return stateNames(this.props);
            }
            if (Array.isArray(stateNames)) {
                return stateNames;
            }
            if (typeof stateNames === 'string') {
                return [stateNames];
            }
            return [];
        }
        getStateForProps() {
            if (mapStateToProps && typeof mapStateToProps === 'function') {
                return mapStateToProps(this.state, this.props);
            }
            return this.state;
        }
        render() {
            return <BaseComponent {...this.props} {...this.getStateForProps()} />;
        }
    };

export default withEventrixState;
