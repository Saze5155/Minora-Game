import Cook from "/5/test3D/js/cook.js";
import MarchandScene from "/5/test3D/js/marchandScene.js";
import monde from "/5/test3D/js/monde.js";
import plateformer from "/5/test3D/js/plateformer.js";
import tpt from "/5/test3D/js/tpt.js";

export default class loading {
  preload() {
    this.load.image(
      "player",
      "/5/test3D/examples/anim_player/idle/_idle_1.png"
    );

    this.load.image(
      "walkdroite_1",
      "/5/test3D/examples/anim_player/walk/_walkdroite_1.png"
    );
    this.load.image(
      "walkdroite_2",
      "/5/test3D/examples/anim_player/walk/_walkdroite_2.png"
    );
    this.load.image(
      "walkdroite_3",
      "/5/test3D/examples/anim_player/walk/_walkdroite_3.png"
    );
    this.load.image(
      "walkdroite_4",
      "/5/test3D/examples/anim_player/walk/_walkdroite_4.png"
    );
    this.load.image(
      "walkdroite_5",
      "/5/test3D/examples/anim_player/walk/_walkdroite_5.png"
    );
    this.load.image(
      "walkdroite_6",
      "/5/test3D/examples/anim_player/walk/_walkdroite_6.png"
    );
    this.load.image(
      "walkdroite_7",
      "/5/test3D/examples/anim_player/walk/_walkdroite_7.png"
    );
    this.load.image(
      "walkdroite_8",
      "/5/test3D/examples/anim_player/walk/_walkdroite_8.png"
    );
    this.load.image(
      "walkdroite_9",
      "/5/test3D/examples/anim_player/walk/_walkdroite_9.png"
    );
    this.load.image(
      "walkgauche_1",
      "/5/test3D/examples/anim_player/walk/_walkgauche_1.png"
    );
    this.load.image(
      "walkgauche_2",
      "/5/test3D/examples/anim_player/walk/_walkgauche_2.png"
    );
    this.load.image(
      "walkgauche_3",
      "/5/test3D/examples/anim_player/walk/_walkgauche_3.png"
    );
    this.load.image(
      "walkgauche_4",
      "/5/test3D/examples/anim_player/walk/_walkgauche_4.png"
    );
    this.load.image(
      "walkgauche_5",
      "/5/test3D/examples/anim_player/walk/_walkgauche_5.png"
    );
    this.load.image(
      "walkgauche_6",
      "/5/test3D/examples/anim_player/walk/_walkgauche_6.png"
    );
    this.load.image(
      "walkgauche_7",
      "/5/test3D/examples/anim_player/walk/_walkgauche_7.png"
    );
    this.load.image(
      "walkgauche_8",
      "/5/test3D/examples/anim_player/walk/_walkgauche_8.png"
    );
    this.load.image(
      "walkgauche_9",
      "/5/test3D/examples/anim_player/walk/_walkgauche_9.png"
    );

    this.load.image(
      "jumpdroite_1",
      "/5/test3D/examples/anim_player/jump/_jumpdroite_1.png"
    );
    this.load.image(
      "jumpdroite_2",
      "/5/test3D/examples/anim_player/jump/_jumpdroite_2.png"
    );
    this.load.image(
      "jumpdroite_3",
      "/5/test3D/examples/anim_player/jump/_jumpdroite_3.png"
    );
    this.load.image(
      "jumpdroite_4",
      "/5/test3D/examples/anim_player/jump/_jumpdroite_4.png"
    );
    this.load.image(
      "jumpdroite_5",
      "/5/test3D/examples/anim_player/jump/_jumpdroite_5.png"
    );
    this.load.image(
      "jumpdroite_6",
      "/5/test3D/examples/anim_player/jump/_jumpdroite_6.png"
    );
    this.load.image(
      "jumpdroite_7",
      "/5/test3D/examples/anim_player/jump/_jumpdroite_7.png"
    );
    this.load.image(
      "jumpdroite_8",
      "/5/test3D/examples/anim_player/jump/_jumpdroite_8.png"
    );
    this.load.image(
      "jumpdroite_9",
      "/5/test3D/examples/anim_player/jump/_jumpdroite_9.png"
    );
    this.load.image(
      "jumpdroite_10",
      "/5/test3D/examples/anim_player/jump/_jumpdroite_10.png"
    );

    this.load.image(
      "jumpgauche_1",
      "/5/test3D/examples/anim_player/jump/_jumpgauche_1.png"
    );
    this.load.image(
      "jumpgauche_2",
      "/5/test3D/examples/anim_player/jump/_jumpgauche_2.png"
    );
    this.load.image(
      "jumpgauche_3",
      "/5/test3D/examples/anim_player/jump/_jumpgauche_3.png"
    );
    this.load.image(
      "jumpgauche_4",
      "/5/test3D/examples/anim_player/jump/_jumpgauche_4.png"
    );
    this.load.image(
      "jumpgauche_5",
      "/5/test3D/examples/anim_player/jump/_jumpgauche_5.png"
    );
    this.load.image(
      "jumpgauche_6",
      "/5/test3D/examples/anim_player/jump/_jumpgauche_6.png"
    );
    this.load.image(
      "jumpgauche_7",
      "/5/test3D/examples/anim_player/jump/_jumpgauche_7.png"
    );
    this.load.image(
      "jumpgauche_8",
      "/5/test3D/examples/anim_player/jump/_jumpgauche_8.png"
    );
    this.load.image(
      "jumpgauche_9",
      "/5/test3D/examples/anim_player/jump/_jumpgauche_9.png"
    );
    this.load.image(
      "jumpgauche_10",
      "/5/test3D/examples/anim_player/jump/_jumpgauche_10.png"
    );

    this.load.image(
      "attaquedroite_1",
      "/5/test3D/examples/anim_player/attack/_attaquedroite_1.png"
    );
    this.load.image(
      "attaquedroite_2",
      "/5/test3D/examples/anim_player/attack/_attaquedroite_2.png"
    );
    this.load.image(
      "attaquedroite_3",
      "/5/test3D/examples/anim_player/attack/_attaquedroite_3.png"
    );
    this.load.image(
      "attaquedroite_4",
      "/5/test3D/examples/anim_player/attack/_attaquedroite_4.png"
    );
    this.load.image(
      "attaquedroite_5",
      "/5/test3D/examples/anim_player/attack/_attaquedroite_5.png"
    );
    this.load.image(
      "attaquedroite_6",
      "/5/test3D/examples/anim_player/attack/_attaquedroite_6.png"
    );
    this.load.image(
      "attaquedroite_7",
      "/5/test3D/examples/anim_player/attack/_attaquedroite_7.png"
    );
    this.load.image(
      "attaquedroite_8",
      "/5/test3D/examples/anim_player/attack/_attaquedroite_8.png"
    );

    this.load.image(
      "attaquegauche_1",
      "/5/test3D/examples/anim_player/attack/_attaquegauche_1.png"
    );
    this.load.image(
      "attaquegauche_2",
      "/5/test3D/examples/anim_player/attack/_attaquegauche_2.png"
    );
    this.load.image(
      "attaquegauche_3",
      "/5/test3D/examples/anim_player/attack/_attaquegauche_3.png"
    );
    this.load.image(
      "attaquegauche_4",
      "/5/test3D/examples/anim_player/attack/_attaquegauche_4.png"
    );
    this.load.image(
      "attaquegauche_5",
      "/5/test3D/examples/anim_player/attack/_attaquegauche_5.png"
    );
    this.load.image(
      "attaquegauche_6",
      "/5/test3D/examples/anim_player/attack/_attaquegauche_6.png"
    );
    this.load.image(
      "attaquegauche_7",
      "/5/test3D/examples/anim_player/attack/_attaquegauche_7.png"
    );
    this.load.image(
      "attaquegauche_8",
      "/5/test3D/examples/anim_player/attack/_attaquegauche_8.png"
    );

    this.load.image(
      "idle_1",
      "/5/test3D/examples/anim_player/idle/_idle_1.png"
    );
    this.load.image(
      "idle_2",
      "/5/test3D/examples/anim_player/idle/_idle_2.png"
    );
    this.load.image(
      "idle_3",
      "/5/test3D/examples/anim_player/idle/_idle_3.png"
    );
    this.load.image(
      "idle_4",
      "/5/test3D/examples/anim_player/idle/_idle_4.png"
    );
    this.load.image(
      "idle_5",
      "/5/test3D/examples/anim_player/idle/_idle_5.png"
    );
    this.load.image(
      "idle_6",
      "/5/test3D/examples/anim_player/idle/_idle_6.png"
    );

    this.load.image("enemy_1", "/5/test3D/examples/monstre1/walk_1.png");
    this.load.image("enemy_2", "/5/test3D/examples/monstre1/walk_2.png");
    this.load.image("enemy_3", "/5/test3D/examples/monstre1/walk_3.png");
    this.load.image("enemy_4", "/5/test3D/examples/monstre1/walk_4.png");
    this.load.image("enemy_5", "/5/test3D/examples/monstre1/walk_5.png");
    this.load.image("enemy_6", "/5/test3D/examples/monstre1/walk_6.png");

    this.load.image("potion_defense", "/5/test3D/examples/potions/defense.png");
    this.load.image("potion_force", "/5/test3D/examples/potions/force.png");
    this.load.image("potion_mana", "/5/test3D/examples/potions/mana.png");
    this.load.image("potion_mana+", "/5/test3D/examples/potions/mana_+.png");
    this.load.image("potion_temps", "/5/test3D/examples/potions/temps.png");
    this.load.image("potion_vie", "/5/test3D/examples/potions/vie.png");
    this.load.image("potion_vie+", "/5/test3D/examples/potions/vie_+.png");
    this.load.image(
      "potion_vieFull",
      "/5/test3D/examples/potions/vie_full.png"
    );

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
    this.load.image("miel", "/5/test3D/examples/cuisine/miel.png");

    this.load.image("heart_6", "/5/test3D/examples/coeur/coeur_plein.png");
    this.load.image("heart_5", "/5/test3D/examples/coeur/coeur_5.png");
    this.load.image("heart_4", "/5/test3D/examples/coeur/coeur_4.png");
    this.load.image("heart_3", "/5/test3D/examples/coeur/coeur_3.png");
    this.load.image("heart_2", "/5/test3D/examples/coeur/coeur_2.png");
    this.load.image("heart_1", "/5/test3D/examples/coeur/coeur_1.png");

    this.load.image("coin_2", "/5/test3D/examples/piece/piece-02.png");

    this.load.image("tileset", "/5/test3D/examples/TX Tileset Ground.png");
    this.load.image("plateforme", "/5/test3D/examples/plateforme.png");
    this.load.tilemapTiledJSON("map1", "/5/test3D/json/map1.json");
    this.load.image("porte", "/5/test3D/examples/Portes.png");

    // Charger les musiques pour chaque biome
    this.load.audio(
      "nature_music",
      "/5/test3D/examples/Sound-Artlist/Music_Forest.wav"
    );
    this.load.audio(
      "desert_music",
      "/5/test3D/examples/Sound-Artlist/Music_Desert.wav"
    );
    this.load.audio(
      "space_music",
      "/5/test3D/examples/Sound-Artlist/Music_Space.wav"
    );

    this.load.audio("damage", "/5/test3D/examples/Sound-Artlist/Degat2.wav");
    this.load.audio(
      "GagnerVie",
      "/5/test3D/examples/Sound-Artlist/GagnerVie.wav"
    );
    this.load.audio("Jump", "/5/test3D/examples/Sound-Artlist/Jump2.wav");
    this.load.audio("Manger", "/5/test3D/examples/Sound-Artlist/Manger.wav");
    this.load.audio(
      "marmitte",
      "/5/test3D/examples/Sound-Artlist/Marmitte2.wav"
    );
    this.load.audio(
      "walk_grass",
      "/5/test3D/examples/Sound-Artlist/Walk_Grass.wav"
    );
    this.load.audio("Sword", "/5/test3D/examples/Sound-Artlist/Sword.wav");
    this.load.audio(
      "animal_damage",
      "/5/test3D/examples/Sound-Artlist/animal_damage.wav"
    );
    this.load.audio("collect", "/5/test3D/examples/Sound-Artlist/collect.wav");

    this.load.image(
      "background",
      "/5/test3D/examples/tpt/terrain_combat_tour.png"
    );
    // Charger les images du joueur, de l'ennemi et des boutons
    this.load.image(
      "player",
      "/5/test3D/examples/anim_player/idle/_idle_1.png"
    );
    this.load.image("enemy", "/5/test3D/examples/monstre1/walk_1.png");
    this.load.image(
      "attackButton",
      "/5/test3D/examples/tpt/bouton_attaque.png"
    );
    this.load.image(
      "defendButton",
      "/5/test3D/examples/tpt/bouton_defense.png"
    );
    this.load.image("potionButton", "/5/test3D/examples/tpt/bouton_potion.png");
    this.load.image("fleeButton", "/5/test3D/examples/tpt/bouton_fuite.png");
  }
  create() {
    // chargement des scenes
    this.scene.add("monde", monde, false);
    this.scene.add("tpt", tpt, false);
    this.scene.add("cook", Cook, false);
    this.scene.add("MarchandScene", MarchandScene, false);
    this.scene.add("plateformer", plateformer, false);

    // this.scene.add('interfaceJeu', interfaceJeu, false, { remainingMonsters: remainingMonsters, remainingItems: remainingItems });

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

// BUSH

const cactusTextures = {};

const textureCactusPaths = ["/5/test3D/examples/éléments desert/cactus.png"];

textureCactusPaths.forEach((path) => {
  textureLoader.load(path, (texture) => {
    cactusTextures[path] = texture;
  });
});

export const getCactusTexture = (path) => cactusTextures[path];
