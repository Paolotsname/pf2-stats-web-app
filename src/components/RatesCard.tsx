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

// a target of 11.2 will have the same result as the weighted average of target = 11 and target = 12,
// where target 11 has a weight of 80% and 12 has a weight of 20%
function getD20Rates(
    proficiency: number | null,
    target: number | null,
    hasAdvantage: boolean,
    hasDisadvantage: boolean,
): [number, number, number, number] {
    if (proficiency === null || target === null) {
        return [0, 0, 0, 0];
    }

    // [2, 19]
    let diceFacesUsed = 0;

    // we calculate the minimum number on dice needed for
    // (proficiency bonus + dice rolled) to be for a crit
    let minToCrit = (target + 10) - proficiency;
    // we find how many faces on the dice up to 19 are crit hits
    // by subtracting the total of faces (19) by the amount that's
    // not crit hits
    //// this does mean that we are calculating the range from 19 to 1,
    //// but since we are clamping it down later,
    //// it will transform into a range from 19 to 2
    let sidesThatCritHit = 19 - (minToCrit - 1);
    // sides_that_crit_hit can't be less than 0
    // sides_that_crit_hit can't more than 18 (number of faces between 2 and 19)
    sidesThatCritHit = clamp(0, sidesThatCritHit, 18);
    // we save how many faces are crit hits, so when we find how many are at least normal hits
    // we can reduce the amount that are crit hits from it and find how many are normal hits
    diceFacesUsed += sidesThatCritHit;

    // then we repeat the logic for hits and fails, subtracting the sides that
    // already being accounted for for being enough for a better result

    let minToHit = target - proficiency;
    let sidesThatHit = 19 - (minToHit - 1) - diceFacesUsed;
    sidesThatHit = clamp(0, sidesThatHit, 18 - diceFacesUsed);
    diceFacesUsed += sidesThatHit;

    let minToFail = (target - 9) - proficiency;
    let sidesThatFail = 19 - (minToFail - 1) - diceFacesUsed;
    sidesThatFail = clamp(0, sidesThatFail, 18 - diceFacesUsed);
    diceFacesUsed += sidesThatFail;

    // sides_that_crit_fail will be the leftover faces
    let sidesThatCritFail = 18 - diceFacesUsed;

    // Nat 20 logic
    let nat20Value = proficiency + 20;
    // for when Nat 20 would had been at least a hit
    if (nat20Value > target - 1) {
        let percentageThatCritHit = nat20Value - (target - 1);
        percentageThatCritHit = clamp(0, percentageThatCritHit, 1);
        sidesThatCritHit += percentageThatCritHit;
        sidesThatHit += 1 - percentageThatCritHit;
    }
    // for when Nat 20 would had been at least a failure
    else if (nat20Value > (target - 1) - 9) {
        let percentageThatHit = nat20Value - (target - 1) + 9;
        percentageThatHit = clamp(0, percentageThatHit, 1);
        sidesThatHit += percentageThatHit;
        sidesThatFail += 1 - percentageThatHit;
    } else {
        sidesThatFail += 1;
    }

    // Nat 1 logic
    let nat1Value = proficiency + 1;
    if (nat1Value > (target - 1) + 10) {
        let percentageThatHit = nat1Value - (target - 1) - 9;
        percentageThatHit = clamp(0, percentageThatHit, 1);
        sidesThatCritHit += percentageThatHit;
        sidesThatHit += 1 - percentageThatHit;
    }
    // for when Nat 1 would had been at least a failure
    else if (nat1Value > (target - 1)) {
        let percentageThatFail = nat1Value - (target - 1);
        percentageThatFail = clamp(0, percentageThatFail, 1);
        sidesThatFail += percentageThatFail;
        sidesThatCritFail += 1 - percentageThatFail;
    } else {
        sidesThatCritFail += 1;
    }

    // Apply vantage (advantage or disadvantage)
    if (hasAdvantage) {
        [sidesThatCritFail, sidesThatFail, sidesThatHit, sidesThatCritHit] = advantagize([
            sidesThatCritFail / 20,
            sidesThatFail / 20,
            sidesThatHit / 20,
            sidesThatCritHit / 20,
        ]);
        return [
            Math.round(sidesThatCritFail * 100 * 100) / 100,
            Math.round(sidesThatFail * 100 * 100) / 100,
            Math.round(sidesThatHit * 100 * 100) / 100,
            Math.round(sidesThatCritHit * 100 * 100) / 100,
        ];
    } else if (hasDisadvantage) {
        [sidesThatCritFail, sidesThatFail, sidesThatHit, sidesThatCritHit] = disadvantagize([
            sidesThatCritFail / 20,
            sidesThatFail / 20,
            sidesThatHit / 20,
            sidesThatCritHit / 20,
        ]);
        return [
            Math.round(sidesThatCritFail * 100 * 100) / 100,
            Math.round(sidesThatFail * 100 * 100) / 100,
            Math.round(sidesThatHit * 100 * 100) / 100,
            Math.round(sidesThatCritHit * 100 * 100) / 100,
        ];
    }

    return [
        Math.round(sidesThatCritFail * 5 * 100) / 100,
        Math.round(sidesThatFail * 5 * 100) / 100,
        Math.round(sidesThatHit * 5 * 100) / 100,
        Math.round(sidesThatCritHit * 5 * 100) / 100,
    ];
}

function getSaveRates(
    prof: number,
    target: number,
    profLevel: number,
    hasAdvantage: boolean,
    hasDisadvantage: boolean
): [number, number, number, number] {
    let [cf, f, s, cs] = getD20Rates(prof, target, hasAdvantage, hasDisadvantage);
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

function advantagize(a: number[]): number[] {
    let answer = [0, 0, 0, 0];
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a.length; j++) {
            answer[Math.max(i, j)] += a[i] * a[j];
        }
    }
    return answer.map((x) => Math.round(x * 100000) / 100000);
}

function disadvantagize(a: number[]): number[] {
    let answer = [0, 0, 0, 0];
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a.length; j++) {
            answer[Math.min(i, j)] += a[i] * a[j];
        }
    }
    return answer.map((x) => Math.round(x * 100000) / 100000);
}

interface LineProps {
    title: string;
    rates: [number, number, number, number];
    isEven: boolean; // New prop to determine if the row is even or odd
}

const PositiveLine = ({ title, rates, isEven }: LineProps) => (
    <tr className={`${isEven ? 'bg-blue-50' : 'bg-white'} hover:bg-blue-100 transition-colors border-b border-gray-200`}>
        <td className="border-r border-gray-300 px-4 py-3 text-blue-900">{title}</td>
        <td className="border-r border-gray-300 px-4 py-3 text-red-500">{rates[0]}%</td>
        <td className="border-r border-gray-300 px-4 py-3 text-orange-500">{rates[1]}%</td>
        <td className="border-r border-gray-300 px-4 py-3 text-green-500">{rates[2]}%</td>
        <td className="border-r border-gray-300 px-4 py-3 text-blue-500">{rates[3]}%</td>
    </tr>
);

const NegativeLine = ({ title, rates, isEven }: LineProps) => (
    <tr className={`${isEven ? 'bg-red-50' : 'bg-white'} hover:bg-red-100 transition-colors border-b border-gray-200`}>
        <td className="border-r border-gray-300 px-4 py-3 text-red-900">{title}</td>
        <td className="border-r border-gray-300 px-4 py-3 text-blue-500">{rates[0]}%</td>
        <td className="border-r border-gray-300 px-4 py-3 text-green-500">{rates[1]}%</td>
        <td className="border-r border-gray-300 px-4 py-3 text-orange-500">{rates[2]}%</td>
        <td className="border-r border-gray-300 px-4 py-3 text-red-500">{rates[3]}%</td>
    </tr>
);

const RatesCard = ({ player, enemy }: RatesCardProps) => {
    const weapon_map0 = getD20Rates(player.weaponStrike0, enemy.ac, player.hasAdvantage, player.hasDisadvantage);
    const weapon_map1 = getD20Rates(player.weaponStrike1, enemy.ac, player.hasAdvantage, player.hasDisadvantage);
    const weapon_map2 = getD20Rates(player.weaponStrike2, enemy.ac, player.hasAdvantage, player.hasDisadvantage);
    const spell_that_target_ac_rates = getD20Rates(player.spellAttack, enemy.ac, player.hasAdvantage, player.hasDisadvantage);
    const player_save_against_spell_that_target_fort = getSaveRates(player.fortitude, enemy.spell_dc, player.saveSpecializationsLevels.fort, player.hasAdvantage, player.hasDisadvantage);
    const player_save_against_spell_that_target_reflex = getSaveRates(player.reflex, enemy.spell_dc, player.saveSpecializationsLevels.reflex, player.hasAdvantage, player.hasDisadvantage);
    const player_save_against_spell_that_target_will = getSaveRates(player.will, enemy.spell_dc, player.saveSpecializationsLevels.will, player.hasAdvantage, player.hasDisadvantage);

    const enemy_strike_rates_map0 = getD20Rates(enemy.attack_bonus, player.armorClass, enemy.hasAdvantage, enemy.hasDisadvantage);
    const enemy_strike_rates_map1 = getD20Rates(enemy.attack_bonus, player.armorClass, enemy.hasAdvantage, enemy.hasDisadvantage);
    const enemy_strike_rates_map2 = getD20Rates(enemy.attack_bonus, player.armorClass, enemy.hasAdvantage, enemy.hasDisadvantage);
    const spell_striked_rates = getD20Rates(player.armorClass, enemy.spell_attack_bonus, enemy.hasAdvantage, enemy.hasDisadvantage);
    const enemy_save_on_spell_that_target_fort_save_rates = getD20Rates(enemy.fort, player.spellAttack + 10, enemy.hasAdvantage, enemy.hasDisadvantage);
    const enemy_save_on_spell_that_target_reflex_save_rates = getD20Rates(enemy.reflex, player.spellAttack + 10, enemy.hasAdvantage, enemy.hasDisadvantage);
    const enemy_save_on_spell_that_target_will_save_rates = getD20Rates(enemy.will, player.spellAttack + 10, enemy.hasAdvantage, enemy.hasDisadvantage);

    const player_rates = [
        { title: "Weapon Strike 1", rates: weapon_map0 },
        { title: "Weapon Strike 2", rates: weapon_map1 },
        { title: "Weapon Strike 3", rates: weapon_map2 },
        { title: "Spell Attack", rates: spell_that_target_ac_rates },
        { title: "Fortitude Save", rates: player_save_against_spell_that_target_fort },
        { title: "Reflex Save", rates: player_save_against_spell_that_target_reflex },
        { title: "Will Save", rates: player_save_against_spell_that_target_will },
    ];
    const enemy_rates = [
        { title: "Enemy Strike 1", rates: enemy_strike_rates_map0 },
        { title: "Enemy Strike 2", rates: enemy_strike_rates_map1 },
        { title: "Enemy Strike 3", rates: enemy_strike_rates_map2 },
        { title: "Spell Striked", rates: spell_striked_rates },
        { title: "Enemy Fort Save", rates: enemy_save_on_spell_that_target_fort_save_rates },
        { title: "Enemy Reflex Save", rates: enemy_save_on_spell_that_target_reflex_save_rates },
        { title: "Enemy Will Save", rates: enemy_save_on_spell_that_target_will_save_rates },
    ];

    return (
        <div className="space-y-8 p-4 bg-gray-50 rounded-lg shadow-md">
            <table className="table-auto border border-gray-300 w-full bg-white rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-blue-200">
                    <tr>
                        <th className="border-r border-gray-300 px-4 py-3 text-left text-blue-900 font-semibold">Player Rolls</th>
                        <th className="border-r border-gray-300 px-4 py-3 text-blue-900 font-semibold">Critical Fail</th>
                        <th className="border-r border-gray-300 px-4 py-3 text-blue-900 font-semibold">Fail</th>
                        <th className="border-r border-gray-300 px-4 py-3 text-blue-900 font-semibold">Success</th>
                        <th className="border-r border-gray-300 px-4 py-3 text-blue-900 font-semibold">Critical Success</th>
                    </tr>
                </thead>
                <tbody>
                    {player_rates.map((rate, index) => (
                        <PositiveLine key={index} title={rate.title} rates={rate.rates} isEven={index % 2 === 0} />
                    ))}
                </tbody>
            </table>

            <table className="table-auto border border-gray-300 w-full bg-white rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-red-200">
                    <tr>
                        <th className="border-r border-gray-300 px-4 py-3 text-left text-red-900 font-semibold">Enemy Rolls</th>
                        <th className="border-r border-gray-300 px-4 py-3 text-red-900 font-semibold">Critical Fail</th>
                        <th className="border-r border-gray-300 px-4 py-3 text-red-900 font-semibold">Fail</th>
                        <th className="border-r border-gray-300 px-4 py-3 text-red-900 font-semibold">Success</th>
                        <th className="border-r border-gray-300 px-4 py-3 text-red-900 font-semibold">Critical Success</th>
                    </tr>
                </thead>
                <tbody>
                    {enemy_rates.map((rate, index) => (
                        <NegativeLine key={index} title={rate.title} rates={rate.rates} isEven={index % 2 === 0} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RatesCard;
