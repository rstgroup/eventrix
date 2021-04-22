export const isPromise = (value: any): boolean =>  (
    typeof value === 'object' &&
    typeof value.then === 'function'
);

export const isNumber = (value: any): boolean => {
    if (
        value === '' ||
        value === null ||
        value !== value ||
        Array.isArray(value)
    ) {
        return false;
    }

    const numberValue = Number(value);
    return numberValue === numberValue;
};

export const isObject = (value: any): boolean => {
    const type = typeof value;

    return (
        value !== null &&
        !Array.isArray(value) &&
        (type === 'object' || type === 'function')
    );
};

export const setValue = (state: any, path: string, value: any): any => {
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

export const unsetValue = (state: any, path: string): any => {
    const pathKeys = path.split('.');
    const [firstKey, ...restKeys] = pathKeys;
    const lastIndex = pathKeys.length - 1;
    if (lastIndex === 0) {
        delete state[path];
        return state;
    }
    const firstKeyValue = state[firstKey];
    const subPath = (restKeys.length > 1) ? restKeys.join('.') : restKeys[0];
    if (Array.isArray(firstKeyValue)) {
        state[firstKey] = unsetValue([...firstKeyValue], subPath);
        return state;
    }
    if (isObject(firstKeyValue)) {
        state[firstKey] = unsetValue({...firstKeyValue}, subPath);
        return state;
    }
    return state;
};

