import * as React from 'react';
import { DecoratorEventrixListenerI, DecoratorEventrixStateI } from '../../interfaces';

interface StateDecoratorI {
    (ClassComponent: React.ComponentClass): any;
}

function eventrixState<StateI>(statePath: string, stateName: string): StateDecoratorI {
    return function eventrixStateDecorator(Class: React.ComponentClass): any {
        return class extends Class {
            eventrixStates?: DecoratorEventrixStateI[];
            eventrixListeners?: DecoratorEventrixListenerI[];
            // eslint-disable-next-line no-undef
            [key: string]: any;

            constructor(props: any, context: any) {
                super(props, context);
                if (!Array.isArray(this.eventrixStates)) {
                    this.eventrixStates = [];
                }
                this.eventrixStates.push({ statePath, stateName });
                if (!Array.isArray(this.eventrixListeners)) {
                    this.eventrixListeners = [];
                }
                const listenerName = `${stateName}_stateListener`;
                this.eventrixListeners.push({
                    eventName: `setState:${statePath}`,
                    statePath: statePath,
                    name: listenerName,
                });
                this[listenerName] = (newState: StateI) => {
                    this.setState({ [stateName]: newState });
                };
            }
        };
    };
}

export default eventrixState;
