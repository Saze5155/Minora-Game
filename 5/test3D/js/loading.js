import Cook from "/5/test3D/js/cook.js";
import Laby_map1 from "/5/test3D/js/laby/laby_map1.js";
import Laby_map2 from "/5/test3D/js/laby/laby_map2.js";
import Laby_map3 from "/5/test3D/js/laby/laby_map3.js";
import MarchandScene from "/5/test3D/js/marchandScene.js";
import monde from "/5/test3D/js/monde.js";
import Plateformer_map1 from "/5/test3D/js/plateformer/plateformer_map1.js";
import Plateformer_map2 from "/5/test3D/js/plateformer/plateformer_map2.js";
import Plateformer_map3 from "/5/test3D/js/plateformer/plateformer_map3.js";

import Dialogue from "/5/test3D/js/Dialogue.js";
import DialogueScene from "/5/test3D/js/DialogueScene.js";
import DialogueScene2 from "/5/test3D/js/DialogueScene2.js";
import BossLevel from "/5/test3D/js/Space_Plateformer/BossLevel.js";
import RocketLevel from "/5/test3D/js/Space_Plateformer/RocketLevel.js";
import SpaceLevel from "/5/test3D/js/Space_Plateformer/SpaceLevel.js";
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

    this.load.image(
      "hautAvance_1",
      "/5/test3D/examples/anim_player/vue de haut/marchehaut_1.png"
    );
    this.load.image(
      "hautAvance_2",
      "/5/test3D/examples/anim_player/vue de haut/marchehaut_2.png"
    );
    this.load.image(
      "hautAvance_3",
      "/5/test3D/examples/anim_player/vue de haut/marchehaut_3.png"
    );
    this.load.image(
      "hautAvance_4",
      "/5/test3D/examples/anim_player/vue de haut/marchehaut_4.png"
    );
    this.load.image(
      "hautAvance_5",
      "/5/test3D/examples/anim_player/vue de haut/marchehaut_5.png"
    );
    this.load.image(
      "hautAvance_6",
      "/5/test3D/examples/anim_player/vue de haut/marchehaut_6.png"
    );
    this.load.image(
      "hautAvance_7",
      "/5/test3D/examples/anim_player/vue de haut/marchehaut_7.png"
    );
    this.load.image(
      "hautAvance_8",
      "/5/test3D/examples/anim_player/vue de haut/marchehaut_8.png"
    );

    this.load.image(
      "hautAttaque_1",
      "/5/test3D/examples/anim_player/vue de haut/attaquehaut_1.png"
    );
    this.load.image(
      "hautAttaque_2",
      "/5/test3D/examples/anim_player/vue de haut/attaquehaut_2.png"
    );
    this.load.image(
      "hautAttaque_3",
      "/5/test3D/examples/anim_player/vue de haut/attaquehaut_3.png"
    );
    this.load.image(
      "hautAttaque_4",
      "/5/test3D/examples/anim_player/vue de haut/attaquehaut_4.png"
    );
    this.load.image(
      "hautAttaque_5",
      "/5/test3D/examples/anim_player/vue de haut/attaquehaut_5.png"
    );
    this.load.image(
      "hautAttaque_6",
      "/5/test3D/examples/anim_player/vue de haut/attaquehaut_6.png"
    );
    this.load.image(
      "hautAttaque_7",
      "/5/test3D/examples/anim_player/vue de haut/attaquehaut_7.png"
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
    this.load.image("potion_manaPlus", "/5/test3D/examples/potions/mana_+.png");
    this.load.image("potion_temps", "/5/test3D/examples/potions/temps.png");
    this.load.image("potion_vie", "/5/test3D/examples/potions/vie.png");
    this.load.image("potion_viePlus", "/5/test3D/examples/potions/vie_+.png");
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

    // PLATEFORMER

    this.load.image(
      "tileset_bois",
      "/5/test3D/examples/plateformer/tileset_bois.png"
    );

    this.load.tilemapTiledJSON("map1", "/5/test3D/json/map1.json");
    this.load.tilemapTiledJSON("map2", "/5/test3D/json/map2.json");
    this.load.tilemapTiledJSON("map3", "/5/test3D/json/map3.json");

    this.load.image(
      "plateforme",
      "/5/test3D/examples/plateformer/plateforme-bois2.png"
    );
    this.load.image(
      "plateforme_cassante",
      "/5/test3D/examples/plateformer/plateforme-piege2.png"
    );
    this.load.image("porte", "/5/test3D/examples/plateformer/porte1.png");
    this.load.image("porte_boss", "/5/test3D/examples/plateformer/porte2.png");
    this.load.image("coffre", "/5/test3D/examples/coffre/coffre_1.png");
    this.load.image("coffre_ouvert", "/5/test3D/examples/coffre/coffre_2.png");

    // LABYRHINTE

    this.load.image("tileset_laby", "/5/test3D/examples/laby/tileset_laby.png");

    this.load.tilemapTiledJSON("laby_map1", "/5/test3D/json/laby_map1.json");
    this.load.tilemapTiledJSON("laby_map2", "/5/test3D/json/laby_map2.json");
    this.load.tilemapTiledJSON("laby_map3", "/5/test3D/json/laby_map3.json");

    this.load.image("arrow", "/5/test3D/examples/laby/fleche1.png");
    this.load.image("spike_off", "/5/test3D/examples/laby/pic1.png");
    this.load.image("spike_on", "/5/test3D/examples/laby/pic2.png");
    this.load.image(
      "coffre_laby_ouvert",
      "/5/test3D/examples/laby/coffre2.png"
    );
    this.load.image("coffre_piege", "/5/test3D/examples/laby/coffre_piege.png");
    this.load.image("coffre_laby", "/5/test3D/examples/laby/coffre1.png");
    this.load.image("enemy_laby", "/5/test3D/examples/laby/monstre.png");
    this.load.image("lever", "/5/test3D/examples/laby/levier1.png");
    this.load.image("lever_on", "/5/test3D/examples/laby/levier2.png");
    this.load.image("door", "/5/test3D/examples/laby/porte1.png");

    // AUDIO
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
    this.load.audio(
      "ouverture",
      "/5/test3D/examples/Sound-Artlist/Chest_oppening.wav"
    );
    this.load.audio("spike", "/5/test3D/examples/Sound-Artlist/Spike_Trap.wav");
    this.load.audio("arrow", "/5/test3D/examples/Sound-Artlist/Arrow_Trap.wav");
    this.load.audio(
      "sound_laby",
      "/5/test3D/examples/Sound-Artlist/labyrinthe.wav"
    );

    this.load.audio(
      "BossLevel",
      "/5/test3D/examples/Sound-Artlist/BossLevel.wav"
    );
    this.load.audio(
      "RocketLevel",
      "/5/test3D/examples/Sound-Artlist/RocketLevel.wav"
    );
    this.load.audio(
      "SpaceLevel",
      "/5/test3D/examples/Sound-Artlist/SpaceLevel.wav"
    );
    this.load.audio("Laser1", "/5/test3D/examples/Sound-Artlist/Laser1.wav");
    this.load.audio("Laser2", "/5/test3D/examples/Sound-Artlist/Laser2.wav");
    this.load.audio("Laser3", "/5/test3D/examples/Sound-Artlist/Laser3.wav");
    this.load.audio(
      "GameOver",
      "/5/test3D/examples/Sound-Artlist/GameOver.wav"
    );
    this.load.audio(
      "Plateformer_Vie",
      "/5/test3D/examples/Sound-Artlist/Plateformer_Vie.wav"
    );

    this.load.audio(
      "Dialogue_bonny",
      "/5/test3D/examples/Sound-Artlist/Dialogue_bonny.wav"
    );
    this.load.audio(
      "Dialogue_bonny2",
      "/5/test3D/examples/Sound-Artlist/Dialogue_Bonny2wav.wav"
    );

    this.load.audio(
      "walk_gravel",
      "/5/test3D/examples/Sound-Artlist/Walk_Gravel.wav"
    );
    this.load.audio(
      "walk_sand",
      "/5/test3D/examples/Sound-Artlist/Walk_Sand.wav"
    );

    //

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
    this.load.image("vie", "/5/test3D/examples/potions/vie.png");
    this.load.image("viePlus", "/5/test3D/examples/potions/vie_+.png");
    this.load.image("vieFull", "/5/test3D/examples/potions/vie_full.png");
    this.load.image("mana", "/5/test3D/examples/potions/mana.png");
    this.load.image("manaPlus", "/5/test3D/examples/potions/mana_+.png");
    this.load.image("force", "/5/test3D/examples/potions/force.png");
    this.load.image("defense", "/5/test3D/examples/potions/defense.png");
    this.load.image("temps", "/5/test3D/examples/potions/temps.png");
    this.load.image("espace", "/5/test3D/examples/potions/espace.png");
    this.load.image("returnButton", "/5/test3D/examples/tpt/bouton_retour.png");

    // Space
    this.load.image(
      "Phaser_tuilesdejeu",
      "/5/test3D/examples/Space/tuiles/TuilesJeu.png"
    );
    this.load.tilemapTiledJSON("carte", "/5/test3D/json/space_map1.json");

    // Charger les assets pour le niveau
    this.load.image("player", "/5/test3D/examples/Space/tuilesJeu.png"); // Personnage initial
    this.load.image("rocket_idle", "/5/test3D/examples/Space/fusee.png");
    this.load.image(
      "rocket_active",
      "/5/test3D/examples/Space/fusee_perso.png"
    );

    this.load.image("space_bg", "/5/test3D/examples/Space/background.png"); // Background de l'espace
    this.load.image("block", "/5/test3D/examples/Space/asteroide-01.png"); // Blocs à éviter
    this.load.image("block2", "/5/test3D/examples/Space/asteroide-02.png"); // Blocs à éviter
    this.load.image("block3", "/5/test3D/examples/Space/asteroide-03.png"); // Blocs à éviter
    this.load.image("block4", "/5/test3D/examples/Space/asteroide-04.png"); // Blocs à éviter
    this.load.image("boss", "/5/test3D/examples/Space/boss.png");
    this.load.image(
      "playerProjectile",
      "/5/test3D/examples/Space/perso_balle1.png"
    );
    this.load.image("laser", "/5/test3D/examples/Space/laser.png");
    this.load.image(
      "arcProjectile",
      "/5/test3D/examples/Space/perso_balle2.png"
    );
    this.load.image(
      "bossProjectile",
      "/5/test3D/examples/Space/tileset-11.png"
    );
    this.load.image("heart", "/5/test3D/examples/coeur/coeur_plein.png");
    this.load.image("bomb", "/5/test3D/examples/Space/bombe.png");
    this.load.image("bomb_center", "/5/test3D/examples/Space/bombe.png");
    this.load.image("enemy_space", "/5/test3D/examples/Space/alien_2.png");
    this.load.image("chest_close", "/5/test3D/examples/coffre/coffre_1.png");
    this.load.image("chest_open", "/5/test3D/examples/coffre/coffre_2.png");
    this.load.image("portal", "/5/test3D/examples/Space/portail.png");
    this.load.image("socle", "/5/test3D/examples/Space/socle_laser.png");
    this.load.image("button_e", "/5/test3D/examples/tpt/bouton.png");
    this.load.image(
      "platform_image",
      "/5/test3D/examples/Space/tuiles/TuilesJeu.png"
    );

    this.load.image(
      "background_espace",
      "/5/test3D/examples/tpt/terrain_combat_espace.png"
    );
    this.load.image(
      "background_desert",
      "/5/test3D/examples/tpt/terrain_combat_pyra.png"
    );
    this.load.image(
      "background_vie",
      "/5/test3D/examples/tpt/terrain_pokemon.png"
    );
    this.load.image(
      "background_tour",
      "/5/test3D/examples/tpt/terrain_combat_tour.png"
    );

    // Load animation ennemy espace
    this.load.image("alien_1", "/5/test3D/examples/Space/alien_1.png");
    this.load.image("alien_2", "/5/test3D/examples/Space/alien_2.png");
    this.load.image("alien_3", "/5/test3D/examples/Space/alien_3.png");
    this.load.image("alien_4", "/5/test3D/examples/Space/alien_4.png");

    // load animation piece mon gars
    this.load.image("piece_01", "/5/test3D/examples/piece/piece-01.png");
    this.load.image("piece_02", "/5/test3D/examples/piece/piece-02.png");
    this.load.image("piece_03", "/5/test3D/examples/piece/piece-03.png");
    this.load.image("piece_04", "/5/test3D/examples/piece/piece-04.png");
    this.load.image("piece_05", "/5/test3D/examples/piece/piece-05.png");
    this.load.image("piece_06", "/5/test3D/examples/piece/piece-06.png");

    // Tour Par Tour
    this.load.image(
      "espace_attaque_enemy_1",
      "/5/test3D/examples/tpt/spritesheet_attaque_espace/attaque_enemy1.png"
    );
    this.load.image(
      "espace_attaque_enemy_2",
      "/5/test3D/examples/tpt/spritesheet_attaque_espace/attaque_enemy2.png"
    );
    this.load.image(
      "espace_attaque_enemy_3",
      "/5/test3D/examples/tpt/spritesheet_attaque_espace/attaque_enemy3.png"
    );
    this.load.image(
      "espace_attaque_enemy_4",
      "/5/test3D/examples/tpt/spritesheet_attaque_espace/attaque_enemy4.png"
    );
    this.load.image(
      "espace_attaque_enemy_5",
      "/5/test3D/examples/tpt/spritesheet_attaque_espace/attaque_enemy5.png"
    );
    this.load.image(
      "espace_attaque_enemy_6",
      "/5/test3D/examples/tpt/spritesheet_attaque_espace/attaque_enemy6.png"
    );
    this.load.image(
      "espace_attaque_enemy_7",
      "/5/test3D/examples/tpt/spritesheet_attaque_espace/attaque_enemy7.png"
    );
    this.load.image(
      "espace_attaque_enemy_8",
      "/5/test3D/examples/tpt/spritesheet_attaque_espace/attaque_enemy8.png"
    );
    this.load.image(
      "espace_attaque_enemy_9",
      "/5/test3D/examples/tpt/spritesheet_attaque_espace/attaque_enemy9.png"
    );
    this.load.image(
      "espace_attaque_enemy_10",
      "/5/test3D/examples/tpt/spritesheet_attaque_espace/attaque_enemy10.png"
    );

    this.load.image(
      "temps_attaque_enemy_1",
      "/5/test3D/examples/tpt/spritesheet_attaque_temps/attaque_enemy1.png"
    );
    this.load.image(
      "temps_attaque_enemy_2",
      "/5/test3D/examples/tpt/spritesheet_attaque_temps/attaque_enemy2.png"
    );
    this.load.image(
      "temps_attaque_enemy_3",
      "/5/test3D/examples/tpt/spritesheet_attaque_temps/attaque_enemy3.png"
    );
    this.load.image(
      "temps_attaque_enemy_4",
      "/5/test3D/examples/tpt/spritesheet_attaque_temps/attaque_enemy4.png"
    );
    this.load.image(
      "temps_attaque_enemy_5",
      "/5/test3D/examples/tpt/spritesheet_attaque_temps/attaque_enemy5.png"
    );
    this.load.image(
      "temps_attaque_enemy_6",
      "/5/test3D/examples/tpt/spritesheet_attaque_temps/attaque_enemy6.png"
    );
    this.load.image(
      "temps_attaque_enemy_7",
      "/5/test3D/examples/tpt/spritesheet_attaque_temps/attaque_enemy7.png"
    );
    this.load.image(
      "temps_attaque_enemy_8",
      "/5/test3D/examples/tpt/spritesheet_attaque_temps/attaque_enemy8.png"
    );
    this.load.image(
      "temps_attaque_enemy_9",
      "/5/test3D/examples/tpt/spritesheet_attaque_temps/attaque_enemy9.png"
    );
    this.load.image(
      "temps_attaque_enemy_10",
      "/5/test3D/examples/tpt/spritesheet_attaque_temps/attaque_enemy10.png"
    );

    this.load.image(
      "vie_attaque_enemy_1",
      "/5/test3D/examples/tpt/spritesheet_attaque_vie/attaque_enemy1.png"
    );
    this.load.image(
      "vie_attaque_enemy_2",
      "/5/test3D/examples/tpt/spritesheet_attaque_vie/attaque_enemy2.png"
    );
    this.load.image(
      "vie_attaque_enemy_3",
      "/5/test3D/examples/tpt/spritesheet_attaque_vie/attaque_enemy3.png"
    );
    this.load.image(
      "vie_attaque_enemy_4",
      "/5/test3D/examples/tpt/spritesheet_attaque_vie/attaque_enemy4.png"
    );
    this.load.image(
      "vie_attaque_enemy_5",
      "/5/test3D/examples/tpt/spritesheet_attaque_vie/attaque_enemy5.png"
    );
    this.load.image(
      "vie_attaque_enemy_6",
      "/5/test3D/examples/tpt/spritesheet_attaque_vie/attaque_enemy6.png"
    );
    this.load.image(
      "vie_attaque_enemy_7",
      "/5/test3D/examples/tpt/spritesheet_attaque_vie/attaque_enemy7.png"
    );
    this.load.image(
      "vie_attaque_enemy_8",
      "/5/test3D/examples/tpt/spritesheet_attaque_vie/attaque_enemy8.png"
    );
    this.load.image(
      "vie_attaque_enemy_9",
      "/5/test3D/examples/tpt/spritesheet_attaque_vie/attaque_enemy9.png"
    );
    this.load.image(
      "vie_attaque_enemy_10",
      "/5/test3D/examples/tpt/spritesheet_attaque_vie/attaque_enemy10.png"
    );

    this.load.image(
      "espace_attente_enemy_1",
      "/5/test3D/examples/tpt/spritesheet_attente_espace/Attente_enemy1.png"
    );
    this.load.image(
      "espace_attente_enemy_2",
      "/5/test3D/examples/tpt/spritesheet_attente_espace/Attente_enemy2.png"
    );
    this.load.image(
      "espace_attente_enemy_3",
      "/5/test3D/examples/tpt/spritesheet_attente_espace/Attente_enemy3.png"
    );
    this.load.image(
      "espace_attente_enemy_4",
      "/5/test3D/examples/tpt/spritesheet_attente_espace/Attente_enemy4.png"
    );
    this.load.image(
      "espace_attente_enemy_5",
      "/5/test3D/examples/tpt/spritesheet_attente_espace/Attente_enemy5.png"
    );
    this.load.image(
      "espace_attente_enemy_6",
      "/5/test3D/examples/tpt/spritesheet_attente_espace/Attente_enemy6.png"
    );
    this.load.image(
      "espace_attente_enemy_7",
      "/5/test3D/examples/tpt/spritesheet_attente_espace/Attente_enemy7.png"
    );
    this.load.image(
      "espace_attente_enemy_8",
      "/5/test3D/examples/tpt/spritesheet_attente_espace/Attente_enemy8.png"
    );

    this.load.image(
      "temps_attente_enemy_1",
      "/5/test3D/examples/tpt/spritesheet_attente_temps/Attente_enemy1.png"
    );
    this.load.image(
      "temps_attente_enemy_2",
      "/5/test3D/examples/tpt/spritesheet_attente_temps/Attente_enemy2.png"
    );
    this.load.image(
      "temps_attente_enemy_3",
      "/5/test3D/examples/tpt/spritesheet_attente_temps/Attente_enemy3.png"
    );
    this.load.image(
      "temps_attente_enemy_4",
      "/5/test3D/examples/tpt/spritesheet_attente_temps/Attente_enemy4.png"
    );
    this.load.image(
      "temps_attente_enemy_5",
      "/5/test3D/examples/tpt/spritesheet_attente_temps/Attente_enemy5.png"
    );
    this.load.image(
      "temps_attente_enemy_6",
      "/5/test3D/examples/tpt/spritesheet_attente_temps/Attente_enemy6.png"
    );
    this.load.image(
      "temps_attente_enemy_7",
      "/5/test3D/examples/tpt/spritesheet_attente_temps/Attente_enemy7.png"
    );
    this.load.image(
      "temps_attente_enemy_8",
      "/5/test3D/examples/tpt/spritesheet_attente_temps/Attente_enemy8.png"
    );

    this.load.image(
      "vie_attente_enemy_1",
      "/5/test3D/examples/tpt/spritesheet_attente_vie/Attente_enemy1.png"
    );
    this.load.image(
      "vie_attente_enemy_2",
      "/5/test3D/examples/tpt/spritesheet_attente_vie/Attente_enemy2.png"
    );
    this.load.image(
      "vie_attente_enemy_3",
      "/5/test3D/examples/tpt/spritesheet_attente_vie/Attente_enemy3.png"
    );
    this.load.image(
      "vie_attente_enemy_4",
      "/5/test3D/examples/tpt/spritesheet_attente_vie/Attente_enemy4.png"
    );
    this.load.image(
      "vie_attente_enemy_5",
      "/5/test3D/examples/tpt/spritesheet_attente_vie/Attente_enemy5.png"
    );
    this.load.image(
      "vie_attente_enemy_6",
      "/5/test3D/examples/tpt/spritesheet_attente_vie/Attente_enemy6.png"
    );
    this.load.image(
      "vie_attente_enemy_7",
      "/5/test3D/examples/tpt/spritesheet_attente_vie/Attente_enemy7.png"
    );
    this.load.image(
      "vie_attente_enemy_8",
      "/5/test3D/examples/tpt/spritesheet_attente_vie/Attente_enemy8.png"
    );

    // ATTAQUE

    this.load.image(
      "attaque_espace_1",
      "/5/test3D/examples/boutons_attaques/espace_1.png"
    );
    this.load.image(
      "attaque_espace_2",
      "/5/test3D/examples/boutons_attaques/espace_2.png"
    );
    this.load.image(
      "attaque_espace_3",
      "/5/test3D/examples/boutons_attaques/espace_3.png"
    );

    this.load.image(
      "attaque_vie_1",
      "/5/test3D/examples/boutons_attaques/vie_1.png"
    );
    this.load.image(
      "attaque_vie_2",
      "/5/test3D/examples/boutons_attaques/vie_2.png"
    );
    this.load.image(
      "attaque_vie_3",
      "/5/test3D/examples/boutons_attaques/vie_3.png"
    );

    this.load.image(
      "attaque_temps_1",
      "/5/test3D/examples/boutons_attaques/temps_1.png"
    );
    this.load.image(
      "attaque_temps_2",
      "/5/test3D/examples/boutons_attaques/temps_2.png"
    );
    this.load.image(
      "attaque_temps_3",
      "/5/test3D/examples/boutons_attaques/temps_3.png"
    );

    this.load.image(
      "attaque_normal_1",
      "/5/test3D/examples/boutons_attaques/normal_1.png"
    );
    this.load.image(
      "attaque_normal_2",
      "/5/test3D/examples/boutons_attaques/normal_2.png"
    );
    this.load.image(
      "attaque_normal_3",
      "/5/test3D/examples/boutons_attaques/normal_3.png"
    );

    this.load.image(
      "attaque_normal_4",
      "/5/test3D/examples/boutons_attaques/normal_4.png"
    );

    this.load.image(
      "espace_attaque_dieux_1",
      "/5/test3D/examples/tpt/attaques/espace/attaque_enemy1.png"
    );

    this.load.image(
      "espace_attaque_dieux_2",
      "/5/test3D/examples/tpt/attaques/espace/attaque_enemy2.png"
    );

    this.load.image(
      "espace_attaque_dieux_3",
      "/5/test3D/examples/tpt/attaques/espace/attaque_enemy3.png"
    );

    this.load.image(
      "espace_attaque_dieux_4",
      "/5/test3D/examples/tpt/attaques/espace/attaque_enemy4.png"
    );

    this.load.image(
      "espace_attaque_dieux_5",
      "/5/test3D/examples/tpt/attaques/espace/attaque_enemy5.png"
    );

    this.load.image(
      "espace_attaque_dieux_6",
      "/5/test3D/examples/tpt/attaques/espace/attaque_enemy6.png"
    );

    this.load.image(
      "espace_attaque_dieux_7",
      "/5/test3D/examples/tpt/attaques/espace/attaque_enemy7.png"
    );

    this.load.image(
      "espace_attaque_dieux_8",
      "/5/test3D/examples/tpt/attaques/espace/attaque_enemy8.png"
    );

    this.load.image(
      "espace_attaque_dieux_9",
      "/5/test3D/examples/tpt/attaques/espace/attaque_enemy9.png"
    );

    this.load.image(
      "espace_attaque_dieux_10",
      "/5/test3D/examples/tpt/attaques/espace/attaque_enemy10.png"
    );

    this.load.image(
      "espace_attaque_dieux_11",
      "/5/test3D/examples/tpt/attaques/espace/attaque_enemy11.png"
    );

    this.load.image(
      "espace_attente_dieux_1",
      "/5/test3D/examples/attente_dossier/espace/Attente_enemy1.png"
    );

    this.load.image(
      "espace_attente_dieux_2",
      "/5/test3D/examples/attente_dossier/espace/Attente_enemy2.png"
    );

    this.load.image(
      "espace_attente_dieux_3",
      "/5/test3D/examples/attente_dossier/espace/Attente_enemy3.png"
    );

    this.load.image(
      "espace_attente_dieux_4",
      "/5/test3D/examples/attente_dossier/espace/Attente_enemy4.png"
    );

    this.load.image(
      "espace_attente_dieux_5",
      "/5/test3D/examples/attente_dossier/espace/Attente_enemy5.png"
    );

    this.load.image(
      "espace_attente_dieux_6",
      "/5/test3D/examples/attente_dossier/espace/Attente_enemy6.png"
    );

    this.load.image(
      "espace_attente_dieux_7",
      "/5/test3D/examples/attente_dossier/espace/Attente_enemy7.png"
    );

    this.load.image(
      "espace_attente_dieux_8",
      "/5/test3D/examples/attente_dossier/espace/Attente_enemy8.png"
    );

    this.load.image(
      "espace_attente_dieux_9",
      "/5/test3D/examples/attente_dossier/espace/Attente_enemy9.png"
    );

    this.load.image(
      "espace_attente_dieux_10",
      "/5/test3D/examples/attente_dossier/espace/Attente_enemy10.png"
    );

    this.load.image(
      "espace_attente_dieux_11",
      "/5/test3D/examples/attente_dossier/espace/Attente_enemy11.png"
    );

    this.load.image(
      "lumiere_attaque_dieux_1",
      "/5/test3D/examples/tpt/attaques/lumiere/attaque_enemy1.png"
    );

    this.load.image(
      "lumiere_attaque_dieux_2",
      "/5/test3D/examples/tpt/attaques/lumiere/attaque_enemy2.png"
    );

    this.load.image(
      "lumiere_attaque_dieux_3",
      "/5/test3D/examples/tpt/attaques/lumiere/attaque_enemy3.png"
    );

    this.load.image(
      "lumiere_attaque_dieux_4",
      "/5/test3D/examples/tpt/attaques/lumiere/attaque_enemy4.png"
    );

    this.load.image(
      "lumiere_attaque_dieux_5",
      "/5/test3D/examples/tpt/attaques/lumiere/attaque_enemy5.png"
    );

    this.load.image(
      "lumiere_attaque_dieux_6",
      "/5/test3D/examples/tpt/attaques/lumiere/attaque_enemy6.png"
    );

    this.load.image(
      "lumiere_attaque_dieux_7",
      "/5/test3D/examples/tpt/attaques/lumiere/attaque_enemy7.png"
    );

    this.load.image(
      "lumiere_attaque_dieux_8",
      "/5/test3D/examples/tpt/attaques/lumiere/attaque_enemy8.png"
    );

    this.load.image(
      "lumiere_attaque_dieux_9",
      "/5/test3D/examples/tpt/attaques/lumiere/attaque_enemy9.png"
    );

    this.load.image(
      "lumiere_attaque_dieux_10",
      "/5/test3D/examples/tpt/attaques/lumiere/attaque_enemy10.png"
    );

    this.load.image(
      "lumiere_attaque_dieux_11",
      "/5/test3D/examples/tpt/attaques/lumiere/attaque_enemy11.png"
    );

    this.load.image(
      "lumiere_attente_dieux_1",
      "/5/test3D/examples/attente_dossier/lumiere/Attente_enemy1.png"
    );

    this.load.image(
      "lumiere_attente_dieux_2",
      "/5/test3D/examples/attente_dossier/lumiere/Attente_enemy2.png"
    );

    this.load.image(
      "lumiere_attente_dieux_3",
      "/5/test3D/examples/attente_dossier/lumiere/Attente_enemy3.png"
    );

    this.load.image(
      "lumiere_attente_dieux_4",
      "/5/test3D/examples/attente_dossier/lumiere/Attente_enemy4.png"
    );

    this.load.image(
      "lumiere_attente_dieux_5",
      "/5/test3D/examples/attente_dossier/lumiere/Attente_enemy5.png"
    );

    this.load.image(
      "lumiere_attente_dieux_6",
      "/5/test3D/examples/attente_dossier/lumiere/Attente_enemy6.png"
    );

    this.load.image(
      "lumiere_attente_dieux_7",
      "/5/test3D/examples/attente_dossier/lumiere/Attente_enemy7.png"
    );

    this.load.image(
      "lumiere_attente_dieux_8",
      "/5/test3D/examples/attente_dossier/lumiere/Attente_enemy8.png"
    );

    this.load.image(
      "lumiere_attente_dieux_9",
      "/5/test3D/examples/attente_dossier/lumiere/Attente_enemy9.png"
    );

    this.load.image(
      "lumiere_attente_dieux_10",
      "/5/test3D/examples/attente_dossier/lumiere/Attente_enemy10.png"
    );

    this.load.image(
      "lumiere_attente_dieux_11",
      "/5/test3D/examples/attente_dossier/lumiere/Attente_enemy11.png"
    );

    this.load.image(
      "temps_attaque_dieux_1",
      "/5/test3D/examples/tpt/attaques/temps/attaque_enemy1.png"
    );

    this.load.image(
      "temps_attaque_dieux_2",
      "/5/test3D/examples/tpt/attaques/temps/attaque_enemy2.png"
    );

    this.load.image(
      "temps_attaque_dieux_3",
      "/5/test3D/examples/tpt/attaques/temps/attaque_enemy3.png"
    );

    this.load.image(
      "temps_attaque_dieux_4",
      "/5/test3D/examples/tpt/attaques/temps/attaque_enemy4.png"
    );

    this.load.image(
      "temps_attaque_dieux_5",
      "/5/test3D/examples/tpt/attaques/temps/attaque_enemy5.png"
    );

    this.load.image(
      "temps_attaque_dieux_6",
      "/5/test3D/examples/tpt/attaques/temps/attaque_enemy6.png"
    );

    this.load.image(
      "temps_attaque_dieux_7",
      "/5/test3D/examples/tpt/attaques/temps/attaque_enemy7.png"
    );

    this.load.image(
      "temps_attaque_dieux_8",
      "/5/test3D/examples/tpt/attaques/temps/attaque_enemy8.png"
    );

    this.load.image(
      "temps_attaque_dieux_9",
      "/5/test3D/examples/tpt/attaques/temps/attaque_enemy9.png"
    );

    this.load.image(
      "temps_attaque_dieux_10",
      "/5/test3D/examples/tpt/attaques/temps/attaque_enemy10.png"
    );

    this.load.image(
      "temps_attaque_dieux_11",
      "/5/test3D/examples/tpt/attaques/temps/attaque_enemy11.png"
    );

    this.load.image(
      "temps_attente_dieux_1",
      "/5/test3D/examples/attente_dossier/temps/Attente_enemy1.png"
    );

    this.load.image(
      "temps_attente_dieux_2",
      "/5/test3D/examples/attente_dossier/temps/Attente_enemy2.png"
    );

    this.load.image(
      "temps_attente_dieux_3",
      "/5/test3D/examples/attente_dossier/temps/Attente_enemy3.png"
    );

    this.load.image(
      "temps_attente_dieux_4",
      "/5/test3D/examples/attente_dossier/temps/Attente_enemy4.png"
    );

    this.load.image(
      "temps_attente_dieux_5",
      "/5/test3D/examples/attente_dossier/temps/Attente_enemy5.png"
    );

    this.load.image(
      "temps_attente_dieux_6",
      "/5/test3D/examples/attente_dossier/temps/Attente_enemy6.png"
    );

    this.load.image(
      "temps_attente_dieux_7",
      "/5/test3D/examples/attente_dossier/temps/Attente_enemy7.png"
    );

    this.load.image(
      "temps_attente_dieux_8",
      "/5/test3D/examples/attente_dossier/temps/Attente_enemy8.png"
    );

    this.load.image(
      "temps_attente_dieux_9",
      "/5/test3D/examples/attente_dossier/temps/Attente_enemy9.png"
    );

    this.load.image(
      "temps_attente_dieux_10",
      "/5/test3D/examples/attente_dossier/temps/Attente_enemy10.png"
    );

    this.load.image(
      "temps_attente_dieux_11",
      "/5/test3D/examples/attente_dossier/temps/Attente_enemy11.png"
    );

    this.load.image(
      "vie_attaque_dieux_1",
      "/5/test3D/examples/tpt/attaques/vie/attaque_enemy1.png"
    );

    this.load.image(
      "vie_attaque_dieux_2",
      "/5/test3D/examples/tpt/attaques/vie/attaque_enemy2.png"
    );

    this.load.image(
      "vie_attaque_dieux_3",
      "/5/test3D/examples/tpt/attaques/vie/attaque_enemy3.png"
    );

    this.load.image(
      "vie_attaque_dieux_4",
      "/5/test3D/examples/tpt/attaques/vie/attaque_enemy4.png"
    );

    this.load.image(
      "vie_attaque_dieux_5",
      "/5/test3D/examples/tpt/attaques/vie/attaque_enemy5.png"
    );

    this.load.image(
      "vie_attaque_dieux_6",
      "/5/test3D/examples/tpt/attaques/vie/attaque_enemy6.png"
    );

    this.load.image(
      "vie_attaque_dieux_7",
      "/5/test3D/examples/tpt/attaques/vie/attaque_enemy7.png"
    );

    this.load.image(
      "vie_attaque_dieux_8",
      "/5/test3D/examples/tpt/attaques/vie/attaque_enemy8.png"
    );

    this.load.image(
      "vie_attaque_dieux_9",
      "/5/test3D/examples/tpt/attaques/vie/attaque_enemy9.png"
    );

    this.load.image(
      "vie_attaque_dieux_10",
      "/5/test3D/examples/tpt/attaques/vie/attaque_enemy10.png"
    );

    this.load.image(
      "vie_attaque_dieux_11",
      "/5/test3D/examples/tpt/attaques/vie/attaque_enemy11.png"
    );

    this.load.image(
      "vie_attente_dieux_1",
      "/5/test3D/examples/attente_dossier/vie/Attente_enemy1.png"
    );

    this.load.image(
      "vie_attente_dieux_2",
      "/5/test3D/examples/attente_dossier/vie/Attente_enemy2.png"
    );

    this.load.image(
      "vie_attente_dieux_3",
      "/5/test3D/examples/attente_dossier/vie/Attente_enemy3.png"
    );

    this.load.image(
      "vie_attente_dieux_4",
      "/5/test3D/examples/attente_dossier/vie/Attente_enemy4.png"
    );

    this.load.image(
      "vie_attente_dieux_5",
      "/5/test3D/examples/attente_dossier/vie/Attente_enemy5.png"
    );

    this.load.image(
      "vie_attente_dieux_6",
      "/5/test3D/examples/attente_dossier/vie/Attente_enemy6.png"
    );

    this.load.image(
      "vie_attente_dieux_7",
      "/5/test3D/examples/attente_dossier/vie/Attente_enemy7.png"
    );

    this.load.image(
      "vie_attente_dieux_8",
      "/5/test3D/examples/attente_dossier/vie/Attente_enemy8.png"
    );

    this.load.image(
      "vie_attente_dieux_9",
      "/5/test3D/examples/attente_dossier/vie/Attente_enemy9.png"
    );

    this.load.image(
      "vie_attente_dieux_10",
      "/5/test3D/examples/attente_dossier/vie/Attente_enemy10.png"
    );

    this.load.image(
      "vie_attente_dieux_11",
      "/5/test3D/examples/attente_dossier/vie/Attente_enemy11.png"
    );

    this.load.image("bonny1", "/5/test3D/examples/bonny/bonny_01.png");

    this.load.image("bonny2", "/5/test3D/examples/bonny/bonny_02.png");

    this.load.image("bonny3", "/5/test3D/examples/bonny/bonny_03.png");

    this.load.image("bonny4", "/5/test3D/examples/bonny/bonny_04.png");

    this.load.image("bonny5", "/5/test3D/examples/bonny/bonny_05.png");

    this.load.image("bonny6", "/5/test3D/examples/bonny/bonny_06.png");

    this.load.image("bonny7", "/5/test3D/examples/bonny/bonny_07.png");

    this.load.image("bonny8", "/5/test3D/examples/bonny/bonny_08.png");

    this.load.image("bonny9", "/5/test3D/examples/bonny/bonny_08.png");
  }
  create() {
    this.anims.create({
      key: "anim_bonny",
      frames: [
        { key: "bonny1" },
        { key: "bonny2" },
        { key: "bonny3" },
        { key: "bonny4" },
        { key: "bonny5" },
        { key: "bonny6" },
        { key: "bonny7" },
        { key: "bonny8" },
        { key: "bonny9" },
      ],
      frameRate: 7,
      repeat: -1,
    });

    // Animation Tour par Tour
    this.anims.create({
      key: "vie_attaque_dieux",
      frames: [
        { key: "vie_attaque_dieux_1" },
        { key: "vie_attaque_dieux_2" },
        { key: "vie_attaque_dieux_3" },
        { key: "vie_attaque_dieux_4" },
        { key: "vie_attaque_dieux_5" },
        { key: "vie_attaque_dieux_6" },
        { key: "vie_attaque_dieux_7" },
        { key: "vie_attaque_dieux_8" },
        { key: "vie_attaque_dieux_9" },
        { key: "vie_attaque_dieux_10" },
        { key: "vie_attaque_dieux_11" },
      ],
      frameRate: 15,
      repeat: 0,
    });

    this.anims.create({
      key: "vie_attente_dieux",
      frames: [
        { key: "vie_attente_dieux_1" },
        { key: "vie_attente_dieux_2" },
        { key: "vie_attente_dieux_3" },
        { key: "vie_attente_dieux_4" },
        { key: "vie_attente_dieux_5" },
        { key: "vie_attente_dieux_6" },
        { key: "vie_attente_dieux_7" },
        { key: "vie_attente_dieux_8" },
        { key: "vie_attente_dieux_9" },
        { key: "vie_attente_dieux_10" },
        { key: "vie_attente_dieux_11" },
      ],
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: "temps_attaque_dieux",
      frames: [
        { key: "temps_attaque_dieux_1" },
        { key: "temps_attaque_dieux_2" },
        { key: "temps_attaque_dieux_3" },
        { key: "temps_attaque_dieux_4" },
        { key: "temps_attaque_dieux_5" },
        { key: "temps_attaque_dieux_6" },
        { key: "temps_attaque_dieux_7" },
        { key: "temps_attaque_dieux_8" },
        { key: "temps_attaque_dieux_9" },
        { key: "temps_attaque_dieux_10" },
        { key: "temps_attaque_dieux_11" },
      ],
      frameRate: 15,
      repeat: 0,
    });

    this.anims.create({
      key: "temps_attente_dieux",
      frames: [
        { key: "temps_attente_dieux_1" },
        { key: "temps_attente_dieux_2" },
        { key: "temps_attente_dieux_3" },
        { key: "temps_attente_dieux_4" },
        { key: "temps_attente_dieux_5" },
        { key: "temps_attente_dieux_6" },
        { key: "temps_attente_dieux_7" },
        { key: "temps_attente_dieux_8" },
        { key: "temps_attente_dieux_9" },
        { key: "temps_attente_dieux_10" },
        { key: "temps_attente_dieux_11" },
      ],
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: "lumiere_attaque_dieux",
      frames: [
        { key: "lumiere_attaque_dieux_1" },
        { key: "lumiere_attaque_dieux_2" },
        { key: "lumiere_attaque_dieux_3" },
        { key: "lumiere_attaque_dieux_4" },
        { key: "lumiere_attaque_dieux_5" },
        { key: "lumiere_attaque_dieux_6" },
        { key: "lumiere_attaque_dieux_7" },
        { key: "lumiere_attaque_dieux_8" },
        { key: "lumiere_attaque_dieux_9" },
        { key: "lumiere_attaque_dieux_10" },
        { key: "lumiere_attaque_dieux_11" },
      ],
      frameRate: 15,
      repeat: 0,
    });

    this.anims.create({
      key: "lumiere_attente_dieux_",
      frames: [
        { key: "lumiere_attente_dieux_1" },
        { key: "lumiere_attente_dieux_2" },
        { key: "lumiere_attente_dieux_3" },
        { key: "lumiere_attente_dieux_4" },
        { key: "lumiere_attente_dieux_5" },
        { key: "lumiere_attente_dieux_6" },
        { key: "lumiere_attente_dieux_7" },
        { key: "lumiere_attente_dieux_8" },
        { key: "lumiere_attente_dieux_9" },
        { key: "lumiere_attente_dieux_10" },
        { key: "lumiere_attente_dieux_11" },
      ],
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: "attaque_espace_dieux",
      frames: [
        { key: "espace_attaque_dieux_1" },
        { key: "espace_attaque_dieux_2" },
        { key: "espace_attaque_dieux_3" },
        { key: "espace_attaque_dieux_4" },
        { key: "espace_attaque_dieux_5" },
        { key: "espace_attaque_dieux_6" },
        { key: "espace_attaque_dieux_7" },
        { key: "espace_attaque_dieux_8" },
        { key: "espace_attaque_dieux_9" },
        { key: "espace_attaque_dieux_10" },
        { key: "espace_attaque_dieux_11" },
      ],
      frameRate: 15,
      repeat: 0,
    });

    this.anims.create({
      key: "attente_espace_dieux",
      frames: [
        { key: "espace_attente_dieux_1" },
        { key: "espace_attente_dieux_2" },
        { key: "espace_attente_dieux_3" },
        { key: "espace_attente_dieux_4" },
        { key: "espace_attente_dieux_5" },
        { key: "espace_attente_dieux_6" },
        { key: "espace_attente_dieux_7" },
        { key: "espace_attente_dieux_8" },
        { key: "espace_attente_dieux_9" },
        { key: "espace_attente_dieux_10" },
        { key: "espace_attente_dieux_11" },
      ],
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: "attaque_vie_enemy",
      frames: [
        { key: "vie_attaque_enemy_1" },
        { key: "vie_attaque_enemy_2" },
        { key: "vie_attaque_enemy_3" },
        { key: "vie_attaque_enemy_4" },
        { key: "vie_attaque_enemy_5" },
        { key: "vie_attaque_enemy_6" },
        { key: "vie_attaque_enemy_7" },
        { key: "vie_attaque_enemy_8" },
        { key: "vie_attaque_enemy_9" },
        { key: "vie_attaque_enemy_10" },
      ],
      frameRate: 15,
      repeat: 0,
    });

    this.anims.create({
      key: "attaque_temps_enemy",
      frames: [
        { key: "temps_attaque_enemy_1" },
        { key: "temps_attaque_enemy_2" },
        { key: "temps_attaque_enemy_3" },
        { key: "temps_attaque_enemy_4" },
        { key: "temps_attaque_enemy_5" },
        { key: "temps_attaque_enemy_6" },
        { key: "temps_attaque_enemy_7" },
        { key: "temps_attaque_enemy_8" },
        { key: "temps_attaque_enemy_9" },
        { key: "temps_attaque_enemy_10" },
      ],
      frameRate: 15,
      repeat: 0,
    });

    this.anims.create({
      key: "attaque_espace_enemy",
      frames: [
        { key: "espace_attaque_enemy_1" },
        { key: "espace_attaque_enemy_2" },
        { key: "espace_attaque_enemy_3" },
        { key: "espace_attaque_enemy_4" },
        { key: "espace_attaque_enemy_5" },
        { key: "espace_attaque_enemy_6" },
        { key: "espace_attaque_enemy_7" },
        { key: "espace_attaque_enemy_8" },
        { key: "espace_attaque_enemy_9" },
        { key: "espace_attaque_enemy_10" },
      ],
      frameRate: 15,
      repeat: 0,
    });

    this.anims.create({
      key: "attente_vie_enemy",
      frames: [
        { key: "vie_attente_enemy_1" },
        { key: "vie_attente_enemy_2" },
        { key: "vie_attente_enemy_3" },
        { key: "vie_attente_enemy_4" },
        { key: "vie_attente_enemy_5" },
        { key: "vie_attente_enemy_6" },
        { key: "vie_attente_enemy_7" },
        { key: "vie_attente_enemy_8" },
      ],
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "attente_temps_enemy",
      frames: [
        { key: "temps_attente_enemy_1" },
        { key: "temps_attente_enemy_2" },
        { key: "temps_attente_enemy_3" },
        { key: "temps_attente_enemy_4" },
        { key: "temps_attente_enemy_5" },
        { key: "temps_attente_enemy_6" },
        { key: "temps_attente_enemy_7" },
        { key: "temps_attente_enemy_8" },
      ],
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "attente_espace_enemy",
      frames: [
        { key: "espace_attente_enemy_1" },
        { key: "espace_attente_enemy_2" },
        { key: "espace_attente_enemy_3" },
        { key: "espace_attente_enemy_4" },
        { key: "espace_attente_enemy_5" },
        { key: "espace_attente_enemy_6" },
        { key: "espace_attente_enemy_7" },
        { key: "espace_attente_enemy_8" },
      ],
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "attaquedroite",
      frames: [
        { key: "attaquedroite_1" },
        { key: "attaquedroite_2" },
        { key: "attaquedroite_3" },
        { key: "attaquedroite_4" },
        { key: "attaquedroite_5" },
        { key: "attaquedroite_6" },
        { key: "attaquedroite_7" },
        { key: "attaquedroite_8" },
      ],
      frameRate: 12,
      repeat: 0,
    });

    // Animation d'attente (idle)
    this.anims.create({
      key: "idle",
      frames: [
        { key: "idle_1" },
        { key: "idle_2" },
        { key: "idle_3" },
        { key: "idle_4" },
        { key: "idle_5" },
        { key: "idle_6" },
      ],
      frameRate: 6,
      repeat: -1,
    });
    // chargement des scenes
    this.scene.add("monde", monde, false);
    this.scene.add("tpt", tpt, false);
    this.scene.add("cook", Cook, false);
    this.scene.add("MarchandScene", MarchandScene, false);
    this.scene.add("Plateformer_map1", Plateformer_map1, false);
    this.scene.add("Plateformer_map2", Plateformer_map2, false);
    this.scene.add("Plateformer_map3", Plateformer_map3, false);

    this.scene.add("Laby_map1", Laby_map1, false);
    this.scene.add("Laby_map2", Laby_map2, false);
    this.scene.add("Laby_map3", Laby_map3, false);

    this.scene.add("SpaceLevel", SpaceLevel, false);
    this.scene.add("RocketLevel", RocketLevel, false);
    this.scene.add("BossLevel", BossLevel, false);
    this.scene.add("DialogueScene", DialogueScene, false);
    this.scene.add("DialogueScene2", DialogueScene2, false);
    this.scene.add("Dialogue", Dialogue, false);

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

// CACTUS

const cactusTextures = {};

const textureCactusPaths = ["/5/test3D/examples/éléments desert/cactus.png"];

textureCactusPaths.forEach((path) => {
  textureLoader.load(path, (texture) => {
    cactusTextures[path] = texture;
  });
});

export const getCactusTexture = (path) => cactusTextures[path];

// ROCHER

const rocherTextures = {};

const textureRocherPaths = [
  "/5/test3D/examples/éléments desert/pierre1.png",
  "/5/test3D/examples/éléments desert/pierre2.png",
  "/5/test3D/examples/éléments desert/pyramide1.png",
];

textureRocherPaths.forEach((path) => {
  textureLoader.load(path, (texture) => {
    rocherTextures[path] = texture;
  });
});

export const getRockTexture = (path) => rocherTextures[path];

// Deco desert

const decoTextures = {};

const decoPaths = [
  "/5/test3D/examples/éléments desert/crane.png",
  "/5/test3D/examples/éléments desert/plante1.png",
  "/5/test3D/examples/éléments desert/plante2.png",
  "/5/test3D/examples/éléments desert/plantemorte.png",
  "/5/test3D/examples/éléments desert/arbremort.png",
];

decoPaths.forEach((path) => {
  textureLoader.load(path, (texture) => {
    decoTextures[path] = texture;
  });
});

export const getDecoTexture = (path) => decoTextures[path];

// Bulding

const buildingTextures = {};

const buildingPaths = [
  "/5/test3D/examples/espace/espace-07.png",
  "/5/test3D/examples/espace/espace-17.png",
  "/5/test3D/examples/espace/espace-14.png",
  "/5/test3D/examples/espace/espace-18.png",
  "/5/test3D/examples/espace/espace-15.png",
  "/5/test3D/examples/espace/espace-12.png",
];

buildingPaths.forEach((path) => {
  textureLoader.load(path, (texture) => {
    buildingTextures[path] = texture;
  });
});

export const getBuildingTexture = (path) => buildingTextures[path];
