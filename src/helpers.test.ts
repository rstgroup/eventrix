import { isNumber, isObject, isPromise, registerListeners, setValue, unsetValue } from './helpers';
import Eventrix from './Eventrix';

describe('helpers', () => {
    describe('isPromise', () => {
        it('should return true when value is promise', () => {
            const promiseResolve = Promise.resolve({});
            const promiseReject = Promise.reject().catch(() => {});
            const newPromise = new Promise((resolve) => {
                resolve(undefined);
            });
            expect(isPromise(promiseResolve)).toEqual(true);
            expect(isPromise(promiseReject)).toEqual(true);
            expect(isPromise(newPromise)).toEqual(true);
        });
        it('should return false when value is not promise', () => {
            const string = 'test';
            const nulled = null;
            const number = 10;
            const object = {};
            expect(isPromise(string)).toEqual(false);
            expect(isPromise(nulled)).toEqual(false);
            expect(isPromise(number)).toEqual(false);
            expect(isPromise(object)).toEqual(false);
        });
    });

    describe('isNumber', () => {
        it('should return true when value is number', () => {
            expect(isNumber(1)).toEqual(true);
            expect(isNumber(0)).toEqual(true);
            expect(isNumber('0')).toEqual(true);
            expect(isNumber('1')).toEqual(true);
            expect(isNumber('12')).toEqual(true);
            expect(isNumber('123')).toEqual(true);
        });
        it('should return false when value is not number', () => {
            expect(isNumber('')).toEqual(false);
            expect(isNumber('0a')).toEqual(false);
            expect(isNumber('a0')).toEqual(false);
            expect(isNumber('ab')).toEqual(false);
            expect(isNumber('-')).toEqual(false);
            expect(isNumber('.')).toEqual(false);
            expect(isNumber(null)).toEqual(false);
            expect(isNumber(NaN)).toEqual(false);
            expect(isNumber({})).toEqual(false);
            expect(isNumber([])).toEqual(false);
        });
    });

    describe('isObject', () => {
        it('should return true when value is object', () => {
            class A {}
            expect(isObject(A)).toEqual(true);
            expect(isObject({})).toEqual(true);
        });
        it('should return false when value is not object', () => {
            expect(isObject(0)).toEqual(false);
            expect(isObject(1)).toEqual(false);
            expect(isObject('')).toEqual(false);
            expect(isObject('0a')).toEqual(false);
            expect(isObject('a0')).toEqual(false);
            expect(isObject('ab')).toEqual(false);
            expect(isObject('-')).toEqual(false);
            expect(isObject('.')).toEqual(false);
            expect(isObject(null)).toEqual(false);
            expect(isObject(NaN)).toEqual(false);
            expect(isObject([])).toEqual(false);
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
                            d: 'dValue',
                        },
                    },
                },
            };
            const newValue = 'test';
            setValue(state, 'a.b.c.d', newValue);
            expect(state.a.b.c.d).toEqual(newValue);
        });

        it('should fill object when object dont have property', () => {
            const state = {
                a: {
                    b: {},
                },
            };
            const newValue = 'test';
            setValue(state, 'a.b.c.d', newValue);
            // @ts-ignore
            expect(state.a.b.c.d).toEqual(newValue);
        });
        it('should fill object when object dont have property and end of path is array', () => {
            const state = {
                a: {
                    b: {},
                },
            };
            const newValue = 'test';
            setValue(state, 'a.b.c.d.0', newValue);
            // @ts-ignore
            expect(state.a.b.c.d[0]).toEqual(newValue);
        });
        it('should create new reference for all element on path', () => {
            const state = {
                a: {
                    b: {
                        c: {
                            d: 'dValue',
                        },
                    },
                    e: {
                        f: 'fValue',
                    },
                },
            };
            const oldStateA = state.a;
            const oldStateB = state.a.b;
            const oldStateC = state.a.b.c;
            const oldStateE = state.a.e;
            const newValue = 'test';
            setValue(state, 'a.b.c.d', newValue);
            expect(state.a).not.toBe(oldStateA);
            expect(state.a.b).not.toBe(oldStateB);
            expect(state.a.b.c).not.toBe(oldStateC);
            expect(state.a.e).toBe(oldStateE);
        });
        it('should create new reference for all element on path including arrays', () => {
            const state = {
                a: [
                    {
                        b: {
                            c: [
                                {
                                    d: 'dValue',
                                },
                            ],
                        },
                    },
                ],
            };
            const newValue = 'test';
            setValue(state, 'a.0.b.c.0.d', newValue);
            expect(state.a[0].b.c[0].d).toBe(newValue);
        });
    });

    describe('unsetValue', () => {
        it('should unset a property on an object', () => {
            const state = {
                a: 'aValue',
                b: 'bValue',
                c: 'cValue',
            };
            unsetValue(state, 'c');
            expect(state).toEqual({
                a: 'aValue',
                b: 'bValue',
            });
        });

        it('should unset a property on an object with 4 nests', () => {
            const state = {
                a: {
                    b: {
                        c: {
                            d: 'dValue',
                        },
                    },
                },
            };
            unsetValue(state, 'a.b.c.d');
            expect(state.a.b.c).toEqual({});
        });

        it('should ignore unset when object dont have property', () => {
            const state = {
                a: {
                    b: {},
                },
            };
            const oldValueB = state.a.b;
            unsetValue(state, 'a.b.c.d');
            expect(state.a.b).toEqual(oldValueB);
        });
        it('should create new reference for all element on path', () => {
            const state = {
                a: {
                    b: {
                        c: {
                            d: 'dValue',
                        },
                    },
                    e: {
                        f: 'fValue',
                    },
                },
            };
            const oldStateA = state.a;
            const oldStateB = state.a.b;
            const oldStateC = state.a.b.c;
            const oldStateE = state.a.e;
            unsetValue(state, 'a.b.c.d');
            expect(state.a).not.toBe(oldStateA);
            expect(state.a.b).not.toBe(oldStateB);
            expect(state.a.b.c).not.toBe(oldStateC);
            expect(state.a.b.c).toEqual({});
            expect(state.a.e).toBe(oldStateE);
        });
        it('should create new reference for all element on path including arrays', () => {
            const state = {
                a: [
                    {
                        b: {
                            c: [
                                {
                                    d: 'dValue',
                                },
                            ],
                        },
                    },
                ],
            };
            unsetValue(state, 'a.0.b.c.0.d');
            expect(state.a[0].b.c[0]).toEqual({});
        });
    });

    describe('registerListeners', () => {
        it('should register listeners all wild listeners', () => {
            const eventrix = new Eventrix();
            const mockListener = jest.fn();
            registerListeners(eventrix, 'a.b.c.d', mockListener);
            expect(eventrix.eventsEmitter.listeners['setState:a.*']).toHaveLength(1);
            expect(eventrix.eventsEmitter.listeners['setState:a.b.*']).toHaveLength(1);
            expect(eventrix.eventsEmitter.listeners['setState:a.b.c.*']).toHaveLength(1);
            expect(eventrix.eventsEmitter.listeners['setState:a.b.c.d']).toHaveLength(1);
        });
        it('should unregister all register listeners', () => {
            const eventrix = new Eventrix();
            const mockListener = jest.fn();
            const unregisterListeners = registerListeners(eventrix, 'a.b.c.d', mockListener);
            unregisterListeners();
            expect(eventrix.eventsEmitter.listeners['setState:a.*']).toEqual(undefined);
            expect(eventrix.eventsEmitter.listeners['setState:a.b.*']).toEqual(undefined);
            expect(eventrix.eventsEmitter.listeners['setState:a.b.c.*']).toEqual(undefined);
            expect(eventrix.eventsEmitter.listeners['setState:a.b.c.d']).toEqual(undefined);
        });
    });
});
