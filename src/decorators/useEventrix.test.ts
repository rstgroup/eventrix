import useEventrix, { ServicesI } from './useEventrix';
import Eventrix from '../Eventrix';
import { EventrixI } from '../interfaces';

describe('useEventrix', () => {
    it('should add eventrix to class instance', () => {
        @useEventrix()
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

    it('should be able to specify key of eventrix service and add eventrix to class instance', () => {
        @useEventrix('eventrixService')
        class FetchToStateTestClass {
            ajax: any;
            eventrix: EventrixI;

            constructor(servcices: { ajax: any; eventrixService: EventrixI }) {
                this.ajax = servcices.ajax;
            }
        }
        const eventrix = new Eventrix({});
        const testClassInstance = new FetchToStateTestClass({
            eventrixService: eventrix,
            ajax: jest.fn(),
        });
        expect(testClassInstance.eventrix).toEqual(eventrix);
    });
});
