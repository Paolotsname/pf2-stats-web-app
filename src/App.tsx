import React, { useState, useEffect } from "react";
import "./index.css";
import PlayerCard from "./components/PlayerCard";
import EnemyCard from "./components/EnemyCard";
import PickAverageType from "./components/PickAverageType";
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
    const [averageType, setAverageType] = useState<string>("mean");
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
        setPlayers((players) => players.filter((_, i) => i !== index));
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
        setEnemies((enemies) => enemies.filter((_, i) => i !== index));
    };

    const updateEnemy = (index: number, updatedEnemy: Enemy) => {
        setEnemies((enemies) => {
            const newEnemies = [...enemies];
            newEnemies[index] = updatedEnemy;
            return newEnemies;
        });
    };

    return (
        <div className="p-6">
            <div className="flex bg-white shadow-md rounded-lg p-6 mb-6">
                <PWLCheckbox bool={proficiencyWithoutLevel} onChange={(checked) => setPwl(checked)} />
                <PickAverageType value={averageType} onChange={(value) => setAverageType(value)} />
            </div>

            <div className="flex flex-col space-y-4">
                <button onClick={addPlayer} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Add Player
                </button>

                {players.map((player, index) => (
                    <div key={index} className="flex flex-row space-x-4">
                        <PlayerCard
                            player={player}
                            onUpdate={(updatedPlayer) => updatePlayer(index, updatedPlayer)}
                        />
                        <button onClick={() => removePlayer(index)} className="bg-red-500 text-white px-4 py-2 rounded">
                            Remove Player
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex flex-col space-y-4 mt-8">
                <button onClick={addEnemy} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Add Enemy
                </button>

                {enemies.map((enemy, index) => (
                    <div key={index} className="flex flex-row space-x-4">
                        <EnemyCard
                            enemy={enemy}
                            onUpdate={(updatedEnemy) => updateEnemy(index, updatedEnemy)}
                        />
                        <button onClick={() => removeEnemy(index)} className="bg-red-500 text-white px-4 py-2 rounded">
                            Remove Enemy
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
