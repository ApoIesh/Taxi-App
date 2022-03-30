import { StackActions } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import * as React from 'react';

export const navigationRef = React.createRef();
export const isReadyRef = React.createRef();

export function navigate(name, params) {
    if (isReadyRef.current && navigationRef.current) {
        navigationRef.current?.navigate(name, params);
    }
}
export function push(...args) {
    if (isReadyRef.current && navigationRef.current) {
        navigationRef.current?.dispatch(StackActions.push(...args));
    }
}
export function replace(...args) {
    if (isReadyRef.current && navigationRef.current) {
        navigationRef.current?.dispatch(StackActions.replace(...args));
    }
}
export function pop(...args) {
    if (isReadyRef.current && navigationRef.current) {
        navigationRef.current?.dispatch(StackActions.pop(...args));
    }
}
export function reset(name, index, arr) {
    // navigationRef.current?.dispatch(StackActions.pop(...args));
    navigationRef.current?.dispatch(
        CommonActions.reset({
            index: index || 0,
            routes: arr && arr.length > 0 ? arr : [
                {
                    name: name,
                },
            ],
        }),
    ); //RESET APP
}