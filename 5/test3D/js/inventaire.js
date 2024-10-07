let Global = {
  inventory: {
    coins: 0, // Stockage des pièces
    potions: [], // Stockage des potions (max 4)
    meats: {
      "viande cru": 0,
      "viande pas trop cuite": 0,
      "viande bien cuite": 0,
      "viande trop cuite": 0,
    },
  },
  inventoryOpen: false,
  inventoryElements: [], // Stocke les éléments graphiques pour plus de flexibilité

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
    const bgWidth = width / 2;
    const bgHeight = height / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    let yOffset = centerY - bgHeight / 2 + 50;

    // Ajouter un fond gris
    const bg = scene.add.graphics();
    bg.fillStyle(0x808080, 0.8); // Gris avec opacité de 0.8
    bg.fillRect(
      centerX - bgWidth / 2,
      centerY - bgHeight / 2,
      bgWidth,
      bgHeight
    ); // Fond centré
    this.inventoryElements.push(bg);

    // Afficher les pièces (image)
    const coinImage = scene.add.image(centerX - 150, yOffset, "coin");
    coinImage.setScale(0.2); // Ajuster l'échelle de l'image
    this.inventoryElements.push(coinImage);

    // Afficher le texte du nombre de pièces
    const coinsText = scene.add
      .text(centerX - 100, yOffset, `${this.inventory.coins}`, {
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0.5, 0.5);
    this.inventoryElements.push(coinsText);

    // Afficher les potions (image + texte)
    yOffset += 50;
    const potionImage = scene.add.image(centerX - 150, yOffset, "potion"); // Image d'une potion
    potionImage.setScale(0.2);
    this.inventoryElements.push(potionImage);

    const potionsText = scene.add
      .text(centerX - 100, yOffset, `${this.inventory.potions.length} / 4`, {
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0.5, 0.5);
    this.inventoryElements.push(potionsText);

    // Afficher chaque type de viande (image + texte)
    yOffset += 50;
    for (let [meatType, quantity] of Object.entries(this.inventory.meats)) {
      const meatImage = scene.add.image(centerX - 150, yOffset, meatType); // Utiliser le meatType comme clé de l'image
      meatImage.setScale(0.2);
      this.inventoryElements.push(meatImage);

      const meatText = scene.add
        .text(centerX - 100, yOffset, `${quantity}`, {
          fontSize: "16px",
          color: "#ffffff",
        })
        .setOrigin(0.5, 0.5);
      this.inventoryElements.push(meatText);

      yOffset += 50;
    }
  },

  hideInventory() {
    // Supprimer tous les éléments graphiques de l'inventaire
    this.inventoryElements.forEach((element) => element.destroy());
    this.inventoryElements = [];
  },

  addCoin(amount) {
    this.inventory.coins += amount;
  },

  addPotion(potionType) {
    if (this.inventory.potions.length < 4) {
      this.inventory.potions.push(potionType);
    }
  },

  addMeat(meatType, amount) {
    if (this.inventory.meats[meatType] !== undefined) {
      this.inventory.meats[meatType] += amount;
    }
  },
};

export default Global;
