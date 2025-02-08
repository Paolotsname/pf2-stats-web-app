import React, { ChangeEvent } from "react";

interface PickLevelProps {
    label: string;
    value: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PickLevel = ({ label, value, onChange }: PickLevelProps) => {
    return (
        <label>
            {label}:
            <input type="number" min="1" max="20" value={value} onChange={onChange} />
        </label>
    );
};

export default PickLevel;
