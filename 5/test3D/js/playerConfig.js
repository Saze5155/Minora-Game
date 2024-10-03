const playerConfig = {
    attacks: [
        { name: 'Slash', damage: 15, mpCost: 10 },
        { name: 'Fireball', damage: 25, mpCost: 20 },
        { name: 'Ice Blast', damage: 30, mpCost: 30 },
    ],
    defenses: [
        { name: 'Shield', defenseBoost: 10, mpCost: 15 },
    ],
    potions: {
        healAmount: 25, // Points de vie restaurés
        manaAmount: 20  // Points de mana restaurés
    }
};



export default playerConfig;