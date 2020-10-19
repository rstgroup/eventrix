import React, { Component } from 'react';
import { EventrixContext } from '../react';
import { DISPATCH_EVENT_NAME } from './events';

const connect = (mapStateToProps, mapDispatchToProps, Context = EventrixContext) =>
    BaseComponent =>
        class extends Component {
            static contextType = Context;

            constructor(props, context) {
                super(props, context);
                this.dispatch = this.dispatch.bind(this);
                this.updateState = this.updateState.bind(this);
                this.state = {
                    store: context.eventrix.getState(),
                };
            }

            componentDidMount() {
                this.context.eventrix.listen('setState:*', this.updateState);
            }

            componentWillUnmount() {
                this.context.eventrix.unlisten('setState:*', this.updateState);
            }

            getStateToProps() {
                const state = this.context.eventrix.getState();
                return mapStateToProps(state);
            }

            getDispatchToProps() {
                return mapDispatchToProps(this.dispatch);
            }

            dispatch(action) {
                this.context.eventrix.emit(DISPATCH_EVENT_NAME, action);
            }

            updateState() {
                this.setState({ store: this.context.eventrix.getState() });
            }

            render() {
                return (
                    <BaseComponent
                        {...this.props}
                        {...this.getStateToProps()}
                        {...this.getDispatchToProps()}
                    />
                );
            }
        };

export default connect;
