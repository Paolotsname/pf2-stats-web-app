import React, { ChangeEvent } from "react";
import { Player, PlayerStats, Enemy } from "../interfaces";

interface RatesCardProps {
    player: Player & PlayerStats;
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
    if (profLevel >= 1) {
        cs = s + cs;
        s = 0;
        if (profLevel >= 2) {
            f = cf + f;
            cf = 0;
        }
    }
    return [cf, f, s, cs];
}

const showRates = ({ array, isBad = false }: { array: [number, number, number, number]; isBad?: boolean }) => {
    const colors = isBad
        ? { critFail: "green", fail: "blue", success: "orange", critSuccess: "red" } // Bad rates color scheme
        : { critFail: "red", fail: "orange", success: "blue", critSuccess: "green" }; // Good rates color scheme

    return (
        <div className="flex flex-row gap-4">
            <h1 style={{ color: colors.critFail }}>Crit Fail: {array[0]}%</h1>
            <h1 style={{ color: colors.fail }}>Fail: {array[1]}%</h1>
            <h1 style={{ color: colors.success }}>Success: {array[2]}%</h1>
            <h1 style={{ color: colors.critSuccess }}>Crit Success: {array[3]}%</h1>
        </div>
    );
};

interface RateCardProps {
    title: string;
    rates: [number, number, number, number];
    isBad?: boolean;
}

const RateCard = ({ title, rates, isBad = false }: RateCardProps) => (
    <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {showRates({ array: rates, isBad })}
    </div>
);

const RatesCard = ({ player, enemy }: RatesCardProps) => {
    const weapon_map0 = getD20Rates(player.weaponStrike0, enemy.ac);
    const weapon_map1 = getD20Rates(player.weaponStrike1, enemy.ac);
    const weapon_map2 = getD20Rates(player.weaponStrike2, enemy.ac);
    const spell_that_target_ac_rates = getD20Rates(player.spellAttack, enemy.ac);
    const player_save_against_spell_that_target_fort = getSaveRates(player.fortitude, enemy.spell_dc, player.saveSpecializationsLevels.fort);
    const player_save_against_spell_that_target_reflex = getSaveRates(player.reflex, enemy.spell_dc, player.saveSpecializationsLevels.reflex);
    const player_save_against_spell_that_target_will = getSaveRates(player.will, enemy.spell_dc, player.saveSpecializationsLevels.will);

    const enemy_strike_rates_map0 = getD20Rates(enemy.attack_bonus, player.armorClass);
    const enemy_strike_rates_map1 = getD20Rates(enemy.attack_bonus, player.armorClass);
    const enemy_strike_rates_map2 = getD20Rates(enemy.attack_bonus, player.armorClass);
    const spell_striked_rates = getD20Rates(player.armorClass, enemy.spell_attack_bonus);
    const enemy_save_on_spell_that_target_fort_save_rates = getD20Rates(enemy.fort, player.spellAttack + 10);
    const enemy_save_on_spell_that_target_reflex_save_rates = getD20Rates(enemy.reflex, player.spellAttack + 10);
    const enemy_save_on_spell_that_target_will_save_rates = getD20Rates(enemy.will, player.spellAttack + 10);

    return (
        <div className="space-y-4">
            {/* Player Weapon Strike Rates */}
            <RateCard title="Player Weapon Strike Rates" rates={weapon_map0} />
            <RateCard title="Player Weapon Strike (-5) Rates" rates={weapon_map1} />
            <RateCard title="Player Weapon Strike (-10) Rates" rates={weapon_map2} />

            {/* Player Spell Targeting AC Rates */}
            <RateCard title="Player Spell Targeting AC Rates" rates={spell_that_target_ac_rates} />

            {/* Enemy Save vs Player Spell Rates */}
            <RateCard title="Player Fortitude Targeting Spell Rates" rates={enemy_save_on_spell_that_target_fort_save_rates} isBad />
            <RateCard title="Player Reflex Targeting Spell Rates" rates={enemy_save_on_spell_that_target_reflex_save_rates} isBad />
            <RateCard title="Player Will Targeting Spell Rates" rates={enemy_save_on_spell_that_target_will_save_rates} isBad />

            {/* Enemy Weapon Strike Rates */}
            <RateCard title="Enemy Weapon Strike Rates" rates={enemy_strike_rates_map0} isBad />
            <RateCard title="Enemy Weapon Strike (-5) Rates" rates={enemy_strike_rates_map1} isBad />
            <RateCard title="Enemy Weapon Strike (-10) Rates" rates={enemy_strike_rates_map2} isBad />

            {/* Enemy Spell Targeting AC Rates */}
            <RateCard title="Enemy Spell Targeting AC Rates" rates={spell_striked_rates} isBad />

            {/* Player Save vs Enemy Spell Rates */}
            <RateCard title="Enemy Fortitude Targeting Spell Rates" rates={player_save_against_spell_that_target_fort} />
            <RateCard title="Enemy Reflex Targeting Spell Rates" rates={player_save_against_spell_that_target_reflex} />
            <RateCard title="Enemy Will Targeting Spell Rates" rates={player_save_against_spell_that_target_will} />


        </div>
    );
};

export default RatesCard;
