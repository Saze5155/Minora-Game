const playerConfig = {
  attacks: [
    { name: "Slash", damage: 15, mpCost: 10 },
    { name: "Fireball", damage: 25, mpCost: 20 },
    { name: "Ice Blast", damage: 30, mpCost: 30 },
  ],
  defenses: [{ name: "Shield", defenseBoost: 10, mpCost: 15 }],
  potions: {
    vie: { healAmount: 25, mpCost: 0 },
    mana: { restoreAmount: 20, mpCost: 0 },
    viePlus: { healAmount: 50, mpCost: 0 },
    manaPlus: { restoreAmount: 40, mpCost: 0 },
    vieFull: { healAmount: 100, mpCost: 0 },
    force: { boost: 10, duration: 5000, mpCost: 0 },
    defense: { boost: 10, duration: 5000, mpCost: 0 },
    temps: { effect: "slow", duration: 3000, mpCost: 0 },
    espace: { effect: "teleport", mpCost: 0 },
  },
  playerHealth: 6,
  maxHealth: 6,
};

export default playerConfig;
