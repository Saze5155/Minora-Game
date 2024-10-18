export default class PNJBiomes {
  constructor(scene, x, y, z, player) {
    this.scene = scene;
    this.player = player;

    this.dialogueElements = []; // Pour stocker les éléments de dialogue à supprimer plus tard

    // PNJ setup (mesh and position)
    const texture = new THREE.TextureLoader().load("/5/test3D/examples/tp.png");
    const geometry = new THREE.PlaneGeometry(1.5, 3);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.5,
    });

    this.marchandMesh = new THREE.Mesh(geometry, material);
    this.marchandMesh.position.set(x, y, z);

    scene.third.physics.add.existing(this.marchandMesh, {
      shape: "box",
      depth: 2,
      mass: 0,
    });
    scene.third.scene.add(this.marchandMesh);

    // Biomes coordinates
    this.biomes = {
      nature: { x: -95, z: -62 },
      desert: { x: 111, z: 46 },
      espace: { x: -70, z: 193 },
    };
  }

  // Affiche les options de biomes pour le joueur
  showBiomeOptions() {
    // Afficher le rectangle et le texte "Bonjour, où veux-tu aller ?"
    this.showDialogue();
  
    const options = Object.keys(this.biomes);
  
    options.forEach((biome) => {
      const button = this.scene.add.text(
        200, // Position horizontale
        this.scene.cameras.main.height - 180 + options.indexOf(biome) * 30, // Sous le rectangle
        `Aller vers le biome ${biome}`,
        {
          fontSize: "24px",
          color: "#ffffff",
        }
      );
  
      button.setInteractive();
      button.on("pointerdown", () => {
        this.fadeOutAndTeleport(biome); // Ajouter un fondu et téléportation
      });
  
      this.dialogueElements.push(button); // Ajouter l'élément au tableau pour pouvoir le supprimer après
    });
  
    if (Global.badges.length == 3) {
      const tourButton = this.scene.add.text(
        200, 
        this.scene.cameras.main.height - 180 + options.length * 30, 
        `Aller à la Tour`,
        {
          fontSize: "24px",
          color: "#ffffff",
        }
      );
  
      tourButton.setInteractive();
      tourButton.on("pointerdown", () => {
        if (!Global.DieuxVieBattu){
          Global.enemyId = 7
         }else if (!Global.DieuxEspaceBattu){
          Global.enemyId = 4
         }
        else if(!Global.DieuxtempsBattu){
          Global.enemyId = 6
        }else{        
          Global.enemyId = 5
        }
        this.scene.start("tpt"); 
      });
  
      this.dialogueElements.push(tourButton); // Ajouter l'élément au tableau pour pouvoir le supprimer après
    }
  
    this.escKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );
    this.escKey.on("down", () => {
      this.clearDialogue(); // Annuler le dialogue en appuyant sur Échap
    });
  }
  

  // Affiche le rectangle de dialogue en bas de l'écran
  showDialogue() {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Rectangle noir plus grand (hauteur ajustée ici)
    const dialogueBox = this.scene.add.graphics();
    dialogueBox.fillStyle(0x000000, 0.8); // Fond noir semi-transparent
    dialogueBox.fillRect(50, height - 250, width - 100, 200);
    this.dialogueElements.push(dialogueBox);

    // Ajouter le texte du dialogue "Bonjour, où veux-tu aller ?"
    const dialogueText = this.scene.add.text(
      100,
      height - 220, // Ajuster la position verticale pour le texte
      "Bonjour, où veux tu te diriger ?",
      {
        fontSize: "28px",
        color: "#ffffff", // Utiliser du blanc pour plus de visibilité
        fontStyle: "bold",
      }
    );

    this.dialogueElements.push(dialogueText);
  }

  hideDialogue() {
    // Supprimer tous les éléments de dialogue (texte, fond noir, boutons)
    if (this.dialogueElements && this.dialogueElements.length > 0) {
      this.dialogueElements.forEach((element) => {
        if (element && element.destroy) {
          element.destroy();
        }
      });
    }

    // Supprimer l'écoute de la touche Échap
    if (this.escKey) {
      this.escKey.off("down"); // Désactiver l'écoute de l'événement Échap
      this.escKey = null;
    }

    this.dialogueElements = []; // Vider le tableau après suppression

    // Debug pour s'assurer que le dialogue a été caché
    console.log("Dialogue caché avec succès.");
  }

  // Supprimer tous les éléments de dialogue
  clearDialogue() {
    this.dialogueElements.forEach((element) => element.destroy());
    this.dialogueElements = []; // Vider le tableau
  }

  // Effectuer le fondu au noir, téléportation puis fondu de retour
  fadeOutAndTeleport(biome) {
    // Pause de la scène avant la téléportation
    this.scene.physics.pause();

    // Début du fondu au noir
    this.scene.cameras.main.fadeOut(1000, 0, 0, 0);

    this.scene.time.delayedCall(1000, () => {
      const coords = this.biomes[biome];

      // Si les coordonnées du biome sont valides
      if (coords) {
        // Supprimer l'ancien joueur
        if (this.player.walkPlane) {
          this.scene.third.scene.remove(this.player.walkPlane);
          this.player.walkPlane.geometry.dispose();
          this.player.walkPlane.material.dispose();
          this.scene.third.physics.destroy(this.player.walkPlane.body); // Détruire la physique associée
        }

        this.scene.recreatePlayerAt(coords.x, coords.z);
        this.scene.changeMusic(biome);

        this.player = this.scene.player;
        this.player.changeBiome(biome);
        this.scene.destroyAllEnemiesAndAnimals();
        this.scene.spawnEnemiesAndAnimals(biome);
        this.player.changeWalkSound(biome);
      }

      // Effacer les textes du dialogue après la téléportation
      this.clearDialogue();

      // Faire le fondu retour après la téléportation
      this.scene.cameras.main.fadeIn(1000, 0, 0, 0);

      // Reprendre la physique après le fondu
      this.scene.time.delayedCall(1000, () => {
        this.scene.physics.resume(); // Reprise de la physique
      });
    });
  }
}
