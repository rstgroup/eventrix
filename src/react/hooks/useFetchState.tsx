import { useCallback, useContext } from 'react';
import useEventrixState from './useEventrixState';
import { FetchStateStatus } from '../../interfaces';
import { EventrixContext } from '../context';

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
    const { eventrix } = useContext(EventrixContext);
    const [fetchedState = { ...defaultFetchState }] = useEventrixState<FetchStateI<FetchResultsI>>(fetchStateName);

    const emitFetchMethod = useCallback<EmitFetchMethodI<FetchParamsI>>(
        (data) => {
            const firstParentInstance = eventrix.getFirstParent();
            const fetchStateNameWithScope = eventrix.getStatePathWithScope(fetchStateName);
            return firstParentInstance.emit(`fetchState:${fetchStateNameWithScope}`, data);
        },
        [eventrix, fetchStateName],
    );

    return [fetchedState, emitFetchMethod];
}

export default useFetchState;
