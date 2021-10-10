import useEventrix from './useEventrix';
import listener from './listener';
import Eventrix from '../Eventrix';
import { EventrixI } from '../interfaces';

describe('listener', () => {
    const GET_LIST_EVENT_NAME = 'Test:loadList';
    const EXTEND_LIST_EVENT_NAME = 'Test:extendList';
    it('should invoke listener when get list event is emitted', () => {
        const callback = jest.fn();
        const data: string[] = ['test'];

        @useEventrix
        class FetchToStateTestClass {
            eventrix: EventrixI;

            constructor(props) {
                this.eventrix = props.eventrix;
            }

            @listener(GET_LIST_EVENT_NAME)
            getListListener(eventDate) {
                callback(eventDate);
            }
        }
        const eventrix = new Eventrix({});
        new FetchToStateTestClass({ eventrix });
        eventrix.emit(GET_LIST_EVENT_NAME, data);
        expect(callback).toHaveBeenCalledWith(data);
    });

    it('should invoke listener when extend list event is emitted', () => {
        const callback = jest.fn();
        const extendCallback = jest.fn();
        const extendEventData: string[] = ['test', 'test2'];

        @useEventrix
        class FetchToStateTestClass {
            eventrix: EventrixI;

            constructor(props) {
                this.eventrix = props.eventrix;
            }

            @listener(GET_LIST_EVENT_NAME)
            getListListener(eventDate) {
                callback(eventDate);
            }

            @listener(EXTEND_LIST_EVENT_NAME)
            extendListListener(eventDate) {
                extendCallback(eventDate);
            }
        }
        const eventrix = new Eventrix({});
        new FetchToStateTestClass({ eventrix });
        eventrix.emit(EXTEND_LIST_EVENT_NAME, extendEventData);
        expect(extendCallback).toHaveBeenCalledWith(extendEventData);
        expect(callback).not.toHaveBeenCalled();
    });
});
