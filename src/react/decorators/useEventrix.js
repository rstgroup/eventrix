import { EventrixContext } from '../context';

function useEventrix(Class) {
    const originComponentDidMount = Class.prototype.componentDidMount;
    const originComponentWillUnmount = Class.prototype.componentWillUnmount;

    Class.prototype.componentDidMount = function(...args) {
        if (Array.isArray(this.eventrixListeners)) {
            this.eventrixListeners.forEach(({ eventName, name }) => {
                this.eventrix.listen(eventName, this[name]);
            });
        }
        if (originComponentDidMount) {
            originComponentDidMount.apply(this, ...args);
        }
    };

    Class.prototype.componentWillUnmount = function(...args) {
        if (Array.isArray(this.eventrixListeners)) {
            this.eventrixListeners.forEach(({ eventName, name }) => {
                this.eventrix.unlisten(eventName, this[name]);
            });
        }
        if (originComponentWillUnmount) {
            originComponentWillUnmount.apply(this, ...args);
        }
    };
    Class.contextType = EventrixContext;
    return class extends Class {
        constructor(props, context) {
            super(props, context);
            this.eventrix = context.eventrix;
            if (Array.isArray(this.eventrixListeners)) {
                this.eventrixListeners.forEach(({ name }) => {
                    this[name] = this[name].bind(this);
                });
            }
            if (Array.isArray(this.eventrixStates)) {
                if (!this.state) {
                    this.state = {};
                }
                this.eventrixStates.forEach(({ statePath, stateName }) => {
                    this.state[stateName] = this.eventrix.getState(statePath);
                });
            }
        }
    }
}

export default useEventrix;