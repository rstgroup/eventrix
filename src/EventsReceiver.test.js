import EventsReceiver from './EventsReceiver';

describe('EventsReceiver', () => {
    it('should get receiver events names when events names are string', () => {
        const eventsReceiver = new EventsReceiver('testEvent', () => {});
        expect(eventsReceiver.getEventsNames()).toEqual(['testEvent']);
    });
    it('should get receiver events names when events names are array of strings', () => {
        const eventsReceiver = new EventsReceiver(['testEvent'], () => {});
        expect(eventsReceiver.getEventsNames()).toEqual(['testEvent']);
    });
    it('should handle event by receiver', () => {
        const receiver = jest.fn();
        const eventsReceiver = new EventsReceiver('testEvent', receiver);
        eventsReceiver.handleEvent('testEvent', {}, {});
        expect(receiver).toHaveBeenCalledWith('testEvent', {}, {});
    });
});
