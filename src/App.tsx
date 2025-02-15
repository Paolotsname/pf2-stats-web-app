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

interface Player {
    playerClass: string;
    playerLevel: number;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
}

interface PlayerStats {
    weaponStrike0: number;
    weaponStrike1: number;
    weaponStrike2: number;
    spellAttack: number;
    armorClass: number;
    fortitude: number;
    reflex: number;
    will: number;
}

const initialPlayer: Player = {
    playerClass: "Alchemist",
    playerLevel: 1,
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
};

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

interface Rates {
    weapon_map0: number;
    weapon_map1: number;
    weapon_map2: number;
    spell_that_target_ac_rates: number;
    save_against_spell_that_target_fort: number;
    save_against_spell_that_target_reflex: number;
    save_against_spell_that_target_will: number;
    striked_rates: number;
    spell_striked_rates: number;
    spell_that_target_fort_save_rates: number;
    spell_that_target_reflex_save_rates: number;
    spell_that_target_will_save_rates: number;
}

const initialRates: Rates = {
    weapon_map0: 0,
    weapon_map1: 0,
    weapon_map2: 0,
    spell_that_target_ac_rates: 0,
    save_against_spell_that_target_fort: 0,
    save_against_spell_that_target_reflex: 0,
    save_against_spell_that_target_will: 0,
    striked_rates: 0,
    spell_striked_rates: 0,
    spell_that_target_fort_save_rates: 0,
    spell_that_target_reflex_save_rates: 0,
    spell_that_target_will_save_rates: 0,
}

const getInitialEnemy = (playerLevel: number, averageType: string, pwl: boolean): Enemy => {
    return getEnemyStats(playerLevel, averageType, pwl);
};

const calculatePlayerStats = (player: Player, pwl: boolean): PlayerStats => {
    const { playerClass, playerLevel, strength, dexterity, constitution, wisdom, charisma } = player;
    const proficiencies = classData[playerClass][playerLevel - 1];

    const levelBonus = pwl ? 0 : playerLevel;

    return {
        weaponStrike0: proficiencies[0] + strength + levelBonus,
        weaponStrike1: proficiencies[0] + strength - 5 + levelBonus,
        weaponStrike2: proficiencies[0] + strength - 10 + levelBonus,
        spellAttack: proficiencies[1] ? proficiencies[1] + charisma + levelBonus : 0,
        armorClass: proficiencies[2] + 10 + dexterity + levelBonus,
        fortitude: proficiencies[3] + constitution + levelBonus,
        reflex: proficiencies[4] + dexterity + levelBonus,
        will: proficiencies[5] + wisdom + levelBonus,
    };
};

const getEnemyStats = (level: number, averageType: string, pwl: boolean): Enemy => {
    const realAverageType = pwl ? averageType : averageType + "_pwl"
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
    const [players, setPlayers] = useState<(Player & PlayerStats)[]>([{ ...initialPlayer, ...calculatePlayerStats(initialPlayer, false) }]);
    const [enemies, setEnemies] = useState<Enemy[]>([getInitialEnemy(initialPlayer.playerLevel, "mean", false)]);
    const [rates, setRates] = useState<Rates[]>([initialRates]);
    const [averageType, setAverageType] = useState<string>("mean");
    const [showType, setShowType] = useState<string>("1 player")
    const [proficiencyWithoutLevel, setPwl] = useState<boolean>(false);

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
    /*
        const addRates = () => {
            const newRates = initialRates;
            setRates((rates) => [...rates, newRates]);
        };

        const removeRates = (index: number) => {
            setRates((rates) => rates.filter((_, i) => i !== index))
        };
    */
    const updateRates = (index: number, updatedRates: Rates) => {
        setRates((rates) => {
            const newRates = [...rates];
            newRates[index] = updatedRates;
            return newRates
        })
    }

    let calculator;
    if (showType === "1 player") {
        calculator = (
            <div className="flex flex-row space-y-4">
                <div id="singlePlayer" className="flex flex-row space-x-1">
                    <button onClick={() => resetPlayer(0)} className="bg-orange-500 text-white px-4 py-2 rounded">
                        Reset Player
                    </button>
                    <PlayerCard
                        player={players[0]}
                        onUpdate={(updatedPlayer) => updatePlayer(0, updatedPlayer)}
                    />
                </div>
                <div id="ratesList" className="flex flex-col space-y-1 mt-8">
                    {enemies.map((enemy, index) => (
                        <div id="rateCard" key={index} className="flex flex-row space-x-1">
                            <RatesCard
                                player={players[0]}
                                enemy={enemy}
                            />
                        </div>
                    ))}
                </div>
                <div id="enemyList" className="flex flex-col space-y-1 mt-8">
                    {enemies.map((enemy, index) => (
                        <div id="enemyCard" key={index} className="flex flex-row space-x-1">
                            <EnemyCard
                                enemy={enemy}
                                onUpdate={(updatedEnemy) => updateEnemy(index, updatedEnemy)}
                            />
                            <button onClick={() => removeEnemy(index)} className="bg-red-500 text-white px-4 py-2 rounded">
                                Remove Enemy
                            </button>
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
            <div className="flex flex-row space-y-4">
                <div id="playerList" className="flex flex-col">
                    {players.map((player, index) => (
                        <div id="playerCard" key={index} className="flex flex-row space-x-1">
                            <div className="flex flex-col">
                                <button onClick={() => resetPlayer(index)} className="bg-orange-500 text-white px-4 py-2 rounded">
                                    Reset Player
                                </button>
                                <button onClick={() => removePlayer(index)} className="bg-red-500 text-white px-4 py-2 rounded">
                                    Remove Player
                                </button>
                            </div>
                            <PlayerCard
                                player={player}
                                onUpdate={(updatedPlayer) => updatePlayer(index, updatedPlayer)}
                            />
                        </div>
                    ))}
                    <button onClick={addPlayer} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Add Player
                    </button>
                </div>
                <div className="flex flex-col space-y-4 mt-8">
                    <div className="flex flex-row space-x-4">
                        <EnemyCard
                            enemy={enemies[0]}
                            onUpdate={(updatedEnemy) => updateEnemy(0, updatedEnemy)}
                        />
                    </div>
                </div>
            </div>
        );
    } else if (showType === "simple calculator") {
        calculator = <h1> :3 </h1>; // Add return statement
    }

    return (
        <div className="p-6">
            <div className="flex bg-white shadow-md rounded-lg p-6 mb-6">
                <PWLCheckbox bool={proficiencyWithoutLevel} onChange={(checked) => setPwl(checked)} />
                <PickAverageType value={averageType} onChange={(value) => setAverageType(value)} />
                <PickShowType value={showType} onChange={(value) => setShowType(value)} />
            </div>
            {calculator}
        </div>
    );
}
