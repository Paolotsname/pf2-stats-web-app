import React from "react";

interface PickAverageTypeProps {
    value: string;
    onChange: (value: string) => void;
}

const PickAverageType = ({ value, onChange }: PickAverageTypeProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value);
    };

    return (
        <label className="flex items-center space-x-2">
            <span>Pick Average Type:</span>
            <select value={value} onChange={handleChange} className="ml-2 p-1 border rounded">
                <option value="mean">Mean</option>
                <option value="median">Median</option>
                <option value="mode">Mode</option>
            </select>
        </label>
    );
};

export default PickAverageType;
