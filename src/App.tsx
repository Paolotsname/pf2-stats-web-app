import React, { useState, useEffect } from "react";
import "./index.css";
import PlayerCard from "./components/PlayerCard";
import PickAverageType from "./components/PickAverageType";
import PWLCheckbox from "./components/PWLCheckbox";

// classData has proficiencies in this order:
// weapon, spellcasting, armor, fortitude, reflex, will
import classData from "./data/class_data.json";

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

export default function App() {
    const [players, setPlayers] = useState<Player[]>([
        {
            playerClass: "Alchemist",
            playerLevel: 1,
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0,
            weaponStrike0: 0,
            weaponStrike1: 0,
            weaponStrike2: 0,
            spellAttack: 0,
            armorClass: 0,
            fortitude: 0,
            reflex: 0,
            will: 0,
        },
    ]);
    const [proficiencyWithoutLevel, setPwl] = useState<boolean>(false);

    const calculateStats = (player: Player) => {
        const { playerClass, playerLevel, strength, dexterity, constitution, wisdom, charisma } = player;
        let weaponStrike0 = classData[playerClass][playerLevel - 1][0] + strength;
        let weaponStrike1 = classData[playerClass][playerLevel - 1][0] + strength - 5;
        let weaponStrike2 = classData[playerClass][playerLevel - 1][0] + strength - 10;
        let spellAttack = classData[playerClass][playerLevel - 1][1] + charisma;
        let armorClass = classData[playerClass][playerLevel - 1][2] + 10 + dexterity;
        let fortitude = classData[playerClass][playerLevel - 1][3] + constitution;
        let reflex = classData[playerClass][playerLevel - 1][4] + dexterity;
        let will = classData[playerClass][playerLevel - 1][5] + wisdom;

        if (!proficiencyWithoutLevel) {
            weaponStrike0 += playerLevel;
            weaponStrike1 += playerLevel;
            weaponStrike2 += playerLevel;
            spellAttack += (classData[playerClass][playerLevel - 1][1] != 0) ? playerLevel : 0;
            armorClass += playerLevel;
            fortitude += playerLevel;
            reflex += playerLevel;
            will += playerLevel;
        }

        return { weaponStrike0, weaponStrike1, weaponStrike2, spellAttack, armorClass, fortitude, reflex, will };
    };

    // Recalculate stats for all players when pwl changes
    useEffect(() => {
        const updatedPlayers = players.map((player) => {
            const stats = calculateStats(player);
            return { ...player, ...stats };
        });
        setPlayers(updatedPlayers);
    }, [proficiencyWithoutLevel]); // Trigger when pwl changes

    // Handler to add a new player
    const addPlayer = () => {
        const newPlayer = {
            playerClass: "Alchemist",
            playerLevel: 1,
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0,
            ...calculateStats({
                playerClass: "Alchemist",
                playerLevel: 1,
                strength: 0,
                dexterity: 0,
                constitution: 0,
                intelligence: 0,
                wisdom: 0,
                charisma: 0,
            }),
        };
        setPlayers([...players, newPlayer]);
    };

    // Handler to remove a player
    const removePlayer = (index: number) => {
        const newPlayers = players.filter((_, i) => i !== index);
        setPlayers(newPlayers);
    };

    // Handler to update a player's data
    const updatePlayer = (index: number, updatedPlayer: Player) => {
        const newPlayers = [...players];
        const stats = calculateStats(updatedPlayer); // Recalculate stats
        newPlayers[index] = { ...updatedPlayer, ...stats }; // Update player with new stats
        setPlayers(newPlayers);
    };

    return (
        <div className="p-6">
            <div className="flex bg-white shadow-md rounded-lg p-6 mb-6">
                <PWLCheckbox
                    bool={proficiencyWithoutLevel}
                    onChange={(e) => setPwl(e.target.checked)}
                />
                <PickAverageType />
            </div>

            <div className="flex flex-col space-y-4">
                <button
                    onClick={addPlayer}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add Player
                </button>

                {players.map((player, index) => (
                    <div key={index} className="flex flex-row space-x-4">
                        <PlayerCard
                            player={player}
                            onClassChange={(e) =>
                                updatePlayer(index, {
                                    ...player,
                                    playerClass: e.target.value,
                                })
                            }
                            onLevelChange={(e) =>
                                updatePlayer(index, {
                                    ...player,
                                    playerLevel: Number(e.target.value),
                                })
                            }
                            onStrengthChange={(e) =>
                                updatePlayer(index, {
                                    ...player,
                                    strength: Number(e.target.value),
                                })
                            }
                            onDexterityChange={(e) =>
                                updatePlayer(index, {
                                    ...player,
                                    dexterity: Number(e.target.value),
                                })
                            }
                            onConstitutionChange={(e) =>
                                updatePlayer(index, {
                                    ...player,
                                    constitution: Number(e.target.value),
                                })
                            }
                            onIntelligenceChange={(e) =>
                                updatePlayer(index, {
                                    ...player,
                                    intelligence: Number(e.target.value),
                                })
                            }
                            onWisdomChange={(e) =>
                                updatePlayer(index, {
                                    ...player,
                                    wisdom: Number(e.target.value),
                                })
                            }
                            onCharismaChange={(e) =>
                                updatePlayer(index, {
                                    ...player,
                                    charisma: Number(e.target.value),
                                })
                            }
                        />
                        <button
                            onClick={() => removePlayer(index)}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Remove Player
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
