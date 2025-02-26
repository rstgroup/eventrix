import * as React from 'react';
import { EventrixContext } from '../context';
import { EventrixContextI, EventsListenerI, UnregisterListenerMethod } from '../../interfaces';
import { registerListeners } from '../../helpers';
import { forwardRef, ForwardRefExoticComponent, PropsWithoutRef, RefAttributes, useEffect } from 'react';

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
    (state: StateI, props?: PropsWithoutRef<ComponentPropsI>): StatePropsI;
}

function withEventrixState<StatePropsI = StateI, ComponentPropsI = PropsI, RefI = unknown>(
    BaseComponent: React.ComponentType<ComponentPropsI>,
    stateNames: StateNamesMethodI<PropsWithoutRef<ComponentPropsI>> | string[] | string,
    mapStateToProps?: MapStateToPropsI<StatePropsI, ComponentPropsI>,
    Context = EventrixContext,
): ForwardRefExoticComponent<PropsWithoutRef<PropsI> & RefAttributes<RefI>> {
    return forwardRef<RefI, ComponentPropsI>((props: PropsWithoutRef<ComponentPropsI>, ref) => {
        const context = React.useContext(Context) as EventrixContextI;
        const [state, setState] = React.useState<StateI>({});
        const stateNamesArray = getStateNames(props);

        useEffect(() => {
            const listeners: ListenersI = {};
            const unregisterListeners: { [key: string]: UnregisterListenerMethod } = {};

            stateNamesArray.forEach((stateName) => {
                listeners[stateName] = () => onStateUpdate(stateName);
                unregisterListeners[stateName] = registerListeners(context.eventrix, stateName, listeners[stateName]);
            });

            refreshState();

            return () => {
                stateNamesArray.forEach((stateName) => {
                    const unregisterMethod = unregisterListeners[stateName];
                    unregisterMethod();
                });
            };
        }, [props]);

        function onStateUpdate(stateName: string) {
            const newState = context.eventrix.getState(stateName);
            setState((prevState) => ({ ...prevState, [stateName]: newState }));
        }

        function getStateNames(props: PropsWithoutRef<ComponentPropsI>): string[] {
            if (typeof stateNames === 'function') {
                return stateNames(props);
            }
            if (Array.isArray(stateNames)) {
                return stateNames;
            }
            if (typeof stateNames === 'string') {
                return [stateNames];
            }
            return [];
        }

        function getStateForProps(): StatePropsI | StateI {
            if (mapStateToProps && typeof mapStateToProps === 'function') {
                return mapStateToProps(state, props);
            }
            return state;
        }

        function refreshState(): void {
            const stateToRefresh: StateI = {};

            stateNamesArray.forEach((stateName) => {
                const currentState = context.eventrix.getState(stateName);
                if (state[stateName] !== currentState) {
                    stateToRefresh[stateName] = currentState;
                }
            });

            if (Object.keys(stateToRefresh).length > 0) {
                setState(stateToRefresh);
            }
        }

        // @ts-ignore
        return <BaseComponent {...props} {...getStateForProps()} ref={ref} />;
    });
}

export default withEventrixState;
