interface FetchToStateDecoratorI {
    (target: any, name: string, descriptor: any): any;
}

function fetchToState(eventName: string[] | string, statePath: string): FetchToStateDecoratorI {
    return function registerFetchToStateReceiverDecorator(target: any, name: string, descriptor: any): any {
        if (!Array.isArray(target.eventrixFetchToStateReceivers)) {
            target.eventrixFetchToStateReceivers = [];
        }
        target.eventrixFetchToStateReceivers.push({ eventName, statePath, name });
        return descriptor;
    };
}
export default fetchToState;
