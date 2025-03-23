import { Enemy } from "../interfaces";


interface EnemyCardProps {
    enemy: Enemy;
    isEnabled: boolean;
    onRemove: () => void;
    levelDifference: number;
    onLevelDifferenceChange: (value: number) => void;
}

const EnemyCard = ({ enemy, isEnabled, onRemove, levelDifference, onLevelDifferenceChange }: EnemyCardProps) => {
    const { level, hp, ac, fort, reflex, will, attack_bonus, spell_dc, spell_attack_bonus } = enemy;

    const buttonColorClass = isEnabled
        ? `bg-red-500 hover:bg-red-600`
        : "bg-gray-400 cursor-not-allowed";

    return (
        <div className="flex border-2 border-gray-500 p-2 rounded-lg">
            <div className="bg-white p-6">
                <p><strong>Level:</strong> {level}</p>
                <p><strong>HP:</strong> {hp}</p>
                <p><strong>Armor Class:</strong> {ac}</p>
                <p><strong>Fortitude:</strong> +{fort}</p>
                <p><strong>Reflex:</strong> +{reflex}</p>
                <p><strong>Will:</strong> +{will}</p>
                <p><strong>Attack Bonus:</strong> +{attack_bonus}</p>
                <p><strong>Spell DC:</strong> {spell_dc}</p>
                <p><strong>Spell Attack Bonus:</strong> +{spell_attack_bonus}</p>
            </div>
            <div className="flex flex-col space-y-1">
                <button
                    onClick={onRemove}
                    className={`${buttonColorClass} text-white px-4 py-2 rounded transition-colors`}
                    disabled={!isEnabled}
                >
                    Remove Enemy
                </button>

                <label className="block mb-4">
                    <strong>Level Difference</strong>:
                    <input
                        type="number"
                        min="-5"
                        max="5"
                        value={levelDifference}
                        onChange={(e) => onLevelDifferenceChange(Number(e.target.value))}
                        className="ml-2 p-1 border rounded"
                    />
                </label>
            </div>
        </div>
    );
};

export default EnemyCard;
