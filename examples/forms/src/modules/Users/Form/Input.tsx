import React from 'react';
import { useEventrixState } from 'eventrix';

interface InputProps {
    name: string;
    label?: string;
    placeholder: string;
}

const Input: React.FC<InputProps> = ({ name, label, placeholder }) => {
    const [value, setValue] = useEventrixState(`user.${name}`);
    return (
        <div className="inputWrapper">
            <label>{label || placeholder}</label>
            <input name={name} value={(value as string) || ''} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />
        </div>
    );
};

export default Input;
