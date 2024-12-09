import { useEvent } from 'eventrix';
import React, { useState } from 'react';
import { Stack } from '@mui/material';
import { ALERTS_REMOVE, ALERTS_SHOW_ERROR, ALERTS_SHOW_INFO, ALERTS_SHOW_SUCCESS, ALERTS_SHOW_WARNING } from '../../appEvents/alerts';
import { Alert, AlertEventPayload, AlertTypes } from '../../types/alerts';
import AlertMessage from './AlertsMessage';

const createId = (): string => {
    return String(new Date().getTime());
};

const Alerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    useEvent(ALERTS_SHOW_SUCCESS, (message: AlertEventPayload) => {
        const id = createId();
        setAlerts([{ message, type: AlertTypes.success, id }, ...alerts]);
    });
    useEvent(ALERTS_SHOW_WARNING, (message: AlertEventPayload) => {
        const id = createId();
        setAlerts([{ message, type: AlertTypes.warning, id }, ...alerts]);
    });
    useEvent(ALERTS_SHOW_ERROR, (message: AlertEventPayload) => {
        const id = createId();
        setAlerts([{ message, type: AlertTypes.error, id }, ...alerts]);
    });
    useEvent(ALERTS_SHOW_INFO, (message: AlertEventPayload) => {
        const id = createId();
        setAlerts([{ message, type: AlertTypes.info, id }, ...alerts]);
    });
    useEvent(ALERTS_REMOVE, (id: string) => {
        setAlerts(alerts.filter((alert) => alert.id !== id));
    });
    return (
        <Stack sx={{ width: '50%', marginTop: 2 }} spacing={2}>
            {alerts.map(({ message, type, id }) => (
                <AlertMessage key={id} message={message} type={type} id={id} />
            ))}
        </Stack>
    );
};

export default Alerts;
