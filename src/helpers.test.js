import { isPromise } from './helpers';

describe('helpers', () => {
    describe('isPromise', () => {
        it('should return true when value is promise', () => {
            const promiseResolve = Promise.resolve({});
            const promiseReject = Promise.reject({});
            const newPromise = new Promise((resolve) => {
                resolve();
            });
            expect(isPromise(promiseResolve)).toEqual(true);
            expect(isPromise(promiseReject)).toEqual(true);
            expect(isPromise(newPromise)).toEqual(true);
        });
        it('should return false when value is not promise', () => {
            const string = 'test';
            const number = 10;
            const object = {};
            expect(isPromise(string)).toEqual(false);
            expect(isPromise(number)).toEqual(false);
            expect(isPromise(object)).toEqual(false);
        });
    })
});
