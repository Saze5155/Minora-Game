let Global = {
  enemyId: 0,
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
  // Ajout des attaques ici
  attacks: {
    nature: [
      { name: "Coup de racine", damage: 25, mpCost: 5, image: "attaque_vie_1" },
      {
        name: "Colère de la nature",
        damage: 50,
        mpCost: 15,
        image: "attaque_vie_2",
      },
      {
        name: "Souffle de l'arbre monde",
        damage: 115,
        mpCost: 40,
        image: "attaque_vie_3",
      },
    ],
    temps: [
      {
        name: "Mirage Trompeur",
        damage: 25,
        mpCost: 5,
        image: "attaque_temps_1",
      },
      {
        name: "Sable de l'éternité",
        damage: 50,
        mpCost: 15,
        image: "attaque_temps_2",
      },
      {
        name: "Fissure Temporelle",
        damage: 115,
        mpCost: 40,
        image: "attaque_temps_3",
      },
    ],
    espace: [
      {
        name: "Poussière d'étoile",
        damage: 25,
        mpCost: 5,
        image: "attaque_espace_1",
      },
      {
        name: "Tir céleste",
        damage: 50,
        mpCost: 15,
        image: "attaque_espace_2",
      },
      { name: "L'éclipse", damage: 115, mpCost: 40, image: "attaque_espace_3" },
    ],
    neutre: [
      {
        name: "Coup puissant",
        damage: 10,
        mpCost: 2,
        image: "attaque_normal_1",
      },
      {
        name: "Contre-attaque",
        damage: 15,
        mpCost: 5,
        image: "attaque_normal_2",
      },
      {
        name: "Charge fracassante",
        damage: 20,
        mpCost: 7,
        image: "attaque_normal_3",
      },
      {
        name: "Frappe critique",
        damage: 30,
        mpCost: 10,
        image: "attaque_normal_4",
      },
    ],
  },

  defenses: [{ name: "Shield", defenseBoost: 10, mpCost: 0 }],

  attackActif: [
    { name: "Coup puissant", damage: 10, mpCost: 2, image: "attaque_normal_1" },
    {
      name: "Contre-attaque",
      damage: 15,
      mpCost: 5,
      image: "attaque_normal_2",
    },
    {
      name: "Charge fracassante",
      damage: 20,
      mpCost: 7,
      image: "attaque_normal_3",
    },
    {
      name: "Frappe critique",
      damage: 30,
      mpCost: 10,
      image: "attaque_normal_4",
    },
  ],

  attackOff: [],

  toggleInventory(scene) {
    this.inventoryOpen = !this.inventoryOpen;

    if (this.inventoryOpen) {
      console.log("ouvert");
      this.showInventory(scene);
    } else {
      this.hideInventory();
    }
  },

  showInventory(scene) {
    console.log("ouvert");
    const width = scene.cameras.main.width;
    const height = scene.cameras.main.height;
    let scaleFactor = 0;
    let fontSize = "24px";

    if (
      scene.scene.key === "Plateformer_map1" ||
      scene.scene.key === "Plateformer_map2" ||
      scene.scene.key === "Plateformer_map3"
    ) {
      scaleFactor = 10;
      fontSize = "248px";
    } else if (
      scene.scene.key === "Laby_map1" ||
      scene.scene.key === "Laby_map2" ||
      scene.scene.key === "Laby_map3" ||
      scene.scene.key === "SpaceLevel"
    ) {
      scaleFactor = 2;
      fontSize = "68px";
    } else {
      scaleFactor = 1;
    }
    const slotSize = 80 * scaleFactor;
    const padding = 20 * scaleFactor;
    const potionScale = 0.15 * scaleFactor;
    const coinScale = 0.4 * scaleFactor;
    const meatScale = 0.15 * scaleFactor;

    // Rectangle gris de fond pour l'inventaire
    const bgWidth = width * 0.7 * scaleFactor;
    const bgHeight = height * 0.5 * scaleFactor;
    const leftX = width * 0.35;
    const centerY = height * 0.5;

    // Rectangle gris
    const bg = scene.add.graphics();
    bg.fillStyle(0x4d4d4d, 0.8);
    bg.fillRect(leftX - bgWidth / 2, centerY - bgHeight / 2, bgWidth, bgHeight);
    bg.setScrollFactor(0).setDepth(500);
    this.inventoryElements.push(bg);

    // Coeur représentant la vie du joueur
    const heartX = leftX - bgWidth / 2 + padding;
    const heartY = centerY - bgHeight / 2 + padding;
    let image = "";
    let scale = 0.5 * scaleFactor;

    if (this.playerHealth == 6) {
      image = "heart_6";
      scale = 0.3 * scaleFactor;
    } else if (this.playerHealth == 5) {
      image = "heart_5";
    } else if (this.playerHealth == 4) {
      image = "heart_4";
    } else if (this.playerHealth == 3) {
      image = "heart_3";
    } else if (this.playerHealth == 2) {
      image = "heart_2";
    } else {
      image = "heart_1";
    }

    const heartImage = scene.add.image(
      heartX + slotSize / 2,
      heartY + slotSize / 2,
      image
    );
    heartImage.setScale(scale);
    heartImage.setScrollFactor(0).setDepth(501); // Fixer le coeur à l'écran
    this.inventoryElements.push(heartImage);

    // Pièce à côté du coeur
    const coinX = heartX + slotSize + padding;
    const coinImage = scene.add.image(
      coinX + slotSize / 2,
      heartY + slotSize / 2,
      "coin_2"
    );
    coinImage.setScale(coinScale);
    coinImage.setScrollFactor(0).setDepth(501); // Fixer la pièce à l'écran
    this.inventoryElements.push(coinImage);

    const coinsText = scene.add
      .text(
        coinX + slotSize / 2,
        heartY + slotSize - 5,
        `${this.inventory.coins}`,
        {
          fontSize: fontSize,
          color: "#ffffff",
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 2,
        }
      )
      .setOrigin(0.5, 1);
    coinsText.setScrollFactor(0).setDepth(501); // Fixer le texte des pièces à l'écran
    this.inventoryElements.push(coinsText);

    // Grille 3x3 pour les potions à droite du coeur et pièces
    const potionStartX = heartX;
    const potionStartY = heartY + slotSize + padding;
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;

      const slotX = potionStartX + col * (slotSize + padding);
      const slotY = potionStartY + row * (slotSize + padding);

      const slotBg = scene.add.graphics();
      slotBg.lineStyle(2 * scaleFactor, 0x000000, 1);
      slotBg.strokeRect(slotX, slotY, slotSize, slotSize);
      slotBg.setScrollFactor(0).setDepth(501); // Fixer les slots des potions à l'écran
      this.inventoryElements.push(slotBg);

      const potionKeys = Object.keys(this.inventory.potions);
      const potionType = potionKeys[i];
      if (this.inventory.potions[potionType]?.length > 0) {
        const potion = this.inventory.potions[potionType][0];
        const potionImage = scene.add.image(
          slotX + slotSize / 2,
          slotY + slotSize / 2,
          "potion_" + potion.type
        );
        potionImage.setScale(potionScale);
        potionImage.setScrollFactor(0).setDepth(501); // Fixer l'image de la potion à l'écran
        potionImage.setInteractive();
        this.inventoryElements.push(potionImage);

        const potionText = scene.add
          .text(
            slotX + slotSize / 2,
            slotY + slotSize - 5,
            `${this.inventory.potions[potionType].length}`,
            {
              fontSize: fontSize,
              color: "#ffffff",
              fontStyle: "bold",
              stroke: "#000000",
              strokeThickness: 2,
            }
          )
          .setOrigin(0.5, 1);
        potionText.setScrollFactor(0).setDepth(501); // Fixer le texte des potions à l'écran
        this.inventoryElements.push(potionText);
      }
    }

    // Slots de viande/miel à droite des potions
    const meatStartX = 10 + potionStartX + 3 * (slotSize + padding);
    const meatStartY = heartY; // Aligné avec le coeur
    for (let i = 0; i < 4; i++) {
      const slotX = 10 + meatStartX;
      const slotY = meatStartY + i * (slotSize + padding);

      const slotBg = scene.add.graphics();
      slotBg.lineStyle(2 * scaleFactor, 0x000000, 1);
      slotBg.strokeRect(slotX, slotY, slotSize, slotSize);
      slotBg.setScrollFactor(0).setDepth(501); // Fixer les slots de viande/miel à l'écran
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
        itemImage.setScrollFactor(0).setDepth(501); // Fixer l'image de la viande/miel à l'écran
        this.inventoryElements.push(itemImage);

        itemImage.on("pointerdown", () => {
          this.eatMeatOrHoney(i, scene);
          this.hideInventory();
        });

        const itemText = scene.add
          .text(
            slotX + slotSize / 2,
            slotY + slotSize - 5,
            `${item.quantity}`,
            {
              fontSize: fontSize,
              color: "#ffffff",
              fontStyle: "bold",
              stroke: "#000000",
              strokeThickness: 2,
            }
          )
          .setOrigin(0.5, 1);
        itemText.setScrollFactor(0).setDepth(501); // Fixer le texte de la quantité de viande/miel à l'écran
        this.inventoryElements.push(itemText);
      }
    }

    const attackStartX = 10 + meatStartX + (slotSize + padding); // Placer à droite des slots de viande
    const attackStartY = meatStartY;

    for (let i = 0; i < 4; i++) {
      const slotX = 300 + attackStartX;
      const slotY = attackStartY + i * (slotSize + padding);

      if (this.attackActif[i]) {
        const attack = this.attackActif[i];
        const attackImage = scene.add.image(
          slotX + slotSize / 2,
          slotY + slotSize / 2,
          attack.image // Utilisation de l'image de l'attaque depuis attackActif
        );
        attackImage.setScale(meatScale); // Ajuster la taille si nécessaire
        attackImage.setInteractive();
        attackImage.setScrollFactor(0).setDepth(501).setScale(0.15); // Fixer l'image de l'attaque à l'écran
        this.inventoryElements.push(attackImage);
        attackImage.on("pointerdown", () => {
          this.showOffAttacks(scene, i); // Affiche les attaques Off pour remplacer
        });
      }
    }
  },
  showOffAttacks(scene, activeAttackIndex) {
    const width = scene.cameras.main.width;
    const height = scene.cameras.main.height;
    const padding = 20;
    const slotSize = 80;

    const offStartX = width / 2;
    const offStartY =
      height / 2 - (this.attackOff.length * (slotSize + padding)) / 2;

    // Affichage des attaques Off
    for (let i = 0; i < this.attackOff.length; i++) {
      const slotX = offStartX + 300;
      const slotY = offStartY + i * (slotSize + padding);

      const attack = this.attackOff[i];
      const attackImage = scene.add.image(
        slotX + slotSize / 2,
        slotY + slotSize / 2,
        attack.image // Utilisation de l'image de l'attaque dans attackOff
      );
      attackImage.setScale(0.15); // Ajuster la taille si nécessaire
      attackImage.setInteractive();
      attackImage.setScrollFactor(0).setDepth(501).setScale(0.15);

      attackImage.on("pointerover", () => {
        attackImage.setScale(0.18).setDepth(510); // Agrandir légèrement et amener devant
      });
      attackImage.on("pointerout", () => {
        attackImage.setScale(0.15).setDepth(501); // Revenir à la taille normale
      });

      attackImage.on("pointerdown", () => {
        // Échange l'attaque active avec l'attaque Off
        const temp = this.attackActif[activeAttackIndex];
        this.attackActif[activeAttackIndex] = this.attackOff[i];
        this.attackOff[i] = temp;
        console.log(this.attackActif);
        // Mettre à jour l'inventaire pour afficher les changements
        this.hideInventory();
        this.showInventory(scene);
      });

      this.inventoryElements.push(attackImage);
    }
  },
  eatMeatOrHoney(index, scene) {
    const item = this.inventory.meatsAndHoney[index];
    if (item && item.quantity > 0 && this.playerHealth < 6) {
      scene.player.gainHealth(item.type);
      item.quantity--;

      if (item.quantity === 0) {
        this.inventory.meatsAndHoney.splice(index, 1); // Retirer l'élément de l'inventaire
      }
    }
  },

  hideInventory() {
    this.inventoryElements.forEach((element) => element.destroy());
    this.inventoryElements = [];
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

  playerHealth: 6,
  maxHealth: 6,
};

export default Global;
