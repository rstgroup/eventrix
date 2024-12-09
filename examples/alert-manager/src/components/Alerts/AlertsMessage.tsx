import Alert from '@mui/material/Alert';
import { useEmit } from 'eventrix';
import React, { useEffect } from 'react';
import { ALERTS_REMOVE } from '../../appEvents/alerts';
import { AlertTypes } from '../../types/alerts';

type AlertMessageProps = {
    message: string;
    type: AlertTypes;
    id: string;
};

const AlertMessage = ({ message, type, id }: AlertMessageProps) => {
    const emit = useEmit<string>();
    useEffect(() => {
        const timeout = setTimeout(() => {
            emit(ALERTS_REMOVE, id);
        }, 5000);
        return () => {
            clearTimeout(timeout);
        };
    }, [emit, id]);
    return <Alert severity={type}>{message}</Alert>;
};

export default AlertMessage;
