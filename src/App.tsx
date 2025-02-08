import React, { useState } from "react";
import "./styles.css";

import PickLevel from "./components/PickLevel";
import PickClass from "./components/PickClass";
import AttributeBonus from "./components/AttributeBonus";
import PickAverageType from "./components/PickAverageType"
import PWLCheckbox from "./components/PWLCheckbox"
import classData from "./data/class_data.json"
import enemyData from "./data/enemy_data.json"

export default function App() {
    const [playerLevel, setPlayerLevel] = useState<number>(0);
    const [strength, setStrengh] = useState<number>(0);
    const [dexterity, setDexterity] = useState<number>(0);
    const [constitution, setConstitution] = useState<number>(0);
    const [intelligence, setIntelligence] = useState<number>(0);
    const [wisdom, setWisdom] = useState<number>(0);
    const [charisma, setCharisma] = useState<number>(0);

    const [pwl, setPwl] = useState<boolean>(false);

    return (
        <div>
            <div className="container-left">
                <div className="box">
                    <PickClass />
                    <PickLevel
                        label="Player Level"
                        value={playerLevel}
                        onChange={(e) => setPlayerLevel(Number(e.target.value))}
                    />
                    <AttributeBonus
                        label="Strengh"
                        value={strength}
                        onChange={(e) => setStrengh(Number(e.target.value))}
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
                <div className="box">
                    <PWLCheckbox
                        bool={pwl}
                        onChange={(e) => setPwl(Boolean(e.target.checked))} />
                    <PickAverageType />
                </div>
            </div>
            <div>
                <h1>enemy level {playerLevel - 2}: {enemyData[playerLevel].mean.hp}</h1>
                <h1>enemy level {playerLevel - 1}: {enemyData[playerLevel + 1].mean.hp}</h1>
                <h1>enemy level {playerLevel + 0}: {enemyData[playerLevel + 2].mean.hp}</h1>
                <h1>enemy level {playerLevel + 1}: {enemyData[playerLevel + 3].mean.hp}</h1>
                <h1>enemy level {playerLevel + 2}: {enemyData[playerLevel + 4].mean.hp}</h1>
            </div>
        </div>
    );
}
