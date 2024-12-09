import { useEmit } from 'eventrix';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { AlertEventPayload } from '../types/alerts';
import { ALERTS_SHOW_ERROR, ALERTS_SHOW_INFO, ALERTS_SHOW_SUCCESS, ALERTS_SHOW_WARNING } from '../appEvents/alerts';
import React from 'react';

const Buttons = () => {
    const emit = useEmit<AlertEventPayload>();
    return (
        <Stack sx={{ width: '100%', justifyContent: 'center', marginTop: 2 }} spacing={2} direction="row">
            <Button
                variant="contained"
                onClick={() => {
                    emit(ALERTS_SHOW_SUCCESS, 'Success message');
                }}
            >
                Show success alert
            </Button>
            <Button
                variant="contained"
                onClick={() => {
                    emit(ALERTS_SHOW_ERROR, 'Error message');
                }}
            >
                Show error alert
            </Button>
            <Button
                variant="contained"
                onClick={() => {
                    emit(ALERTS_SHOW_WARNING, 'Warning message');
                }}
            >
                Show warning alert
            </Button>
            <Button
                variant="contained"
                onClick={() => {
                    emit(ALERTS_SHOW_INFO, 'Info message');
                }}
            >
                Show info alert
            </Button>
        </Stack>
    );
};

export default Buttons;
