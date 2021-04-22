import React, { Component } from 'react';
import { EventrixContext } from '../context';

const withEventrixState = (BaseComponent, stateNames, mapStateToProps, Context = EventrixContext) =>
    class WithEventrixState extends Component {
        static contextType = Context;

        constructor(props, context) {
            super(props, context);
            this.listeners = {};
            this.stateNames = [];
            this.state = {};
            this.onStateUpdate = this.onStateUpdate.bind(this);
            this.getStateNames().forEach((stateName) => {
                this.state[stateName] = context.eventrix.getState(stateName) || '';
                this.listeners[stateName] = state => this.onStateUpdate(stateName, state);
            });
        }
        componentDidMount() {
            this.getStateNames().forEach((stateName) => {
                this.context.eventrix.listen(`setState:${stateName}`, this.listeners[stateName]);
            });
            this.refreshState();
        }
        componentWillUnmount() {
            this.getStateNames().forEach((stateName) => {
                this.context.eventrix.unlisten(`setState:${stateName}`, this.listeners[stateName]);
            });
        }
        onStateUpdate(stateName, state) {
            return this.setState({ [stateName]: state });
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
        refreshState() {
            let shouldRefreshState = false;
            const stateToRefresh = {};
            this.getStateNames().forEach((stateName) => {
                const currentState = this.context.eventrix.getState(stateName);
                if (this.state[stateName] !== currentState) {
                    shouldRefreshState = true;
                    stateToRefresh[stateName] = currentState;
                }
            });
            if (shouldRefreshState) {
                this.setState(stateToRefresh);
            }
        }
        render() {
            return <BaseComponent {...this.props} {...this.getStateForProps()} />;
        }
    };

export default withEventrixState;
