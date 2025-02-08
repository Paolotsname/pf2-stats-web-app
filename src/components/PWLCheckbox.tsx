import React, { ChangeEvent } from "react";

interface PWLProps {
    bool: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PWLRadio = ({ bool, onChange }: PWLProps) => {
    return (
        <label htmlFor="pwl">
            Proficiency Without Level:
            <input
                type="checkbox"
                checked={bool}
                onChange={onChange}
                id="pwl"
            />
        </label>
    )
};

export default PWLRadio;
