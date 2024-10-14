// configuration générale du jeu
import loading from "/5/test3D/js/loading.js";

const config = {
  type: Phaser.WEBGL,
  transparent: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080,
  },
  physics: {
    default: "arcade", // Utilise Arcade Physics pour les scènes 2D par défaut
    arcade: {
      gravity: { y: 300 }, // Gravité pour les scènes 2D
      debug: true,
    },
  },
  scene: [loading],
  ...Canvas(),
};

// création et lancement du jeu à partir de la configuration config
window.addEventListener("load", () => {
  enable3d(() => new Phaser.Game(config)).withPhysics("/lib/ammo/kripken");
});
