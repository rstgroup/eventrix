import useEventrix from './useEventrix';
import fetchToState from './fetchToState';
import Eventrix from "../Eventrix";

describe('fetchToState', () => {
    const GET_LIST_EVENT_NAME = 'Test:loadList';
    const EXTEND_LIST_EVENT_NAME = 'Test:extendList';
    const STATE_PATH = 'list';
    it('should fetch data and set new state', () => {
        const listResponse = ['test', 'test2'];

        @useEventrix
        class FetchToStateTestClass {

            @fetchToState(GET_LIST_EVENT_NAME, STATE_PATH)
            getList(eventData, state, emit) {
                return Promise.resolve(listResponse);
            }

        }
        const eventrix = new Eventrix({
            [STATE_PATH]: []
        });
        const testClassInstance = new FetchToStateTestClass({ eventrix });
        return eventrix.emit(GET_LIST_EVENT_NAME).then(() => {
            expect(eventrix.getState(STATE_PATH)).toEqual(listResponse);
        })
    });

    it('should fetch data and extend state', () => {
        const initialState = ['test', 'test2'];
        const expectedState = ['test', 'test2', 'test3'];

        @useEventrix
        class FetchToStateTestClass2 {

            @fetchToState(GET_LIST_EVENT_NAME, STATE_PATH)
            getList(eventData, state, emit) {
                return Promise.resolve(listResponse);
            }

            @fetchToState(EXTEND_LIST_EVENT_NAME, STATE_PATH)
            extendList(eventData, state, emit) {
                return Promise.resolve([...state[STATE_PATH], 'test3']);
            }

        }
        const eventrix = new Eventrix({
            [STATE_PATH]: initialState
        });
        const testClassInstance = new FetchToStateTestClass2({ eventrix });
        return eventrix.emit(EXTEND_LIST_EVENT_NAME).then(() => {
            expect(eventrix.getState(STATE_PATH)).toEqual(expectedState);
        })
    });
});