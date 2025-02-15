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

interface RatesCardProps {
    player: Player;
    enemy: Enemy;
}

function clamp(minValue: number, n: number, maxValue: number): number {
    if (n < minValue) {
        return minValue;
    } else if (n > maxValue) {
        return maxValue;
    } else {
        return n;
    }
}

function getD20Rates(proficiency: number | null, target: number | null): [number, number, number, number] {
    if (proficiency === null || target === null) {
        console.log("enemy has null value");
        return [0, 0, 0, 0];
    }

    let diceFacesUsed = 0;

    let minToCrit = (target + 10) - proficiency;
    let sidesThatCritHit = 19 - (minToCrit - 1);
    sidesThatCritHit = clamp(0, sidesThatCritHit, 18);
    diceFacesUsed += sidesThatCritHit;

    let minToHit = target - proficiency;
    let sidesThatHit = 19 - (minToHit - 1) - diceFacesUsed;
    sidesThatHit = clamp(0, sidesThatHit, 18 - diceFacesUsed);
    diceFacesUsed += sidesThatHit;

    let minToFail = (target - 9) - proficiency;
    let sidesThatFail = 19 - (minToFail - 1) - diceFacesUsed;
    sidesThatFail = clamp(0, sidesThatFail, 18 - diceFacesUsed);
    diceFacesUsed += sidesThatFail;

    let sidesThatCritFail = 18 - diceFacesUsed;

    // Nat 20
    let Nat20Value = proficiency + 20;
    if (Nat20Value > target - 1) {
        let percentageThatCritHit = Nat20Value - (target - 1);
        percentageThatCritHit = clamp(0, percentageThatCritHit, 1);
        sidesThatCritHit += percentageThatCritHit;
        sidesThatHit += 1 - percentageThatCritHit;
    } else if (Nat20Value > (target - 1) - 9) {
        let percentageThatHit = Nat20Value - (target - 1) + 9;
        percentageThatHit = clamp(0, percentageThatHit, 1);
        sidesThatHit += percentageThatHit;
        sidesThatFail += 1 - percentageThatHit;
    } else {
        sidesThatFail += 1;
    }

    // Nat 1
    let Nat1Value = proficiency + 1;
    if (Nat1Value > (target - 1) + 10) {
        let percentageThatHit = Nat1Value - (target - 1) - 9;
        percentageThatHit = clamp(0, percentageThatHit, 1);
        sidesThatCritHit += percentageThatHit;
        sidesThatHit += 1 - percentageThatHit;
    } else if (Nat1Value > (target - 1)) {
        let percentageThatFail = Nat1Value - (target - 1);
        percentageThatFail = clamp(0, percentageThatFail, 1);
        sidesThatFail += percentageThatFail;
        sidesThatCritFail += 1 - percentageThatFail;
    } else {
        sidesThatCritFail += 1;
    }

    return [
        Math.round(sidesThatCritFail * 5 * 100) / 100,
        Math.round(sidesThatFail * 5 * 100) / 100,
        Math.round(sidesThatHit * 5 * 100) / 100,
        Math.round(sidesThatCritHit * 5 * 100) / 100,
    ];
}

function getSaveRates(prof: number, target: number, profLevel: number): [number, number, number, number] {
    let [cf, f, s, cs] = getD20Rates(prof, target);
    if (profLevel >= 6) {
        cs = s + cs;
        s = 0;
        if (profLevel >= 8) {
            f = cf + f;
            cf = 0;
        }
    }
    return [cf, f, s, cs];
}

function getStrikeRates(
    prof: number,
    target: number,
    agile: number = 0
): [[number, number, number, number], [number, number, number, number], [number, number, number, number]] {
    let weaponRates0 = getD20Rates(prof, target);
    let weaponRates1 = getD20Rates(prof - 5 + agile, target);
    let weaponRates2 = getD20Rates(prof - 10 + (agile * 2), target);
    return [weaponRates0, weaponRates1, weaponRates2];
}

const RatesCard = ({ player, enemy }: RatesCardProps) => {
    const weapon_map0 = getStrikeRates(player.weaponStrike0, enemy.ac)
    const weapon_map1 = getStrikeRates(player.weaponStrike1, enemy.ac)
    const weapon_map2 = getStrikeRates(player.weaponStrike2, enemy.ac)
    /*    const spell_that_target_ac_rates = getStrikeRates(player.
            const save_against_spell_that_target_fort = getStrikeRates(player.
            const save_against_spell_that_target_reflex = getStrikeRates(player.
            const save_against_spell_that_target_will = getStrikeRates(player.
            const striked_rates = getStrikeRates(player.
            const spell_striked_rates = getStrikeRates(player.
            const spell_that_target_fort_save_rates = getStrikeRates(player.
            const spell_that_target_reflex_save_rates = getStrikeRates(player.
            const spell_that_target_will_save_rates = getStrikeRates(player. */

    return <h1> {weapon_map0, weapon_map1, weapon_map2} </h1>
};

export default RatesCard;
