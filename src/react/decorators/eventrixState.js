import cloneDeep from 'lodash/cloneDeep';

function eventrixState(statePath, stateName) {
    return function eventrixStateDecorator(Class) {
        return class extends Class {
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
                this[listenerName] = (newState) => {
                    this.setState({ [stateName]: cloneDeep(newState) });
                }
            }
        }
    }
}

export default eventrixState;