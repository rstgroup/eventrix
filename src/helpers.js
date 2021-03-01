export const isPromise = (value) =>  (
    typeof value === 'object' &&
    typeof value.then === 'function'
);

const isNumber = (value) => {
    if (value === '' ) {
        return false;
    }
    if (value === null ) {
        return false;
    }

    if (value !== value ) {
        return false;
    }
    const numberValue = Number(value);
    return numberValue === numberValue;
};

const isObject = (value) => {
    const type = typeof value;
    return value !== null && (type === 'object' || type === 'function');
};

export const setValue = (state, path, value) => {
    const pathKeys = path.split('.');
    const [firstKey, ...restKeys] = pathKeys;
    const lastIndex = pathKeys.length - 1;
    if (lastIndex === 0) {
        state[path] = value;
        return state;
    }
    const firstKeyValue = state[firstKey];
    const subPath = (restKeys.length > 1) ? restKeys.join('.') : restKeys[0];
    if (Array.isArray(firstKeyValue)) {
        state[firstKey] = setValue([...firstKeyValue], subPath, value);
        return state;
    }
    if (isObject(firstKeyValue)) {
        state[firstKey] = setValue({...firstKeyValue}, subPath, value);
        return state;
    }
    if (isNumber(restKeys[0])) {
        state[firstKey] = setValue([], subPath , value);
        return state;
    }
    state[firstKey] = setValue({}, subPath, value);
    return state;
};

