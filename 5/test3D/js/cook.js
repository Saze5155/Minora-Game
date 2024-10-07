import Global from "/5/test3D/js/inventaire.js";

class Cook extends Phaser.Scene {
  constructor() {
    super({ key: "Cook" });
    this.cookingStage = 1; // Étape du mini-jeu (1 : viande peu cuite, 2 : viande bien cuite)
    this.success = false; // Statut de réussite
    this.running = false; // Pour savoir si le mini-jeu est en cours
    this.direction = 1; // Direction de la petite barre
  }

  create() {
    this.createUI();
    this.running = true;
    this.events.on("update", this.updateBar, this); // Ajouter l'événement d'update pour déplacer la barre
    this.input.keyboard.on("keydown-SPACE", this.stopBar, this); // Écouter l'événement pour arrêter la barre
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
    const zoneWidth = this.cookingStage === 1 ? 100 : 50; // Plus petit à la deuxième étape
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
    this.movingBar.x += this.direction * 5; // Vitesse de la petite barre

    // Inverser la direction si elle atteint les bords
    if (
      this.movingBar.x >= this.centerX + 150 ||
      this.movingBar.x <= this.centerX - 150
    ) {
      this.direction *= -1;
    }
  }

  stopBar() {
    this.input.keyboard.off("keydown-SPACE", this.stopBar, this); // Désactiver l'écouteur
    this.events.off("update", this.updateBar, this); // Désactiver l'update de la barre

    // Vérifie si la petite barre est dans la zone verte
    const inGreenZone =
      this.movingBar.x > this.greenZone.x - this.greenZone.width / 2 &&
      this.movingBar.x < this.greenZone.x + this.greenZone.width / 2;

    if (inGreenZone) {
      if (this.cookingStage === 1) {
        this.cookingStage = 2; // Passe à l'étape suivante
        this.success = true;
        this.resetUI(); // Relance le mini-jeu avec une zone plus petite
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
    // Supprimer les éléments précédents
    this.greenZone.destroy();
    this.movingBar.destroy();

    // Réinitialiser les éléments pour la deuxième étape
    this.createUI();

    // Ajouter l'événement d'écoute à nouveau
    this.input.keyboard.on("keydown-SPACE", this.stopBar, this);
    this.events.on("update", this.updateBar, this);
  }

  endGame(result) {
    this.running = false;
    this.largeBar.destroy();
    this.greenZone.destroy();
    this.movingBar.destroy();

    console.log(`La viande est ${result}!`);

    // Met à jour l'inventaire en fonction du résultat
    if (result === "peu cuite") {
      Global.addMeat("viande pas trop cuite", 1);
    } else if (result === "bien cuite") {
      Global.addMeat("viande bien cuite", 1);
    } else if (result === "trop cuite") {
      Global.addMeat("viande trop cuite", 1);
    }

    // Retire la viande crue de l'inventaire
    Global.addMeat("viande cru", -1);

    // Revenir à la scène principale après un léger délai
    this.time.delayedCall(500, () => {
      this.scene.stop(); // Arrête la scène du mini-jeu
      this.scene.resume("monde"); // Reprend la scène principale
    });
  }
}

export default Cook;
