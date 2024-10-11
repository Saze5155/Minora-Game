import Global from "/5/test3D/js/inventaire.js";

class Cook extends Phaser.Scene {
  constructor() {
    super({ key: "Cook" });
  }

  create() {
    // Réinitialisation des variables pour chaque nouvelle session
    this.cookingStage = 1;
    this.success = false;
    this.running = true;
    this.direction = 1;

    // Créer l'interface utilisateur
    this.createUI();

    // Ajouter les écouteurs d'événements
    this.input.keyboard.on("keydown-SPACE", this.stopBar, this);
    this.events.on("update", this.updateBar, this);
  }

  createUI() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    this.centerX = width / 2;
    this.centerY = height / 2;

    // Grande barre (fond)
    this.largeBar = this.add.rectangle(
      this.centerX,
      this.centerY,
      300,
      20,
      0xffffff
    );
    this.largeBar.setOrigin(0.5);

    // Zone verte (variable selon l’étape de cuisson)
    const zoneWidth = this.cookingStage === 1 ? 100 : 50;
    this.greenZone = this.add.rectangle(
      this.centerX,
      this.centerY,
      zoneWidth,
      20,
      0x00ff00
    );
    this.greenZone.setOrigin(0.5);

    // Petite barre qui se déplace
    this.movingBar = this.add.rectangle(
      this.centerX - 150,
      this.centerY,
      10,
      20,
      0xff0000
    );
    this.movingBar.setOrigin(0.5);
  }

  updateBar() {
    // Déplacer la petite barre manuellement
    this.movingBar.x += this.direction * 5;

    // Inverser la direction si elle atteint les bords
    if (
      this.movingBar.x >= this.centerX + 150 ||
      this.movingBar.x <= this.centerX - 150
    ) {
      this.direction *= -1;
    }
  }

  stopBar() {
    this.input.keyboard.off("keydown-SPACE", this.stopBar, this);
    this.events.off("update", this.updateBar, this);

    // Vérifie si la petite barre est dans la zone verte
    const inGreenZone =
      this.movingBar.x > this.greenZone.x - this.greenZone.width / 2 &&
      this.movingBar.x < this.greenZone.x + this.greenZone.width / 2;

    if (inGreenZone) {
      if (this.cookingStage === 1) {
        this.cookingStage = 2;
        this.success = true;
        this.resetUI();
      } else {
        this.success = true;
        this.endGame("bien cuite");
      }
    } else {
      this.success = false;
      if (this.cookingStage === 1) {
        this.endGame("peu cuite");
      } else {
        this.endGame("trop cuite");
      }
    }
  }

  resetUI() {
    this.greenZone.destroy();
    this.movingBar.destroy();

    this.createUI();

    // Réattacher les écouteurs d'événements
    this.input.keyboard.on("keydown-SPACE", this.stopBar, this);
    this.events.on("update", this.updateBar, this);
  }

  endGame(result) {
    this.running = false;
    this.largeBar.destroy();
    this.greenZone.destroy();
    this.movingBar.destroy();

    console.log(`La viande est ${result}!`);

    if (result === "peu cuite") {
      Global.addMeatOrHoney("viande pas trop cuite", 1);
    } else if (result === "bien cuite") {
      Global.addMeatOrHoney("viande bien cuite", 1);
    } else if (result === "trop cuite") {
      Global.addMeatOrHoney("viande trop cuite", 1);
    }

    this.time.delayedCall(500, () => {
      this.scene.stop();
      this.scene.resume("monde");
    });
  }
}

export default Cook;
