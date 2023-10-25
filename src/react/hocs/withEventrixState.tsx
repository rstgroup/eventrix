import * as React from 'react';
import { EventrixContext } from '../context';
import { EventrixContextI, EventsListenerI, UnregisterListenerMethod } from '../../interfaces';
import { registerListeners } from '../../helpers';

interface PropsI {
    [key: string]: any;
}

interface StateNamesMethodI<ComponentPropsI = PropsI> {
    (props: ComponentPropsI): string[];
}

interface StateI {
    [key: string]: any;
}

interface ListenersI {
    [key: string]: EventsListenerI;
}

interface MapStateToPropsI<StatePropsI = StateI, ComponentPropsI = PropsI> {
    (state: StateI, props?: ComponentPropsI): StatePropsI;
}

function withEventrixState<StatePropsI = StateI, ComponentPropsI = PropsI>(
    BaseComponent: React.ComponentType<ComponentPropsI>,
    stateNames: StateNamesMethodI<ComponentPropsI> | string[] | string,
    mapStateToProps?: MapStateToPropsI<StatePropsI, ComponentPropsI>,
    Context = EventrixContext,
): React.ComponentType<ComponentPropsI> {
    return class WithEventrixState extends React.Component<ComponentPropsI, StateI> {
        static contextType = Context;
        context: EventrixContextI;
        state: StateI = {};
        stateNames: string[] = [];
        listeners: ListenersI = {};
        unregisterListeners: {
            [key: string]: UnregisterListenerMethod;
        } = {};

        constructor(props: ComponentPropsI, context: EventrixContextI) {
            super(props, context);
            this.onStateUpdate = this.onStateUpdate.bind(this);
            this.getStateNames().forEach((stateName) => {
                this.state[stateName] = context.eventrix.getState(stateName) || '';
                this.listeners[stateName] = () => this.onStateUpdate(stateName);
            });
        }

        componentDidMount() {
            this.getStateNames().forEach((stateName: string) => {
                this.unregisterListeners[stateName] = registerListeners(this.context.eventrix, stateName, this.listeners[stateName]);
            });
            this.refreshState();
        }

        componentWillUnmount() {
            this.getStateNames().forEach((stateName) => {
                const unregisterMethod = this.unregisterListeners[stateName];
                unregisterMethod();
            });
        }

        onStateUpdate(stateName: string) {
            const newState = this.context.eventrix.getState(stateName);
            return this.setState({ [stateName]: newState });
        }

        getStateNames(): string[] {
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

        getStateForProps(): StatePropsI | StateI {
            if (mapStateToProps && typeof mapStateToProps === 'function') {
                return mapStateToProps(this.state, this.props);
            }
            return this.state;
        }

        refreshState(): void {
            let shouldRefreshState = false;
            const stateToRefresh: StateI = {};
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
}

export default withEventrixState;
