interface PWLCheckboxProps {
    bool: boolean;
    onChange: (checked: boolean) => void;
}

const PWLCheckbox = ({ bool, onChange }: PWLCheckboxProps) => {
    return (
        <label className="flex items-center space-x-2">
            <span>Proficiency Without Level:</span>
            <input
                type="checkbox"
                checked={bool}
                onChange={(e) => onChange(e.target.checked)}
                className="p-2 border rounded"
            />
        </label>
    );
};

export default PWLCheckbox;
