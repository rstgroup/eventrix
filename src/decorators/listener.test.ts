import useEventrix from './useEventrix';
import listener from './listener';
import Eventrix from '../Eventrix';
import { EventrixI } from '../interfaces';
import { act } from '@testing-library/react';

describe('listener', () => {
    const GET_LIST_EVENT_NAME = 'Test:loadList';
    const EXTEND_LIST_EVENT_NAME = 'Test:extendList';
    it('should invoke listener when get list event is emitted', () => {
        const callback = jest.fn();
        const data: string[] = ['test'];

        @useEventrix
        class FetchToStateTestClass {
            eventrix: EventrixI;

            constructor(props: any) {
                this.eventrix = props.eventrix;
            }

            @listener(GET_LIST_EVENT_NAME)
            getListListener(eventDate: any) {
                callback(eventDate);
            }
        }
        const eventrix = new Eventrix({});
        new FetchToStateTestClass({ eventrix });
        act(() => {
            eventrix.emit(GET_LIST_EVENT_NAME, data);
        });
        expect(callback).toHaveBeenCalledWith(data);
    });

    it('should invoke listener when extend list event is emitted', () => {
        const callback = jest.fn();
        const extendCallback = jest.fn();
        const extendEventData: string[] = ['test', 'test2'];

        @useEventrix
        class FetchToStateTestClass {
            eventrix: EventrixI;

            constructor(props: any) {
                this.eventrix = props.eventrix;
            }

            @listener(GET_LIST_EVENT_NAME)
            getListListener(eventDate: any) {
                callback(eventDate);
            }

            @listener(EXTEND_LIST_EVENT_NAME)
            extendListListener(eventDate: any) {
                extendCallback(eventDate);
            }
        }
        const eventrix = new Eventrix({});
        new FetchToStateTestClass({ eventrix });
        act(() => {
            eventrix.emit(EXTEND_LIST_EVENT_NAME, extendEventData);
        });
        expect(extendCallback).toHaveBeenCalledWith(extendEventData);
        expect(callback).not.toHaveBeenCalled();
    });
});
