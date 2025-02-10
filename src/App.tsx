import React, { useState, useEffect } from "react";
import "./index.css";
import PlayerCard from "./components/PlayerCard";
import PickAverageType from "./components/PickAverageType";
import PWLCheckbox from "./components/PWLCheckbox";
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
    weaponStrike0: number; // Add weaponStrike0
    weaponStrike1: number; // Add weaponStrike1
    weaponStrike2: number; // Add weaponStrike2
    spellStrike: number; // Add spellStrike
    defendChance: number; // Add defendChance
    fortitude: number; // Add fortitude
    reflex: number; // Add reflex
    will: number; // Add will
}

export default function App() {
    const [players, setPlayers] = useState<Player[]>([
        {
            playerClass: "alchemist",
            playerLevel: 1,
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0,
            weaponStrike0: classData["alchemist"][0][0] + 0, // Initial weaponStrike0
            weaponStrike1: classData["alchemist"][0][0] + 0 - 5, // Initial weaponStrike1
            weaponStrike2: classData["alchemist"][0][0] + 0 - 10, // Initial weaponStrike2
            spellStrike: classData["alchemist"][0][1] + 0, // Initial spellStrike
            defendChance: classData["alchemist"][0][2] + 0, // Initial defendChance
            fortitude: classData["alchemist"][0][3] + 0, // Initial fortitude
            reflex: classData["alchemist"][0][4] + 0, // Initial reflex
            will: classData["alchemist"][0][5] + 0, // Initial will
        },
    ]);
    const [pwl, setPwl] = useState<boolean>(false);

    // Helper function to calculate stats
    const calculateStats = (player: Player) => {
        const { playerClass, playerLevel, strength, dexterity, constitution, wisdom, charisma } = player;
        let weaponStrike0 = classData[playerClass][playerLevel - 1][0] + strength;
        let weaponStrike1 = classData[playerClass][playerLevel - 1][0] + strength - 5;
        let weaponStrike2 = classData[playerClass][playerLevel - 1][0] + strength - 10;
        let spellStrike = classData[playerClass][playerLevel - 1][1] + charisma;
        let defendChance = classData[playerClass][playerLevel - 1][2] + dexterity;
        let fortitude = classData[playerClass][playerLevel - 1][3] + constitution;
        let reflex = classData[playerClass][playerLevel - 1][4] + dexterity;
        let will = classData[playerClass][playerLevel - 1][5] + wisdom;

        // Add playerLevel to stats if pwl is false
        if (!pwl) {
            weaponStrike0 += playerLevel;
            weaponStrike1 += playerLevel;
            weaponStrike2 += playerLevel;
            spellStrike += playerLevel;
            defendChance += playerLevel;
            fortitude += playerLevel;
            reflex += playerLevel;
            will += playerLevel;
        }

        return { weaponStrike0, weaponStrike1, weaponStrike2, spellStrike, defendChance, fortitude, reflex, will };
    };

    // Recalculate stats for all players when pwl changes
    useEffect(() => {
        const updatedPlayers = players.map((player) => {
            const stats = calculateStats(player);
            return { ...player, ...stats };
        });
        setPlayers(updatedPlayers);
    }, [pwl]); // Trigger when pwl changes

    // Handler to add a new player
    const addPlayer = () => {
        const newPlayer = {
            playerClass: "alchemist",
            playerLevel: 1,
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0,
            ...calculateStats({
                playerClass: "alchemist",
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
                    bool={pwl}
                    onChange={(e) => setPwl(e.target.checked)}
                />
                <PickAverageType />
            </div>

            <div className="flex flex-col space-y-4">
                {/* Button to add a new player */}
                <button
                    onClick={addPlayer}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add Player
                </button>

                {/* Render PlayerCards */}
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
