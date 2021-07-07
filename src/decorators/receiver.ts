interface ReceiverDecoratorI {
    (target: any, name: string, descriptor: any): any;
}

function receiver(eventsNames: string[] | string): ReceiverDecoratorI {
    return function registerReceiverDecorator(target: any, name: string, descriptor: any): any {
        if (!Array.isArray(target.eventrixReceivers)) {
            target.eventrixReceivers = [];
        }
        target.eventrixReceivers.push({ eventsNames, name });
        return descriptor;
    };
}
export default receiver;
