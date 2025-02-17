import React, { useState, useEffect } from "react";
import "./index.css";
import PlayerCard from "./components/PlayerCard";
import EnemyCard from "./components/EnemyCard";
import RatesCard from "./components/RatesCard";
import PickAverageType from "./components/PickAverageType";
import PickShowType from "./components/PickShowType";
import PWLCheckbox from "./components/PWLCheckbox";
import classData from "./data/class_data.json";
import enemyData from "./data/enemy_data.json";
import { Player, PlayerStats, PlayerStatsCombided, Enemy } from "./interfaces";

const initialPlayer: Player = {
    playerClass: "Alchemist",
    playerLevel: 1,
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
    itemBonusWeapon: 0,
    itemArmor: 0,
    itemBonusArmor: 0,
    itemBonusSaves: 0,
    itemDexCap: 0,
};

const getInitialEnemy = (playerLevel: number, averageType: string, pwl: boolean): Enemy => {
    return getEnemyStats(playerLevel, averageType, pwl);
};

const calculatePlayerStats = (player: Player, pwl: boolean): PlayerStats => {
    const { playerClass, playerLevel, strength, dexterity, constitution, wisdom, charisma, itemBonusWeapon, itemArmor, itemBonusArmor, itemBonusSaves, itemDexCap } = player;
    const proficiencies = classData[playerClass]["proficiencies"][playerLevel - 1];
    const saveSpecializations = classData[playerClass]["saveSpecialization"]

    const levelBonus = pwl ? 0 : playerLevel;

    // Helper function to calculate save specialization level
    const calculateSaveLevel = (level: number, [threshold1, threshold2]: [number, number]): number => {
        if (level >= threshold2) return 2;
        if (level >= threshold1) return 1;
        return 0;
    };

    return {
        weaponStrike0: proficiencies[0] + strength + itemBonusWeapon + levelBonus,
        weaponStrike1: proficiencies[0] + strength + itemBonusWeapon - 5 + levelBonus,
        weaponStrike2: proficiencies[0] + strength + itemBonusWeapon - 10 + levelBonus,
        spellAttack: proficiencies[1] ? proficiencies[1] + charisma + levelBonus : 0,
        armorClass: proficiencies[2] + 10 + Math.min(dexterity, itemDexCap) + itemArmor + itemBonusArmor + levelBonus,
        fortitude: proficiencies[3] + constitution + itemBonusSaves + levelBonus,
        reflex: proficiencies[4] + dexterity + itemBonusSaves + levelBonus,
        will: proficiencies[5] + wisdom + itemBonusSaves + levelBonus,
        saveSpecializationsLevels: {
            fort: calculateSaveLevel(playerLevel, saveSpecializations["fort"]),
            refl: calculateSaveLevel(playerLevel, saveSpecializations["refl"]),
            will: calculateSaveLevel(playerLevel, saveSpecializations["will"]),
        },
    };
};

const getEnemyStats = (level: number, averageType: string, pwl: boolean): Enemy => {
    const realAverageType = pwl ? averageType + "_pwl" : averageType
    const data = enemyData[level + 1][realAverageType];

    return {
        level: level,
        hp: data.hp,
        ac: data.ac,
        fort: data.fort,
        refl: data.refl,
        will: data.will,
        attack_bonus: data.attack_bonus,
        spell_dc: data.spell_dc,
        spell_attack_bonus: data.spell_attack_bonus,
    };
};

export default function App() {
    const [players, setPlayers] = useState<(PlayerStatsCombided)[]>([{ ...initialPlayer, ...calculatePlayerStats(initialPlayer, false) }]);
    const [enemies, setEnemies] = useState<Enemy[]>([getInitialEnemy(initialPlayer.playerLevel, "mean", false)]);
    const [averageType, setAverageType] = useState<string>("mean");
    const [showType, setShowType] = useState<string>("1 player")
    const [proficiencyWithoutLevel, setProficiencyWithoutLevel] = useState<boolean>(false);

    // Update player stats when `proficiencyWithoutLevel` changes
    useEffect(() => {
        setPlayers((players) =>
            players.map((player) => ({
                ...player,
                ...calculatePlayerStats(player, proficiencyWithoutLevel),
            }))
        );
    }, [proficiencyWithoutLevel]);

    // Update enemy stats when `averageType`, `proficiencyWithoutLevel`, or the first player's level changes
    useEffect(() => {
        if (players.length > 0) {
            const firstPlayerLevel = players[0].playerLevel;
            setEnemies([getInitialEnemy(firstPlayerLevel, averageType, proficiencyWithoutLevel)]);
        }
    }, [averageType, proficiencyWithoutLevel, players]);

    const addPlayer = () => {
        const newPlayer = { ...initialPlayer, ...calculatePlayerStats(initialPlayer, proficiencyWithoutLevel) };
        setPlayers((players) => [...players, newPlayer]);
    };

    const removePlayer = (index: number) => {
        if (players.length === 1) {
            const newPlayer = { ...initialPlayer, ...calculatePlayerStats(initialPlayer, proficiencyWithoutLevel) };
            setPlayers([newPlayer]);
        } else {
            setPlayers((players) => players.filter((_, i) => i !== index))
        }
    };

    const resetPlayer = (index: number) => {
        // Create a new player object with initial stats and recalculated stats
        const newPlayer = {
            ...initialPlayer,
            ...calculatePlayerStats(initialPlayer, proficiencyWithoutLevel)
        };

        // Create a new array with the updated player
        const newPlayers = players.map((player, i) =>
            i === index ? newPlayer : player
        );

        // Update the state with the new array
        setPlayers(newPlayers);
    };

    const updatePlayer = (index: number, updatedPlayer: Player) => {
        setPlayers((players) => {
            const newPlayers = [...players];
            newPlayers[index] = { ...updatedPlayer, ...calculatePlayerStats(updatedPlayer, proficiencyWithoutLevel) };
            return newPlayers;
        });
    };

    const addEnemy = () => {
        if (players.length > 0) {
            const firstPlayerLevel = players[0].playerLevel;
            const newEnemy = getEnemyStats(firstPlayerLevel, averageType, proficiencyWithoutLevel);
            setEnemies((enemies) => [...enemies, newEnemy]);
        }
    };

    const removeEnemy = (index: number) => {
        if (enemies.length == 1) {
            const firstPlayerLevel = players[0].playerLevel;
            const newEnemy = getEnemyStats(firstPlayerLevel, averageType, proficiencyWithoutLevel);
            setEnemies([newEnemy]);
        } else {
            setEnemies((enemies) => enemies.filter((_, i) => i !== index));
        }
    };

    const updateEnemy = (index: number, updatedEnemy: Enemy) => {
        setEnemies((enemies) => {
            const newEnemies = [...enemies];
            newEnemies[index] = updatedEnemy;
            return newEnemies;
        });
    };

    let calculator;
    if (showType === "1 player") {
        calculator = (
            <div className="flex flex-row space-x-4 items-start"> {/* Updated to space-x-4 and items-start */}
                <div id="singlePlayer" className="flex flex-row space-x-1 border-2 border-gray-500 p-2 rounded-lg">
                    <div className="flex flex-col space-y-1">
                        <button onClick={() => resetPlayer(0)} className="bg-orange-500 text-white px-4 py-2 rounded w-32">
                            Reset Player
                        </button>
                    </div>
                    <PlayerCard
                        player={players[0]}
                        onUpdate={(updatedPlayer) => updatePlayer(0, updatedPlayer)}
                    />
                </div>
                <div className="flex flex-col space-y-4">
                    {enemies.map((enemy, index) => (
                        <div key={index} className="flex border-2 border-gray-500 p-2 rounded-lg">
                            <RatesCard
                                player={players[0]}
                                enemy={enemy}
                            />
                        </div>
                    ))}
                </div>
                <div id="enemyList" className="flex flex-col space-y-4">
                    {enemies.map((enemy, index) => (
                        <div key={index} className="flex border-2 border-gray-500 p-2 rounded-lg">
                            <div id="enemyCard" className="flex flex-row space-x-1">
                                <EnemyCard
                                    enemy={enemy}
                                    onUpdate={(updatedEnemy) => updateEnemy(index, updatedEnemy)}
                                />
                                <div className="flex flex-col space-y-1">
                                    <button
                                        onClick={() => removeEnemy(index)}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Remove Enemy
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button onClick={addEnemy} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Add Enemy
                    </button>
                </div>
            </div>
        );
    } else if (showType === "x players") {
        calculator = (
            <div className="flex flex-row space-x-4 items-start"> {/* Updated to space-x-4 and items-start */}
                <div id="playerList" className="flex flex-col space-y-4">
                    {players.map((player, index) => (
                        <div key={index} className="flex border-2 border-gray-500 p-2 rounded-lg">
                            <div id="playerCard" className="flex flex-row space-x-1">
                                <div className="flex flex-col space-y-1 w-32">
                                    <button onClick={() => resetPlayer(index)} className="bg-orange-500 text-white px-4 py-2 rounded w-full">
                                        Reset Player
                                    </button>
                                    <button onClick={() => removePlayer(index)} className="bg-red-500 text-white px-4 py-2 rounded w-full">
                                        Remove Player
                                    </button>
                                </div>
                                <PlayerCard
                                    player={player}
                                    onUpdate={(updatedPlayer) => updatePlayer(index, updatedPlayer)}
                                />
                            </div>
                        </div>
                    ))}
                    <button onClick={addPlayer} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Add Player
                    </button>
                </div>
                <div className="flex flex-col space-y-4">
                    {players.map((player, index) => (
                        <div key={index} className="flex border-2 border-gray-500 p-2 rounded-lg">
                            <RatesCard
                                player={player}
                                enemy={enemies[0]}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex flex-col space-y-4">
                    <div className="flex border-2 border-gray-500 p-2 rounded-lg">
                        <EnemyCard
                            enemy={enemies[0]}
                            onUpdate={(updatedEnemy) => updateEnemy(0, updatedEnemy)}
                        />
                    </div>
                </div>
            </div>
        );
    } else if (showType === "simple calculator") {
        calculator = <h1> :3 </h1>;
    }

    return (
        <div className="p-6">
            <div className="flex bg-white shadow-md rounded-lg p-6 mb-6">
                <PWLCheckbox bool={proficiencyWithoutLevel} onChange={(checked) => setProficiencyWithoutLevel(checked)} />
                <PickAverageType value={averageType} onChange={(value) => setAverageType(value)} />
                <PickShowType value={showType} onChange={(value) => setShowType(value)} />
            </div>
            {calculator}
        </div>
    );
}
