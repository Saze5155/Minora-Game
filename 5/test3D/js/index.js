// configuration générale du jeu
import loading from "/5/test3D/js/loading.js";
import interfaceJeu from "/5/test3D/js/interfaceJeu.js";

const config = {
    type: Phaser.WEBGL,
    transparent: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: window.innerWidth * Math.max(1, window.devicePixelRatio / 2),
      height: window.innerHeight * Math.max(1, window.devicePixelRatio / 2),
    },
    scene: [loading],
    ...Canvas(),
  };


// création et lancement du jeu à partir de la configuration config
window.addEventListener("load", () => {
  enable3d(() => new Phaser.Game(config)).withPhysics(
    "/lib/ammo/kripken"
  );
});