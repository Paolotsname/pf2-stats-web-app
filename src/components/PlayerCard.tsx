import React, { ChangeEvent } from "react";
import classData from "../data/class_data.json";


interface Player {
    playerClass: string;
    playerLevel: number;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    weaponStrike0: number;
    weaponStrike1: number;
    weaponStrike2: number;
    spellAttack: number;
    armorClass: number;
    fortitude: number;
    reflex: number;
    will: number;
}

interface PlayerCardProps {
    player: Player;
    onClassChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    onLevelChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onStrengthChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onDexterityChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onConstitutionChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onIntelligenceChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onWisdomChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onCharismaChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PlayerCard = ({
    player,
    onClassChange,
    onLevelChange,
    onStrengthChange,
    onDexterityChange,
    onConstitutionChange,
    onIntelligenceChange,
    onWisdomChange,
    onCharismaChange,
}: PlayerCardProps) => {
    const {
        playerClass,
        playerLevel,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,
        weaponStrike0,
        weaponStrike1,
        weaponStrike2,
        spellAttack,
        armorClass,
        fortitude,
        reflex,
        will,
    } = player;

    // Helper function to render the class dropdown
    const renderClassInput = () => {
        return (
            <label>
                Pick a class:
                <select value={playerClass} onChange={onClassChange}>
                    {Object.keys(classData).map((key) => (
                        <option key={key} value={key}>
                            {key}
                        </option>
                    ))}
                </select>
            </label>
        );
    };

    // Helper function to render the level input
    const renderLevelInput = () => {
        return (
            <label>
                Player Level:
                <input
                    type="number"
                    min="1"
                    max="20"
                    value={playerLevel}
                    onChange={onLevelChange}
                    className="ml-2 p-1 border rounded"
                />
            </label>
        );
    };

    // Helper function to render attribute inputs
    const renderAttributeInput = (
        label: string,
        value: number,
        onChange: (e: ChangeEvent<HTMLInputElement>) => void
    ) => {
        return (
            <label>
                {label}:
                <input
                    type="number"
                    value={value}
                    onChange={onChange}
                    className="ml-2 p-1 border rounded"
                />
            </label>
        );
    };

    return (
        <div className="flex flex-row">
            <div className="flex-1 bg-white shadow-md p-6 flex flex-col space-y-2">
                {/* Render Class Input */}
                {renderClassInput()}

                {/* Render Level Input */}
                {renderLevelInput()}

                {/* Render Attribute Inputs */}
                {renderAttributeInput("Strength", strength, onStrengthChange)}
                {renderAttributeInput("Dexterity", dexterity, onDexterityChange)}
                {renderAttributeInput("Constitution", constitution, onConstitutionChange)}
                {renderAttributeInput("Intelligence", intelligence, onIntelligenceChange)}
                {renderAttributeInput("Wisdom", wisdom, onWisdomChange)}
                {renderAttributeInput("Charisma", charisma, onCharismaChange)}
            </div>
            <div className="flex-1 bg-white shadow-md p-6 flex flex-col space-y-2">
                {/* Display calculated stats */}
                <p>Weapon Strike (1st): +{weaponStrike0}</p>
                <p>Weapon Strike (2nd): +{weaponStrike1}</p>
                <p>Weapon Strike (3rd): +{weaponStrike2}</p>
                <p>Spell Attack: +{spellAttack}</p>
                <p>Armor Class: {armorClass}</p>
                <p>Fortitude: +{fortitude}</p>
                <p>Reflex: +{reflex}</p>
                <p>Will: +{will}</p>
            </div>
        </div>
    );
};

export default PlayerCard;
