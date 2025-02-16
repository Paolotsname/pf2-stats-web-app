export interface Player {
    playerClass: string;
    playerLevel: number;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
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
        refl: number;
        will: number;
    };
}

export interface Enemy {
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
