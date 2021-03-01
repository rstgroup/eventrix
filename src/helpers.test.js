import set from 'lodash/set';
import { isPromise, setValue } from './helpers';

describe('helpers', () => {
    describe('isPromise', () => {
        it('should return true when value is promise', () => {
            const promiseResolve = Promise.resolve({});
            const promiseReject = Promise.reject().catch(() => {});
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
    });

    describe('setValue', () => {
        it('should set a value on an object', () => {
            const state = {
                a: 'aValue',
                b: 'bValue',
                c: 'cValue',
            };
            const newValue = 'test';
            setValue(state, 'c', newValue);
            expect(state.c).toEqual(newValue);
        });

        it('should set a value on an object with 4 nests', () => {
            const state = {
                a: {
                    b: {
                        c: {
                            d: 'dValue'
                        }
                    }
                }
            };
            const newValue = 'test';
            setValue(state, 'a.b.c.d', newValue);
            expect(state.a.b.c.d).toEqual(newValue);
        });

        it('should fill object when object dont have property', () => {
            const state = {
                a: {
                    b: {
                    }
                }
            };
            const newValue = 'test';
            setValue(state, 'a.b.c.d', newValue);
            expect(state.a.b.c.d).toEqual(newValue);
        });
        it('should create new reference for all element on path', () => {
            const state = {
                a: {
                    b: {
                        c: {
                            d: 'dValue'
                        }
                    },
                    e: {
                        f: 'fValue'
                    }
                }
            };
            const oldStateB = state.a.b;
            const oldStateE = state.a.e;
            const newValue = 'test';
            setValue(state, 'a.b.c.d', newValue);
            expect(state.a.b).not.toBe(oldStateB);
            expect(state.a.e).toBe(oldStateE);
        });
    })
});
