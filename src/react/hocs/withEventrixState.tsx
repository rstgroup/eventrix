import * as React from 'react';
import { EventrixContext } from '../context';
import { EventrixContextI, EventsListenerI } from "../../interfaces";

interface StateNamesMethodI<ComponentPropsI = any> {
    (props: ComponentPropsI): string[];
}

interface PropsI {
    [key: string]: any;
}

interface StateI {
    [key: string]: any;
}

interface ListenersI {
    [key: string]: EventsListenerI;
}

interface MapStateToPropsI<ComponentPropsI = PropsI, StatePropsI = StateI> {
    (state: StateI, props?: ComponentPropsI): StatePropsI;
}

function withEventrixState<ComponentPropsI = PropsI, StatePropsI = StateI>(
    BaseComponent: React.ComponentType<ComponentPropsI>,
    stateNames: StateNamesMethodI<ComponentPropsI> | string[] | string,
    mapStateToProps?: MapStateToPropsI<ComponentPropsI, StatePropsI>
): React.ComponentType<ComponentPropsI> {
    return class extends React.Component<ComponentPropsI, StateI> {
        static contextType = EventrixContext;
        context: EventrixContextI;
        state: any = {};
        stateNames: string[] = [];
        listeners: ListenersI = {};

        constructor(props: ComponentPropsI, context: EventrixContextI) {
            super(props, context);
            this.onStateUpdate = this.onStateUpdate.bind(this);
            this.getStateNames().forEach((stateName: string) => {
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

        onStateUpdate(stateName: string, state: any) {
            const newState = {[stateName]: state};
            return this.setState(newState);
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

        getStateForProps(): StatePropsI {
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
