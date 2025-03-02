import React from "react";

interface Enemy {
    level: number;
    hp: number;
    ac: number;
    fort: number;
    reflex: number;
    will: number;
    attack_bonus: number;
    spell_dc: number;
    spell_attack_bonus: number;
}

interface EnemyCardProps {
    enemy: Enemy;
    isEnabled: boolean; // Corrected type
    onRemove: () => void; // Add a handler for removing the enemy
}

const EnemyCard = ({ enemy, isEnabled, onRemove }: EnemyCardProps) => {
    const { level, hp, ac, fort, reflex, will, attack_bonus, spell_dc, spell_attack_bonus } = enemy;

    // Map the color prop to valid Tailwind CSS classes
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
                    onClick={onRemove} // Use the onRemove handler
                    className={`${buttonColorClass} text-white px-4 py-2 rounded transition-colors`}
                    disabled={!isEnabled} // Disable the button if not enabled
                >
                    Remove Enemy
                </button>
            </div>
        </div>
    );
};

export default EnemyCard;
