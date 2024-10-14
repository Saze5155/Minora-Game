export default class BiomeManager {
  constructor(scene) {
    this.scene = scene;
    this.currentBiome = null;
    this.sounds = {};
  }

  create() {
    // Ajouter les musiques à la scène
    this.sounds.nature = this.scene.sound.add("nature_music", { loop: true });
    this.sounds.desert = this.scene.sound.add("desert_music", { loop: true });
    this.sounds.space = this.scene.sound.add("space_music", { loop: true });

    // Démarrer avec la musique par défaut (par exemple, Nature)
    this.currentBiome = "nature";
    this.sounds.nature.play();
  }

  update(player) {
    const playerX = player.walkPlane.position.x;
    const playerZ = player.walkPlane.position.z;

    // Détecter le biome en fonction de la position du joueur
    let newBiome = null;
    if (playerX < 100 && playerZ > 100) {
      newBiome = "nature";
    } else if (playerX > 100 && playerZ < 100) {
      newBiome = "desert";
    } else {
      newBiome = "space";
    }

    // Si le joueur change de biome, on arrête l'ancienne musique et on joue la nouvelle
    if (newBiome !== this.currentBiome) {
      this.changeBiomeMusic(newBiome);
    }
  }

  changeBiomeMusic(newBiome) {
    // Arrêter la musique du biome précédent
    if (this.currentBiome) {
      this.sounds[this.currentBiome].stop();
    }

    // Jouer la musique du nouveau biome
    this.sounds[newBiome].play();

    // Mettre à jour le biome actuel
    this.currentBiome = newBiome;
  }
}
