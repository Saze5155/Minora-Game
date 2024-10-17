class MarchandScene extends Phaser.Scene {
  constructor() {
    super({ key: "MarchandScene" });
    this.marchand = null;
    this.interfaceElements = [];
  }

  init(data) {
    this.marchand = data.marchand;
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const bgWidth = width / 2;
    const bgHeight = height / 2;
    const leftX = width / 2 - bgWidth / 2;
    const topY = height / 2 - bgHeight / 2;

    // Ajouter un fond gris semi-transparent
    const bg = this.add.graphics();
    bg.fillStyle(0x333333, 0.8);
    bg.fillRect(leftX, topY, bgWidth, bgHeight);
    this.interfaceElements.push(bg);

    // Espacement entre les articles
    const spacingX = 150;
    const yOffset = topY + 50;
    const xOffsetStart =
      leftX + (bgWidth - this.marchand.items.length * spacingX) / 2;

    // Afficher les articles du marchand de manière centrée
    this.marchand.items.forEach((item, index) => {
      const itemX = xOffsetStart + index * spacingX;
      console.log(item);
      let image = item.nom;
      if (item.nom != "viande bien cuite") {
        console.log("potions");
        image = "potion_" + item.nom;
      }

      if (this.textures.exists(image)) {
        const itemImage = this.add.image(itemX, yOffset, image);
        itemImage.setScale(0.15);
        this.interfaceElements.push(itemImage);
      }

      // Afficher le prix en dessous de l'image avec l'image de pièce
      const coinImage = this.add.image(itemX - 10, yOffset + 60, "coin_2");
      coinImage.setScale(0.1);
      this.interfaceElements.push(coinImage);

      const costText = this.add.text(
        itemX + 10,
        yOffset + 55,
        `${this.marchand.getPrice(item.nom)}`,
        {
          fontSize: "14px",
          color: "#ffffff",
        }
      );
      this.interfaceElements.push(costText);

      // Afficher le stock sous le prix
      const stockText = this.add
        .text(itemX, yOffset + 80, `Stock: ${item.quantity}`, {
          fontSize: "14px",
          color: "#ffffff",
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 2,
        })
        .setOrigin(0.5);
      this.interfaceElements.push(stockText);

      // Bouton pour acheter
      const buyButton = this.add
        .text(itemX, yOffset + 110, "Acheter", {
          fontSize: "16px",
          color: "#00ff00",
          backgroundColor: "#007bff",
          padding: { x: 10, y: 5 },
          borderRadius: 5,
        })
        .setInteractive()
        .on("pointerdown", () => {
          this.marchand.purchaseItem(item);
          this.refreshInterface();
        })
        .on("pointerover", () => {
          buyButton.setStyle({ color: "#ffffff", backgroundColor: "#0056b3" });
        })
        .on("pointerout", () => {
          buyButton.setStyle({ color: "#00ff00", backgroundColor: "#007bff" });
        });
      buyButton.setOrigin(0.5);
      this.interfaceElements.push(buyButton);
    });

    // Ajouter la possibilité de fermer avec Echap
    this.input.keyboard.on("keydown-ESC", () => {
      this.closeInterface();
    });

    // Bouton pour fermer l'interface
    const closeButton = this.add
      .text(width / 2, topY + bgHeight - 30, "Fermer", {
        fontSize: "18px",
        color: "#ff0000",
        backgroundColor: "#000",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.closeInterface();
      })
      .on("pointerover", () => {
        closeButton.setStyle({ color: "#ffffff", backgroundColor: "#b30000" });
      })
      .on("pointerout", () => {
        closeButton.setStyle({ color: "#ff0000", backgroundColor: "#000" });
      });
    this.interfaceElements.push(closeButton);
  }

  refreshInterface() {
    this.interfaceElements.forEach((element) => element.destroy());
    this.interfaceElements = [];
    this.create(); // Recréer l'interface après mise à jour
  }

  closeInterface() {
    this.interfaceElements.forEach((element) => element.destroy());
    this.interfaceElements = [];
    this.scene.stop("MarchandScene");
    this.scene.resume("monde");
  }
}

export default MarchandScene;
