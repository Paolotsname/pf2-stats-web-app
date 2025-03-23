export interface Player {
    playerClass: string;
    playerLevel: number;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    itemBonusWeapon: number;
    itemArmor: number;
    itemBonusArmor: number;
    itemBonusSaves: number;
    itemDexCap: number;
}

export interface PlayerStats {
    weaponStrike0: number;
    weaponStrike1: number;
    weaponStrike2: number;
    spellAttack: number;
    armorClass: number;
    fortitude: number;
    reflex: number;
    will: number;
    saveSpecializationsLevels: {
        fort: number;
        reflex: number;
        will: number;
    };
}

export type PlayerStatsCombided = Player & PlayerStats

export interface Enemy {
    level: number;
    hp: number;
    ac: number;
    fort: number;
    reflex: number;
    will: number;
    attack_bonus: number;
    spell_dc: number;
    spell_attack_bonus: number;
}

export interface EnemyStats {
    hp: number;
    ac: number;
    fort: number;
    reflex: number;
    will: number;
    attack_bonus: number;
    spell_dc: number;
    spell_attack_bonus: number;
}

export interface AverageType {
    mean: EnemyStats;
    median: EnemyStats;
    mode: EnemyStats;
    mean_pwl: EnemyStats;
    median_pwl: EnemyStats;
    mode_pwl: EnemyStats;
    [key: string]: EnemyStats;
}

export interface EnemyAvaragesJson {
    [key: string]: AverageType;
}
