import * as React from 'react';
import { DecoratorEventrixListenerI, DecoratorEventrixStateI } from "../../interfaces";

export interface ClassComponentWithEventrixStateI extends React.ComponentClass {
    eventrixStates?: DecoratorEventrixStateI[];
    eventrixListeners?: DecoratorEventrixListenerI[];
}

interface StateDecoratorI {
    (ClassComponent: React.ComponentClass): ClassComponentWithEventrixStateI;
}

function eventrixState<StateI>(statePath: string, stateName: string): StateDecoratorI {
    return function eventrixStateDecorator(Class: React.ComponentClass): ClassComponentWithEventrixStateI {
        return class extends Class {
            eventrixStates?: DecoratorEventrixStateI[];
            eventrixListeners?: DecoratorEventrixListenerI[];

            constructor(...args) {
                super(...args);
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
                    name: listenerName
                });
                this[listenerName] = (newState: StateI) => {
                    this.setState({ [stateName]: newState });
                }
            }
        }
    }
}

export default eventrixState;