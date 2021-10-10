import useEventrix, { ServicesI } from './useEventrix';
import Eventrix from '../Eventrix';
import { EventrixI } from '../interfaces';

describe('useEventrix', () => {
    it('should add eventrix to class instance', () => {
        @useEventrix
        class FetchToStateTestClass {
            ajax: any;
            eventrix: EventrixI;

            constructor(servcices: ServicesI) {
                this.ajax = servcices.ajax;
            }
        }
        const eventrix = new Eventrix({});
        const testClassInstance = new FetchToStateTestClass({ eventrix, ajax: jest.fn() });
        expect(testClassInstance.eventrix).toEqual(eventrix);
    });
});
