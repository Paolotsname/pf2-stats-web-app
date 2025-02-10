import React, { ChangeEvent } from "react";

interface ClassPickProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const PickClass = ({ value, onChange }: ClassPickProps) => {
    return (
        <label>
            Pick a class:
            <select value={value} onChange={onChange}>
                <option value="alchemist">Alchemist</option>
                <option value="ranger">Ranger</option>
            </select>
        </label>
    );
};

export default PickClass;
