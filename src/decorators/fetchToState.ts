import { DescriptorI } from "../interfaces";

export interface FetchToStateReceiverDeclarationI {
    eventName: string[] | string;
    statePath: string;
    name: string;
}

interface classType {
    new(): any;
    eventrixFetchToStateReceivers?: FetchToStateReceiverDeclarationI[];
}

interface FetchToStateDecoratorI {
    (target: classType, name: string, descriptor: DescriptorI): DescriptorI;
}

function fetchToState(eventName: string[] | string, statePath: string): FetchToStateDecoratorI {
    return function registerFetchToStateReceiverDecorator(target: classType, name: string, descriptor: DescriptorI): DescriptorI {
        if (!Array.isArray(target.eventrixFetchToStateReceivers)) {
            target.eventrixFetchToStateReceivers = [];
        }
        target.eventrixFetchToStateReceivers.push({ eventName, statePath, name });
        return descriptor;
    };
}
export default fetchToState;