export const isPromise = (value) =>  (
    typeof value === 'object' &&
    typeof value.then === 'function'
);
