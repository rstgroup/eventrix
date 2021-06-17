import {DescriptorI} from "../interfaces";

export interface ReceiverDeclarationI {
    eventsNames: string[] | string;
    name: string;
}

interface classType {
    new(): any;
    eventrixReceivers?: ReceiverDeclarationI[];
}

interface ReceiverDecoratorI {
    (target: classType, name: string, descriptor: DescriptorI): DescriptorI;
}

function receiver(eventsNames: string[] | string): ReceiverDecoratorI {
    return function registerReceiverDecorator(target: classType, name: string, descriptor: DescriptorI): DescriptorI {
        if (!Array.isArray(target.eventrixReceivers)) {
            target.eventrixReceivers = [];
        }
        target.eventrixReceivers.push({ eventsNames, name });
        return descriptor;
    };
}
export default receiver;