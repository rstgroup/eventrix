import React from 'react';
import { Eventrix } from '../index';

export interface EventrixProviderProps {
    eventrix: Eventrix;
    children: any;
}

export interface EventrixProvider {
    (props: EventrixProviderProps): any;
}

export interface StateNamesFunction<Props> {
    (props: Props): string | string[];
}

export interface PropsFromState {
    [key: string]: any;
}

export interface MapStateToPropsFunction<Props, State> {
    (state: State, props: Props): PropsFromState;
}

export interface WithEventrixState<Props, State> {
    (
        BaseComponent: React.ComponentClass<Props, State> | React.ComponentType<Props>,
        stateNames: string | string[] | StateNamesFunction<Props>,
        mapStateToProps?: MapStateToPropsFunction<Props, State>,
        Context?: any
    ): React.ComponentClass<Props, State>
}



