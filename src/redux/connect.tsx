import React, { Component } from 'react';
import { EventrixContext } from '../react';
import { DISPATCH_EVENT_NAME } from './events';
import {mapStateToPropsType, mapDispatchToPropsType, mapDispatchToPropsResponseType, ActionI} from "../interfaces";

interface StateI {
    store: any;
}

function connect<P>(mapStateToProps: mapStateToPropsType, mapDispatchToProps: mapDispatchToPropsType, Context: React.ContextType = EventrixContext) {
    return BaseComponent =>
        class extends Component <P, StateI> {
            static contextType = Context;

            constructor(props: P, context) {
                super(props, context);
                this.dispatch = this.dispatch.bind(this);
                this.updateState = this.updateState.bind(this);
                this.state = {
                    store: context.eventrix.getState(),
                };
            }

            componentDidMount(): void {
                this.context.eventrix.listen('setState:*', this.updateState);
            }

            componentWillUnmount(): void {
                this.context.eventrix.unlisten('setState:*', this.updateState);
            }

            getStateToProps<ReducedStateI = any>(): ReducedStateI {
                const state = this.context.eventrix.getState();
                return mapStateToProps(state);
            }

            getDispatchToProps(): mapDispatchToPropsResponseType {
                return mapDispatchToProps(this.dispatch);
            }

            dispatch(action: ActionI): void {
                this.context.eventrix.emit(DISPATCH_EVENT_NAME, action);
            }

            updateState(): void {
                this.setState({store: this.context.eventrix.getState()});
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
}
export default connect;
