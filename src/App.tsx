import React, { useState } from "react";
import "./index.css"; // Import the TailwindCSS file

import PickLevel from "./components/PickLevel";
import PickClass from "./components/PickClass";
import AttributeBonus from "./components/AttributeBonus";
import PickAverageType from "./components/PickAverageType";
import PWLCheckbox from "./components/PWLCheckbox";
// import classData from "./data/class_data.json";
import enemyData from "./data/enemy_data.json";

export default function App() {
    const [playerLevel, setPlayerLevel] = useState<number>(0);
    const [strength, setStrength] = useState<number>(0);
    const [dexterity, setDexterity] = useState<number>(0);
    const [constitution, setConstitution] = useState<number>(0);
    const [intelligence, setIntelligence] = useState<number>(0);
    const [wisdom, setWisdom] = useState<number>(0);
    const [charisma, setCharisma] = useState<number>(0);

    const [pwl, setPwl] = useState<boolean>(false);

    return (
        <div className="flex flex-col md:flex-row p-4">
            <div className="container-left flex-1">
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <PickClass />
                    <PickLevel
                        label="Player Level"
                        value={playerLevel}
                        onChange={(e) => setPlayerLevel(Number(e.target.value))}
                    />
                    <AttributeBonus
                        label="Strength"
                        value={strength}
                        onChange={(e) => setStrength(Number(e.target.value))}
                    />
                    <AttributeBonus
                        label="Dexterity"
                        value={dexterity}
                        onChange={(e) => setDexterity(Number(e.target.value))}
                    />
                    <AttributeBonus
                        label="Constitution"
                        value={constitution}
                        onChange={(e) => setConstitution(Number(e.target.value))}
                    />
                    <AttributeBonus
                        label="Intelligence"
                        value={intelligence}
                        onChange={(e) => setIntelligence(Number(e.target.value))}
                    />
                    <AttributeBonus
                        label="Wisdom"
                        value={wisdom}
                        onChange={(e) => setWisdom(Number(e.target.value))}
                    />
                    <AttributeBonus
                        label="Charisma"
                        value={charisma}
                        onChange={(e) => setCharisma(Number(e.target.value))}
                    />
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <PWLCheckbox
                        bool={pwl}
                        onChange={(e) => setPwl(Boolean(e.target.checked))}
                    />
                    <PickAverageType />
                </div>
            </div>
            <div className="flex-1 ml-0 md:ml-6">
                <h1 className="text-2xl font-bold mb-4">Class Data</h1>
                <h1 className="text-lg">Enemy level {playerLevel - 2}: {enemyData[playerLevel].mean.hp}</h1>
                <h1 className="text-lg">Enemy level {playerLevel - 1}: {enemyData[playerLevel + 1].mean.hp}</h1>
                <h1 className="text-lg">Enemy level {playerLevel + 0}: {enemyData[playerLevel + 2].mean.hp}</h1>
                <h1 className="text-lg">Enemy level {playerLevel + 1}: {enemyData[playerLevel + 3].mean.hp}</h1>
                <h1 className="text-lg">Enemy level {playerLevel + 2}: {enemyData[playerLevel + 4].mean.hp}</h1>
            </div>
        </div>
    );
}
