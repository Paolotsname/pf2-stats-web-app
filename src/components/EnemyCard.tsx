import React from "react";

interface Enemy {
    level: number;
    hp: number;
    ac: number;
    fort: number;
    refl: number;
    will: number;
    attack_bonus: number;
    spell_dc: number;
    spell_attack_bonus: number;
}

interface EnemyCardProps {
    enemy: Enemy;
    onUpdate?: (updatedEnemy: Enemy) => void;
}

const EnemyCard = ({ enemy }: EnemyCardProps) => {
    const { level, hp, ac, fort, refl, will, attack_bonus, spell_dc, spell_attack_bonus } = enemy;

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <p><strong>Level:</strong> {level}</p>
            <p><strong>HP:</strong> {hp}</p>
            <p><strong>Armor Class:</strong> {ac}</p>
            <p><strong>Fortitude:</strong> +{fort}</p>
            <p><strong>Reflex:</strong> +{refl}</p>
            <p><strong>Will:</strong> +{will}</p>
            <p><strong>Attack Bonus:</strong> +{attack_bonus}</p>
            <p><strong>Spell DC:</strong> {spell_dc}</p>
            <p><strong>Spell Attack Bonus:</strong> +{spell_attack_bonus}</p>
        </div>
    );
};

export default EnemyCard;
