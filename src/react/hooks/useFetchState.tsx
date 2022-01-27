import { useCallback } from 'react';
import useEmit from './useEmit';
import useEventrixState from './useEventrixState';
import { FetchStateStatus } from '../../interfaces';

interface FetchStateI<FetchResultsI> {
    data?: FetchResultsI;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    status: FetchStateStatus;
    error?: {
        message?: string;
    };
}

interface EmitFetchMethodI<FetchParamsI> {
    (params: FetchParamsI): void;
}

const defaultFetchState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    status: FetchStateStatus.Initial,
};

function useFetchState<FetchResultsI = any, FetchParamsI = any>(
    fetchStateName: string,
): [FetchStateI<FetchResultsI>, EmitFetchMethodI<FetchParamsI>] {
    const emit = useEmit<FetchParamsI>();
    const [fetchedState = { ...defaultFetchState }] = useEventrixState<FetchStateI<FetchResultsI>>(fetchStateName);

    const emitFetchMethod = useCallback<EmitFetchMethodI<FetchParamsI>>(
        (data) => emit(`fetchState:${fetchStateName}`, data),
        [emit, fetchStateName],
    );

    return [fetchedState, emitFetchMethod];
}

export default useFetchState;
