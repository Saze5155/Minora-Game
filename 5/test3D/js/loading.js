import Cook from "/5/test3D/js/cook.js";
import monde from "/5/test3D/js/monde.js";
import tpt from "/5/test3D/js/tpt.js";

export default class loading {
  preload() {
    this.load.image("coin", "/5/test3D/examples/pièce/pièce-02.png");
    this.load.image("potion", "/path/to/potion.png");
    this.load.image("viande cru", "/5/test3D/examples/cuisine/steak_cru.png");
    this.load.image(
      "viande pas trop cuite",
      "/5/test3D/examples/cuisine/steak_peucuit.png"
    );
    this.load.image(
      "viande bien cuite",
      "/5/test3D/examples/cuisine/steak_cuit.png"
    );
    this.load.image(
      "viande trop cuite",
      "/5/test3D/examples/cuisine/steak_tropcuit.png"
    );
  }
  create() {
    // chargement des scenes
    this.scene.add("monde", monde, false);
    this.scene.add("tpt", tpt, false);
    this.scene.add("tpt", Cook, false);
    // this.scene.add('plateformer', plateformer, false);
    // this.scene.add('marchand', marchand, false);

    // chargement de l'interface de jeu avec les parametres de victoire
    // this.scene.add('interfaceJeu', interfaceJeu, false, { remainingMonsters: remainingMonsters, remainingItems: remainingItems });

    // lancement du jeu
    this.scene.start("monde");
  }
}

const treeTextures = {};

const texturePaths = [
  "/5/test3D/examples/vie/vie-03.png",
  "/5/test3D/examples/vie/vie-04.png",
  "/5/test3D/examples/vie/vie-05.png",
  "/5/test3D/examples/vie/vie-06.png",
  "/5/test3D/examples/vie/vie-07.png",
];
const textureLoader = new THREE.TextureLoader();

texturePaths.forEach((path) => {
  textureLoader.load(path, (texture) => {
    treeTextures[path] = texture;
  });
});

export const getTreeTexture = (path) => treeTextures[path];

// BUSH

const bushTextures = {};

const textureBushPaths = [
  "/5/test3D/examples/vie/vie-09.png",
  "/5/test3D/examples/vie/vie-11.png",
  "/5/test3D/examples/vie/vie-10.png",
  "/5/test3D/examples/vie/vie-21.png",
  "/5/test3D/examples/vie/vie-24.png",
  "/5/test3D/examples/vie/vie-31.png",
];

textureBushPaths.forEach((path) => {
  textureLoader.load(path, (texture) => {
    bushTextures[path] = texture;
  });
});

export const getBushTexture = (path) => bushTextures[path];
