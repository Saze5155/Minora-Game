import playerConfig from "/5/test3D/js/playerConfig.js";

let Global = {
  inventory: {
    coins: 0,
    potions: [],
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
    const bgWidth = width / 3;
    const bgHeight = height / 2;
    const leftX = width / 6;
    const centerY = height / 2;

    const bg = scene.add.graphics();
    bg.fillStyle(0x4d4d4d, 0.8);
    bg.fillRect(leftX - bgWidth / 2, centerY - bgHeight / 2, bgWidth, bgHeight);
    this.inventoryElements.push(bg);

    const slotSize = 50;
    const padding = 10;
    const potionScale = 0.08;
    const coinScale = 0.3;
    const meatScale = 0.2;
    const slotPositions = [];

    // Case des pièces
    slotPositions.push({
      x: leftX - bgWidth / 2 + padding,
      y: centerY - bgHeight / 2 + padding,
      type: "coins",
    });

    // Cases des potions
    for (let i = 0; i < 4; i++) {
      slotPositions.push({
        x: leftX - bgWidth / 2 + padding,
        y:
          centerY -
          bgHeight / 2 +
          slotSize +
          padding * 2 +
          i * (slotSize + padding),
        type: "potion",
        index: i,
      });
    }

    // Cases des viandes/miel
    for (let i = 0; i < 4; i++) {
      slotPositions.push({
        x: leftX - bgWidth / 2 + slotSize + padding + i * (slotSize + padding),
        y: centerY + bgHeight / 2 - slotSize - padding,
        type: "meatHoney",
        index: i,
      });
    }

    slotPositions.forEach((slot) => {
      const slotBg = scene.add.graphics();
      slotBg.lineStyle(2, 0x000000, 1);
      slotBg.strokeRect(slot.x, slot.y, slotSize, slotSize);
      this.inventoryElements.push(slotBg);

      if (slot.type === "coins") {
        const coinImage = scene.add.image(
          slot.x + slotSize / 2,
          slot.y + slotSize / 2,
          "coin_2"
        );
        coinImage.setScale(coinScale);
        this.inventoryElements.push(coinImage);

        const coinsText = scene.add
          .text(
            slot.x + slotSize / 2,
            slot.y + slotSize - 5,
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
      } else if (slot.type === "potion" && this.inventory.potions[slot.index]) {
        const potion = this.inventory.potions[slot.index];
        const potionImage = scene.add.image(
          slot.x + slotSize / 2,
          slot.y + slotSize / 2,
          potion.type
        );
        potionImage.setScale(potionScale);
        potionImage.setInteractive();
        this.inventoryElements.push(potionImage);

        potionImage.on("pointerdown", () => {
          this.startCharging(scene, slot, slot.index);
        });

        potionImage.on("pointerup", () => {
          this.stopCharging();
        });

        potionImage.on("pointerout", () => {
          this.stopCharging();
        });
      } else if (
        slot.type === "meatHoney" &&
        this.inventory.meatsAndHoney[slot.index]
      ) {
        const item = this.inventory.meatsAndHoney[slot.index];
        const itemImage = scene.add.image(
          slot.x + slotSize / 2,
          slot.y + slotSize / 2,
          item.type
        );
        itemImage.setScale(meatScale);
        itemImage.setInteractive();
        this.inventoryElements.push(itemImage);

        const itemText = scene.add
          .text(
            slot.x + slotSize / 2,
            slot.y + slotSize - 5,
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

        itemImage.on("pointerdown", () => {
          this.eatMeatOrHoney(slot.index);
          this.hideInventory();
          this.showInventory(scene);
        });
      }
    });
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
    if (item && item.quantity > 0 && playerConfig.playerHealth < 6) {
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
    if (this.inventory.potions.length < 4) {
      this.inventory.potions.push({ type: potionType });
    } else {
      console.log("Inventaire de potions plein !");
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
};

export default Global;
