let Global = {
  inventory: {
    coins: 0,
    potions: {
      vie: [],
      viePlus: [],
      vieFull: [],
      force: [],
      defense: [],
      temps: [],
      espace: [],
      mana: [],
      manaPlus: [],
    },
    meatsAndHoney: [],
  },
  inventoryOpen: false,
  inventoryElements: [],
  player: null,
  chargeCircle: null,
  chargeTimeout: null,

  toggleInventory(scene) {
    this.inventoryOpen = !this.inventoryOpen;

    if (this.inventoryOpen) {
      this.showInventory(scene);
    } else {
      this.hideInventory();
    }
  },

  showInventory(scene) {
    const width = scene.cameras.main.width;
    const height = scene.cameras.main.height;
    const slotSize = 50;
    const padding = 10;
    const potionScale = 0.08;
    const coinScale = 0.3;
    const meatScale = 0.2;

    // Agrandir le rectangle gris en arrière-plan
    const bgWidth = width / 2;
    const bgHeight = height / 2;
    const leftX = width / 6;
    const centerY = height / 2;

    // Rectangle gris
    const bg = scene.add.graphics();
    bg.fillStyle(0x4d4d4d, 0.8);
    bg.fillRect(leftX - bgWidth / 2, centerY - bgHeight / 2, bgWidth, bgHeight);
    this.inventoryElements.push(bg);

    // Pièce en haut à gauche
    const coinX = leftX - bgWidth / 2 + padding;
    const coinY = centerY - bgHeight / 2 + padding;

    const coinImage = scene.add.image(
      coinX + slotSize / 2,
      coinY + slotSize / 2,
      "coin_2"
    );
    coinImage.setScale(coinScale);
    this.inventoryElements.push(coinImage);

    const coinsText = scene.add
      .text(
        coinX + slotSize / 2,
        coinY + slotSize - 5,
        `${this.inventory.coins}`,
        {
          fontSize: "18px",
          color: "#ffffff",
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 2,
        }
      )
      .setOrigin(0.5, 1);
    this.inventoryElements.push(coinsText);

    // 9 slots pour les potions
    for (let i = 0; i < 9; i++) {
      const slotX = coinX + slotSize + padding + i * (slotSize + padding);
      const slotY = coinY;

      const slotBg = scene.add.graphics();
      slotBg.lineStyle(2, 0x000000, 1);
      slotBg.strokeRect(slotX, slotY, slotSize, slotSize);
      this.inventoryElements.push(slotBg);

      const potionKeys = Object.keys(this.inventory.potions);
      const potionType = potionKeys[i];
      if (this.inventory.potions[potionType].length > 0) {
        const potion = this.inventory.potions[potionType][0];
        const potionImage = scene.add.image(
          slotX + slotSize / 2,
          slotY + slotSize / 2,
          "potion_" + potion.type
        );
        potionImage.setScale(potionScale);
        potionImage.setInteractive();
        this.inventoryElements.push(potionImage);

        potionImage.on("pointerdown", () => {
          this.startCharging(scene, { x: slotX, y: slotY }, i);
        });

        potionImage.on("pointerup", () => {
          this.stopCharging();
        });
      }
    }

    // 4 slots pour viandes/miel à droite
    for (let i = 0; i < 4; i++) {
      const slotX = leftX + bgWidth / 2 - slotSize - padding;
      const slotY = centerY - bgHeight / 2 + i * (slotSize + padding);

      const slotBg = scene.add.graphics();
      slotBg.lineStyle(2, 0x000000, 1);
      slotBg.strokeRect(slotX, slotY, slotSize, slotSize);
      this.inventoryElements.push(slotBg);

      if (this.inventory.meatsAndHoney[i]) {
        const item = this.inventory.meatsAndHoney[i];
        const itemImage = scene.add.image(
          slotX + slotSize / 2,
          slotY + slotSize / 2,
          item.type
        );
        itemImage.setScale(meatScale);
        itemImage.setInteractive();
        this.inventoryElements.push(itemImage);

        const itemText = scene.add
          .text(
            slotX + slotSize / 2,
            slotY + slotSize - 5,
            `${item.quantity}`,
            {
              fontSize: "18px",
              color: "#ffffff",
              fontStyle: "bold",
              stroke: "#000000",
              strokeThickness: 2,
            }
          )
          .setOrigin(0.5, 1);
        this.inventoryElements.push(itemText);
      }
    }
  },
  startCharging(scene, slot, potionIndex) {
    this.chargeCircle = scene.add
      .circle(slot.x + 25, slot.y + 25, 20, 0xff0000, 0.5)
      .setScale(0.1);
    this.inventoryElements.push(this.chargeCircle);

    let scale = 0.1;
    const increment = 0.02;

    this.chargeTimeout = scene.time.addEvent({
      delay: 50,
      callback: () => {
        scale += increment;
        this.chargeCircle.setScale(scale);

        if (scale >= 1) {
          this.removePotion(potionIndex);
          this.stopCharging();
          this.hideInventory();
          this.showInventory(scene);
        }
      },
      repeat: -1,
    });
  },

  stopCharging() {
    if (this.chargeTimeout) {
      this.chargeTimeout.remove();
      this.chargeTimeout = null;
    }

    if (this.chargeCircle) {
      this.chargeCircle.destroy();
      this.chargeCircle = null;
    }
  },

  eatMeatOrHoney(index) {
    const item = this.inventory.meatsAndHoney[index];
    if (item && item.quantity > 0 && Global.playerHealth < 6) {
      this.player.gainHealth(item.type);
      item.quantity--;

      // Vérifier si la quantité est maintenant à 0
      if (item.quantity === 0) {
        this.inventory.meatsAndHoney.splice(index, 1); // Retirer l'élément de l'inventaire
      }
    }
  },

  removePotion(index) {
    if (index >= 0 && index < this.inventory.potions.length) {
      this.inventory.potions.splice(index, 1);
      console.log("Potion jetée !");
    }
  },

  hideInventory() {
    this.inventoryElements.forEach((element) => element.destroy());
    this.inventoryElements = [];
    this.stopCharging(); // Arrêter le chargement si l'inventaire est fermé
  },

  addCoin(amount) {
    this.inventory.coins += amount;
  },

  addPotion(potionType) {
    const potionLimits = {
      vie: 10,
      mana: 10,
      manaPlus: 5,
      viePlus: 5,
      defense: 2,
      force: 2,
      vieFull: 1,
      temps: 1,
      espace: 1,
    };

    if (this.inventory.potions[potionType].length < potionLimits[potionType]) {
      this.inventory.potions[potionType].push({ type: potionType });
    } else {
      console.log(`${potionType} est plein !`);
    }
  },
  addMeatOrHoney(type, amount) {
    const existingItem = this.inventory.meatsAndHoney.find(
      (item) => item.type === type && item.quantity < 5
    );

    if (existingItem) {
      const availableSpace = 5 - existingItem.quantity;
      existingItem.quantity += Math.min(amount, availableSpace);

      if (amount > availableSpace) {
        this.addMeatOrHoney(type, amount - availableSpace);
      }
    } else if (this.inventory.meatsAndHoney.length < 4) {
      this.inventory.meatsAndHoney.push({
        type: type,
        quantity: Math.min(amount, 5),
      });

      if (amount > 5) {
        this.addMeatOrHoney(type, amount - 5);
      }
    } else {
      console.log("Slots de viande/miel pleins !");
    }
  },

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

export default Global;
