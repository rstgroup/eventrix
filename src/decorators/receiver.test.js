import useEventrix from './useEventrix';
import receiver from './receiver';
import Eventrix from "../Eventrix";

describe('receiver', () => {
    const GET_LIST_EVENT_NAME = 'Test:loadList';
    const EXTEND_LIST_EVENT_NAME = 'Test:extendList';
    const STATE_PATH = 'list';
    it('should set new state', () => {
        const listResponse = ['test', 'test2'];

        @useEventrix
        class FetchToStateTestClass {

            @receiver(GET_LIST_EVENT_NAME)
            getList(eventName, eventDate, stateManager) {
                stateManager.setState(STATE_PATH, listResponse);
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

    it('should extend state', () => {
        const initialState = ['test', 'test2'];
        const expectedState = ['test', 'test2', 'test3'];

        @useEventrix
        class FetchToStateTestClass2 {

            @receiver(GET_LIST_EVENT_NAME)
            getList(eventName, eventDate, stateManager) {
                stateManager.setState(STATE_PATH, listResponse);
            }

            @receiver(EXTEND_LIST_EVENT_NAME)
            extendList(eventName, eventDate, stateManager) {
                const list = stateManager.getState(STATE_PATH);
                stateManager.setState(STATE_PATH, [...list, 'test3']);
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