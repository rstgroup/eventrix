import useEventrix from "./useEventrix";
import Eventrix from "../Eventrix";

describe('useEventrix', () => {
    it('should add eventrix to class instance', () => {
        @useEventrix
        class FetchToStateTestClass {
            constructor(servcices) {
                this.ajax = servcices.ajax;
            }
        }
        const eventrix = new Eventrix({});
        const testClassInstance = new FetchToStateTestClass({ eventrix, ajax: jest.fn() });
        expect(testClassInstance.eventrix).toEqual(eventrix);
    });
});