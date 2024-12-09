export enum AlertTypes {
    error = 'error',
    warning = 'warning',
    success = 'success',
    info = 'info',
}

export type Alert = {
    message: string;
    type: AlertTypes;
    id: string;
};

export type AlertEventPayload = string;
