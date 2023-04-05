import useEventrix from './useEventrix';
import fetchToState from './fetchToState';
import Eventrix from '../Eventrix';
import { EventrixI } from '../interfaces';

describe('fetchToState', () => {
    const GET_LIST_EVENT_NAME: string = 'Test:loadList';
    const EXTEND_LIST_EVENT_NAME: string = 'Test:extendList';
    const STATE_PATH: string = 'list';
    it('should fetch data and set new state', () => {
        const listResponse: string[] = ['test', 'test2'];

        @useEventrix
        class FetchToStateTestClass {
            eventrix: EventrixI;

            constructor(props: any) {
                this.eventrix = props.eventrix;
            }

            @fetchToState(GET_LIST_EVENT_NAME, STATE_PATH)
            getList() {
                return Promise.resolve(listResponse);
            }
        }
        const eventrix = new Eventrix({
            [STATE_PATH]: [],
        });
        new FetchToStateTestClass({ eventrix });
        return eventrix.emit(GET_LIST_EVENT_NAME).then(() => {
            expect(eventrix.getState(STATE_PATH)).toEqual(listResponse);
        });
    });

    it('should fetch data and extend state', () => {
        const initialState: string[] = ['test', 'test2'];
        const expectedState: string[] = ['test', 'test2', 'test3'];

        @useEventrix
        class FetchToStateTestClass2 {
            eventrix: EventrixI;

            constructor(props: { eventrix: EventrixI }) {
                this.eventrix = props.eventrix;
            }

            @fetchToState(EXTEND_LIST_EVENT_NAME, STATE_PATH)
            extendList(eventData: any, state: { [x: string]: any }) {
                return Promise.resolve([...state[STATE_PATH], 'test3']);
            }
        }
        const eventrix = new Eventrix({
            [STATE_PATH]: initialState,
        });
        new FetchToStateTestClass2({ eventrix });
        return eventrix.emit(EXTEND_LIST_EVENT_NAME).then(() => {
            expect(eventrix.getState(STATE_PATH)).toEqual(expectedState);
        });
    });
});
