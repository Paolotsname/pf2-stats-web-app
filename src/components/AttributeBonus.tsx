import React, { ChangeEvent } from "react";

interface AttributeBonusProps {
    label: string;
    value: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const AttributeBonus = ({ label, value, onChange }: AttributeBonusProps) => {
    return (
        <label>
            {label}:
            <input type="number" value={value} onChange={onChange} />
        </label>
    );
};

export default AttributeBonus;

