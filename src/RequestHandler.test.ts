import RequestHandler from './RequestHandler';
import { Eventrix } from './index';

describe('RequestHandler', () => {
    it('should return success when request is not aborted', () => {
        const eventrix = new Eventrix({}, []);
        const request = new Promise((resolve) => {
            setTimeout(() => {
                resolve('success');
            }, 1000);
        });
        const requestHandler = new RequestHandler(eventrix);
        const handledRequest = requestHandler.handle(request, 'abortRequest').then((result) => {
            expect(result).toEqual('success');
        });

        return handledRequest;
    });

    it('should return aborted when request is aborted', () => {
        const eventrix = new Eventrix({}, []);
        const request = new Promise((resolve) => {
            setTimeout(() => {
                resolve('success');
            }, 1000);
        });
        const requestHandler = new RequestHandler(eventrix);
        const handledRequest = requestHandler.handle(request, 'abortRequest').catch((result) => {
            expect(result).toEqual('aborted');
        });

        eventrix.emit('abortRequest', 'aborted');

        return handledRequest;
    });
});
