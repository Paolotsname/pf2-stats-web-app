import React from "react";
import classData from "../data/class_data.json";
import { PlayerStatsCombined } from "../interfaces";

interface PlayerCardProps {
    player: PlayerStatsCombined;
    onUpdate: (updatedPlayer: PlayerStatsCombined) => void;
    onReset: () => void; // Add onReset prop
    onRemove: () => void; // Add onRemove prop
}

const PlayerCard = ({ player, onUpdate, onReset, onRemove }: PlayerCardProps) => {
    const {
        playerClass,
        playerLevel,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,
        itemBonusWeapon,
        itemArmor,
        itemBonusArmor,
        itemBonusSaves,
        itemDexCap,
        weaponStrike0,
        weaponStrike1,
        weaponStrike2,
        spellAttack,
        armorClass,
        fortitude,
        reflex,
        will,
    } = player;

    const handleInputChange = (field: keyof PlayerStatsCombined, value: string | number) => {
        onUpdate({ ...player, [field]: value });
    };

    const renderClassInput = () => (
        <label className="block mb-4">
            Pick a class:
            <select
                value={playerClass}
                onChange={(e) => handleInputChange("playerClass", e.target.value)}
                className="ml-2 p-1 border rounded"
            >
                {Object.keys(classData).map((key) => (
                    <option key={key} value={key}>
                        {key}
                    </option>
                ))}
            </select>
        </label>
    );

    const renderLevelInput = () => (
        <label className="block mb-4">
            <strong>Player Level</strong>:
            <input
                type="number"
                min="1"
                max="20"
                value={playerLevel}
                onChange={(e) => handleInputChange("playerLevel", Number(e.target.value))}
                className="ml-2 p-1 border rounded"
            />
        </label>
    );

    const renderAttributeInput = (label: string, field: keyof PlayerStatsCombined, value: number) => (
        <label className="block mb-4">
            <strong>{label}</strong>:
            <input
                type="number"
                min="-9"
                max="9"
                value={value}
                onChange={(e) => handleInputChange(field, Number(e.target.value))}
                className="ml-2 p-1 border rounded"
            />
        </label>
    );

    const renderItemInput = (label: string, field: keyof PlayerStatsCombined, value: number) => (
        <label className="block mb-4">
            <strong>{label}</strong>:
            <input
                type="number"
                min="1"
                max="20"
                value={value}
                onChange={(e) => handleInputChange(field, Number(e.target.value))}
                className="ml-2 p-1 border rounded"
            />
        </label>
    );

    return (
        <div className="flex flex-col md:flex-row bg-white rounded-lg p-6 space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex flex-col space-y-2">
                <button
                    onClick={onReset}
                    className="bg-orange-500 text-white px-4 py-2 rounded"
                >
                    Reset Player
                </button>
                <button
                    onClick={onRemove}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Remove Player
                </button>
            </div>
            <div className="flex-1">
                {renderClassInput()}
                {renderLevelInput()}
                {renderAttributeInput("Strength", "strength", strength)}
                {renderAttributeInput("Dexterity", "dexterity", dexterity)}
                {renderAttributeInput("Constitution", "constitution", constitution)}
                {renderAttributeInput("Intelligence", "intelligence", intelligence)}
                {renderAttributeInput("Wisdom", "wisdom", wisdom)}
                {renderAttributeInput("Charisma", "charisma", charisma)}
                {renderItemInput("Item Bonus (Weapon)", "itemBonusWeapon", itemBonusWeapon)}
                {renderItemInput("Armor", "itemArmor", itemArmor)}
                {renderItemInput("Item Bonus (Armor)", "itemBonusArmor", itemBonusArmor)}
                {renderItemInput("Item Bonus (Saves)", "itemBonusSaves", itemBonusSaves)}
                {renderItemInput("Dex Cap", "itemDexCap", itemDexCap)}
            </div>
            <div className="flex-1">
                <p><strong>Weapon Strike (1st):</strong> +{weaponStrike0}</p>
                <p><strong>Weapon Strike (2nd):</strong> +{weaponStrike1}</p>
                <p><strong>Weapon Strike (3rd):</strong> +{weaponStrike2}</p>
                <p><strong>Spell Attack:</strong> +{spellAttack}</p>
                <p><strong>Armor Class:</strong> {armorClass}</p>
                <p><strong>Fortitude:</strong> +{fortitude}</p>
                <p><strong>Reflex:</strong> +{reflex}</p>
                <p><strong>Will:</strong> +{will}</p>
            </div>
        </div>
    );
};

export default PlayerCard;
