import Global from "/5/test3D/js/inventaire.js";

export default class tpt extends Phaser.Scene {
  constructor() { 
    super({ key: "tpt" });
    this.isPlayerTurn = true; // Initialement, c'est le tour du joueur
    this.combatEnded = false; // Initialement, le combat n'est pas terminé
    this.isInitialized = false; 
    // Stats de combat de base
    this.playerHP = 200; // Points de vie du joueur
    this.playerMP = 25; // Points de mana du joueur
    this.enemyHP = 200; // Points de vie de l'ennemi
    this.enemyMP = 25; // Points de mana de l'ennemi

    // Variables pour gérer l'état d'affichage des menus
    this.attackMenuVisible = false;
    this.potionMenuVisible = false;

    // Animation-related variables
    this.playerTextures = []; // Initialisation ici
    this.attackTextures = []; // Pour l'animation d'attaque, initialisation ici
    this.currentFrame = 0;
    this.animAttack = ""
    this.animeIdle = ""
  
  }

  loadEnemyData(enemyId) {
    let attack =""
    let idle =""
    let background = ""
    let frame = ""


    if(enemyId == 1){    
        attack = "attaque_vie_enemy";
        idle = "attente_vie_enemy";
        background = "background_vie";
        frame ='vie_attente_enemy_1';
    }else if(enemyId == 2){
        attack = "attaque_espace_enemy";
        idle = "attente_espace_enemy";
        background = "background_espace";
        frame ='espace_attente_enemy_1';
    }else if(enemyId == 3){
        attack =  "attaque_temps_enemy";
        idle = "attente_temps_enemy";
        background = "background_temps";
        frame ='temps_attente_enemy_1'
    }else if(enemyId == 4){
      attack =  "attaque_espace_dieux";
      idle = "attente_espace_dieux";
      background = "background_tour";
      frame ='espace_attente_dieux_1'
    }else if(enemyId == 5){
      attack =  "lumiere_attaque_dieux";
      idle = "lumiere_attente_dieux_";
      background = "background_tour";
      frame ='lumiere_attente_dieux_1'
    }else if(enemyId == 6){
      attack =  "temps_attaque_dieux";
      idle = "temps_attente_dieux";
      background = "background_tour";
      frame ='temps_attente_dieux_1'
    }else if(enemyId == 7){
      attack =  "vie_attaque_dieux";
      idle = "vie_attente_dieux";
      background = "background_tour";
      frame ='vie_attente_dieux_1'
    }

    
    
    this.frame = frame
    this.animAttack = attack
    this.animeIdle = idle

    console.log()

    this.background = this.add.image(0, 0, background);
    this.background.setOrigin(0, 0);
    this.background.setDepth(-1); 
    this.background.setDisplaySize(this.scale.width, this.scale.height);
    this.enemy = this.add.sprite(600, 300, this.frame); 

    if (enemyId > 3) {
      this.enemy.setScale(0.2); // Appliquer une échelle réduite pour les ennemis avec ID > 3
  } else {
      this.enemy.setScale(1); // Taille normale pour les autres
  }

  
  if (enemyId == 5) {
    this.scene.launch("DialogueScene2");
    this.enemyHP = 400;
  }

  if (enemyId == 4 || enemyId == 6 || enemyId == 7) {
    this.enemyHP = 300; // Points de vie de l'ennemi
  }

  

this.enemy.setDepth(10)
this.enemy.setFlipX(true);


    //this.setupUI(); // Méthode pour initialiser les barres de vie, boutons, etc.
  
  // this.startAnimation();



  // Global.giveAllPotions();

  // Ajouter le background et le redimensionner
  // const background = this.add.image(0, 0, "background");
  // background.setOrigin(0, 0);
  // background.setDisplaySize(this.scale.width, this.scale.height);

  // Redimensionner le background si l'écran change de taille
  // this.scale.on("resize", (gameSize) => {
  //   const { width, height } = gameSize;
  //   background.setDisplaySize(width, height);
  // });

  // Afficher le joueur avec la première image de l'animation
  this.player = this.add.sprite(100, 400, "idle_1");
  this.player.setScale(0.2);
  // this.createEnemyElements();
  console.log(this.enemy1IddleTextures);

  this.startenemyIdleAnimation();

  // Ajouter les barres de vie et MP du joueur et de l'ennemi
  this.playerHealthBar = this.add.rectangle(100, 360, 100, 10, 0x00ff00);
  this.playerMPText = this.add.text(100, 390, `MANA: ${this.playerMP}`, {
    fontSize: "24px",
    fill: "#fff",
  });
  this.enemyHealthBar = this.add.rectangle(600, 60, 100, 10, 0x00ff00);
  this.enemyMPText = this.add.text(600, 90, `MANA : ${this.enemyMP}`, {
    fontSize: "24px",
    fill: "#fff",
  });

  // Afficher temporairement les HP du joueur
  // this.playerHPText = this.add.text(100, 340, `HP: ${this.playerHP}`, {
  //   fontSize: "24px",
  //   fill: "#fff",
  // });

  // Afficher temporairement les HP de l'ennemi
  // this.enemyHPText = this.add.text(600, 30, `HP: ${this.enemyHP}`, {
  //   fontSize: "24px",
  //   fill: "#fff",
  // });

  // Chatbox pour les actions du joueur et de l'ennemi
  this.playerActionTextBox = this.add.text(50, 300, "", {
    fontSize: "30px",
    fill: "#00ff00",
    fontWeight: "900",
  });
  this.enemyActionTextBox = this.add.text(450, 150, "", {
    fontSize: "30px",
    fill: "#ff0000",
    fontWeight: "900",
  });

  // Positionner les éléments du joueur et de l'ennemi
  this.positionPlayerElements();
  this.positionEnemyElements();

  // Positionner les boutons en bas à droite dans l'ordre souhaité : attack, defense, potion, flee
  const buttonSpacing = 200;

  // Bouton fuite (flee)
  this.fleeButton = this.add
    .image(this.scale.width - 100, this.scale.height - 100, "fleeButton")
    .setInteractive();
  this.createButton(this.fleeButton);

  // Bouton potion
  this.potionButton = this.add
    .image(
      this.scale.width - (100 + buttonSpacing),
      this.scale.height - 100,
      "potionButton"
    )
    .setInteractive();
  this.createButton(this.potionButton);

  // Bouton défense
  this.defendButton = this.add
    .image(
      this.scale.width - (100 + buttonSpacing * 2),
      this.scale.height - 100,
      "defendButton"
    )
    .setInteractive();
  this.createButton(this.defendButton);

  // Bouton attaque
  this.attackButton = this.add
    .image(
      this.scale.width - (100 + buttonSpacing * 3),
      this.scale.height - 100,
      "attackButton"
    )
    .setInteractive();
  this.createButton(this.attackButton);

  // Repositionner les boutons si l'écran est redimensionné
  this.scale.on("resize", (gameSize) => {
    const { width, height } = gameSize;
    background.setDisplaySize(width, height);

    this.fleeButton.setPosition(width - 100, height - 100);
    this.potionButton.setPosition(
      width - (100 + buttonSpacing),
      height - 100
    );
    this.defendButton.setPosition(
      width - (100 + buttonSpacing * 2),
      height - 100
    );
    this.attackButton.setPosition(
      width - (100 + buttonSpacing * 3),
      height - 100
    );
  });

  // Bouton de fuite pour revenir à "monde"
  this.fleeButton.on("pointerdown", () => this.fleeCombat());

  // Actions au clic des boutons
  this.attackButton.on("pointerdown", () => this.showAttackMenu());
  this.defendButton.on("pointerdown", () =>
    this.playerDefend(Global.defenses[0])
  );
  this.potionButton.on("pointerdown", () => this.showPotionMenu());

  // Zone pour le message de fin de combat
  this.endMessage = this.add
    .text(400, 300, "", { fontSize: "32px", fill: "#fff" })
    .setOrigin(0.5)
    .setVisible(false);

  // Initialisation des menus pour les attaques et potions
  this.attackMenu = this.add
    .text(500, 500, "", { fontSize: "24px", fill: "#fff" })
    .setVisible(false);
  this.potionMenu = this.add
    .text(500, 500, "", { fontSize: "24px", fill: "#fff" })
    .setVisible(false);

  // Afficher les différentes attaques
  let attackText = "Choisissez une attaque :\n";

  // Parcourir les attaques de chaque biome
  Object.keys(Global.attacks).forEach((biome) => {
    Global.attacks[biome].forEach((attack, index) => {
      attackText += `${index + 1}. ${attack.name} (Dégâts: ${attack.damage}, Coût: ${attack.mpCost} MP)\n`;
    });
  });

  this.attackMenu.setText(attackText);

  // Gérer le clic pour choisir une attaque ou une potion
  this.input.keyboard.on("keydown", (event) => {
    const keyPressed = parseInt(event.key);

    if (this.attackMenuVisible) {
      const currentBiome = "nature"; // Ici, tu peux déterminer dynamiquement le biome selon la situation
      const biomeAttacks = Global.attacks[currentBiome];
      const neutralAttacks = Global.attacks["neutre"];

      // Combiner les attaques de biomes et les attaques neutres
      const allAttacks = [...biomeAttacks, ...neutralAttacks];

      if (keyPressed >= 1 && keyPressed <= allAttacks.length) {
        const selectedAttack = allAttacks[keyPressed - 1];
        this.playerAttack(selectedAttack);
      }
    }

    if (this.potionMenuVisible) {
      let potionCount = 0;
      let potionType = null;

      // Parcourir l'inventaire des potions pour trouver la potion correspondante
      for (const [type, potions] of Object.entries(Global.inventory.potions)) {
        if (potions.length > 0) {
          potionCount++;
          if (potionCount === keyPressed) {
            potionType = type; // Trouver la potion correspondant à la touche pressée
            break;
          }
        }
      }

      // Si la potion existe dans l'inventaire
      if (potionType) {
        this.usePotion(potionType); // Appeler la fonction usePotion avec le type de potion
      } else {
        this.updatePlayerActionText("Potion invalide ou non disponible.");
      }
    }
  });

  this.startAnimation(); // Démarrer l'animation manuelle
  }







  preload() {
    this.loadEnemyData(Global.enemyId)
 
    // Charger les images d'animation idle et attaque du joueur
    

    // Charger les textures spécifiques à l'ennemi en utilisant un ID par défaut (par exemple, ID 1 pour les tests)
}




  // Fonction pour créer les boutons avec des effets de hover et de clic
createButton(button, scale = 1.1) {
  // Scale initial
  const initialScale = button.scale;

  // Effet de survol (hover)
  button.on("pointerover", () => {
    this.tweens.add({
      targets: button,
      scale: initialScale * scale,
      duration: 100, // Durée de l'animation de hover
      ease: "Power1",
    });
  });

  // Retour à la taille normale quand la souris sort du bouton
  button.on("pointerout", () => {
    this.tweens.add({
      targets: button,
      scale: initialScale,
      duration: 100, // Durée de l'animation pour rétablir la taille
      ease: "Power1",
    });
  });

  // Effet de clic (simuler un bouton enfoncé)
  button.on("pointerdown", () => {
    this.tweens.add({
      targets: button,
      scale: initialScale * 0.9, // Réduire légèrement la taille pour l'effet de clic
      duration: 50, // Durée rapide pour l'effet de clic
      ease: "Power1",
    });
  });

  // Retour à la taille normale après le clic
  button.on("pointerup", () => {
    this.tweens.add({
      targets: button,
      scale: initialScale,
      duration: 50, // Rétablir la taille rapidement
      ease: "Power1",
    });
  });
}

create() {
  if (this.isInitialized) {
    return; // Si la scène a déjà été initialisée, ne fais rien
  }
  this.isInitialized = true; 
}


  startenemyIdleAnimation() {
    this.enemy.anims.play(this.animeIdle)
    
  }
  

  


  flashRed(target, onComplete) {
    // Sauvegarder la teinte d'origine, sinon utiliser le blanc
    const originalTint =
      target.tintTopLeft !== undefined ? target.tintTopLeft : 0xffffff;

    this.isFlashing = true; // Désactiver temporairement les actions

    // Passer au rouge
    target.setTint(0xff0000);

    // Première étape : Rouge pendant 200ms, puis blanc pendant 200ms, répété deux fois
    this.time.delayedCall(200, () => {
      // Remettre au blanc après 200ms
      target.setTint(0xffffff);

      // Deuxième étape : Passer encore au rouge après 200ms
      this.time.delayedCall(200, () => {
        target.setTint(0xff0000);

        // Dernière étape : Retour à la couleur d'origine après encore 200ms
        this.time.delayedCall(200, () => {
          target.setTint(originalTint); // Restaurer la teinte d'origine
          this.isFlashing = false; // Réactiver les actions

          if (onComplete) {
            onComplete(); // Appeler la fonction de fin si elle est définie
          }
        });
      });
    });
  }

  inflictDamageToEnemy(damage) {
    this.enemyHP -= damage;
    this.updateHealthBar(this.enemyHealthBar, this.enemyHP, 200); // Mettre à jour la barre de vie
    // this.enemyHPText.setText(`HP: ${this.enemyHP}`); // Mettre à jour l'affichage des HP
    this.flashRed(this.enemy); // Faire clignoter l'ennemi en rouge
  
    if (this.enemyHP <= 0) {
      this.endCombat('win'); // Fin du combat si l'ennemi est mort
    }
  }
  
  playEnemyAttackAnimation() {
    clearInterval(this.idleInterval); // Arrêter l'animation d'idle
    
    this.enemy.anims.play(this.animAttack)
}




  playAttackAnimation() {
    this.player.anims.play('attaquedroite')
    
  }

  startAnimation() {
    this.player.anims.play('idle')
  }

  updateAnimationFrame() {
    this.currentFrame = (this.currentFrame + 1) % this.playerTextures.length;
    this.player.setTexture(`idle_${this.currentFrame + 1}`);
  }

  update() {
    this.player.update(this);
  }

  // Mettre à jour les barres de vie
  updateHealthBar(bar, currentHP, maxHP) {
    const healthPercentage = currentHP / maxHP;
    bar.width = 100 * healthPercentage;
    // Mettre à jour la couleur de la barre
    if (healthPercentage > 0.5) {
        bar.fillColor = 0x00ff00; // Vert
    } else if (healthPercentage > 0.2) {
        bar.fillColor = 0xffcc00; // Orange
    } else {
        bar.fillColor = 0xff0000; // Rouge
    }
}


  // Mise à jour de la chatbox du joueur
  updatePlayerActionText(message) {
    this.playerActionTextBox.setText(message);
  }

  // Mise à jour de la chatbox de l'ennemi
  updateEnemyActionText(message) {
    this.enemyActionTextBox.setText(message);
  }

  showAttackMenu() {
    // Masquer les autres boutons
    this.attackButton.setVisible(false);
    this.defendButton.setVisible(false);
    this.potionButton.setVisible(false);
    this.fleeButton.setVisible(false);
  
    // Supprimer le texte du menu d'attaque précédent, si nécessaire
    if (this.attackMenu) {
      this.attackMenu.setVisible(false);
    }
  
    // Définir la taille réduite des images et l'espacement vertical
    const slotSize = 50; // Taille réduite des images
    const padding = 30; // Espacement entre les images
    const startX = this.scale.width / 2; // Centrer les images horizontalement
    const startY = this.scale.height / 2 - (slotSize + padding) * Global.attackActif.length / 2; // Centrer verticalement
  
    // Afficher les images des attaques actives du joueur de manière verticale
    this.attackImages = []; // Stocker les images pour pouvoir les détruire plus tard
    Global.attackActif.forEach((attack, index) => {
      const y = startY + (slotSize + padding) * index;
      
      const attackImage = this.add.image(startX, y, attack.image).setInteractive();
      attackImage.setScale(0.07); // Taille réduite des images d'attaque
      attackImage.setScrollFactor(0).setDepth(501);
      this.attackImages.push(attackImage); // Ajouter à la liste des images pour gestion
  
      // Gérer l'interaction : quand l'image est cliquée, on sélectionne l'attaque
      attackImage.on('pointerdown', () => {
        this.playerAttack(attack); // Lancer l'attaque correspondante
      });
  
      // Gérer le survol pour agrandir l'image
      attackImage.on('pointerover', () => {
        attackImage.setScale(0.10).setDepth(502); // Agrandir légèrement au survol
      });
  
      attackImage.on('pointerout', () => {
        attackImage.setScale(0.07).setDepth(501); // Retour à la taille normale quand on quitte
      });
    });
  
    // Ajouter un bouton de retour en bas de l'écran
    this.returnButton = this.add.image(this.scale.width / 2, this.scale.height - 50, 'returnButton').setInteractive();
    this.returnButton.setScale(0.5); // Ajuster la taille si nécessaire
  
    // Lorsque le bouton retour est cliqué, on revient aux boutons d'attaque/défense/fuite
    this.returnButton.on('pointerdown', () => {
      this.hideAttackMenu(); // Masquer le menu d'attaque
      this.showMainButtons(); // Réafficher les boutons principaux
    });
  }




  // Affichage des messages contextuels dans la textbox
  updateActionText(damage) {
    let message = "";
    if (damage > 15) {
      message = "Coup critique !";
    } else if (damage >= 10 && damage <= 15) {
      message = "Une attaque solide.";
    } else {
      message = "L'attaque n'a eu que peu d'effet.";
    }
    this.actionTextBox.setText(message);
  }

  showPotionMenu() {
    // Masquer les autres boutons
    this.attackButton.setVisible(false);
    this.defendButton.setVisible(false);
    this.fleeButton.setVisible(false);
    this.potionButton.setVisible(false);
  
    // Afficher les potions en bas à droite
    const potionImages = ['vie', 'viePlus', 'vieFull', 'mana', 'manaPlus', 'force', 'defense', 'temps', 'espace'];  // Ajout de la potion "espace"
    const potionNames = ['Potion de Vie', 'Potion de Vie Plus', 'Potion de Vie Full', 'Potion de Mana', 'Potion de Mana Plus', 'Potion de Force', 'Potion de Défense', 'Potion de Temps', 'Potion d\'Espace']; // Nom de la potion "espace"

    const startX = this.scale.width - 1000; // Positionnement initial à droite
    const startY = this.scale.height - 100; // Position en bas de l'écran
    const spacing = 100; // Espacement de 100 pixels entre les potions
  
    this.potionIcons = []; // Pour stocker les icônes des potions
    this.potionText = []; // Pour stocker les textes des potions
  
    potionImages.forEach((potion, index) => {
      const potionImage = this.add.image(startX + (index * spacing), startY, potion).setInteractive();
      potionImage.setScale(0.2); // Réduire la taille des potions
      this.potionIcons.push(potionImage);
  
      // Création d'un texte pour afficher le nom de la potion et la quantité dans l'inventaire
      const potionText = this.add.text(startX + (index * spacing), startY - 50, '', {
        fontSize: '20px',
        fill: '#fff',
        fontStyle: 'bold',
        align: 'center',
      }).setOrigin(0.5).setVisible(false); // Masquer le texte initialement
      this.potionText.push(potionText);
  
      // Gérer le survol de la potion pour afficher le nom et la quantité
      potionImage.on('pointerover', () => {
        const potionType = potionImages[index];
        const quantity = Global.inventory.potions[potionType]?.length || 0;
        const potionName = potionNames[index];
        potionText.setText(`${potionName}\nQuantité: ${quantity}`);
        potionText.setVisible(true); // Afficher le texte lorsque l'utilisateur survole la potion
      });
  
      // Masquer le texte lorsqu'on ne survole plus la potion
      potionImage.on('pointerout', () => {
        potionText.setVisible(false); // Masquer le texte lorsque l'utilisateur ne survole plus la potion
      });
  
      // Ajoute une interaction au clic pour utiliser la potion
      potionImage.on('pointerdown', () => {
        this.usePotion(potion); // Utiliser la potion
        this.hidePotionMenu(); // Masquer les potions après utilisation
        this.showMainButtons(); // Réafficher les boutons principaux après utilisation de la potion
      });
    });
  
    // Ajouter un bouton de retour
    this.returnButton = this.add.image(this.scale.width - 50, this.scale.height - 100, 'returnButton').setInteractive();
    this.returnButton.setScale(0.5); // Ajuster la taille si nécessaire
  
    // Lorsque le bouton retour est cliqué, on revient aux boutons d'attaque/défense/fuite
    this.returnButton.on('pointerdown', () => {
      this.hidePotionMenu(); // Masquer les potions
      this.showMainButtons(); // Réafficher les boutons principaux
    });
  }
  
  hidePotionMenu() {
    // Masquer le menu des potions et supprimer les éléments liés
    if (this.potionIcons) {
      this.potionIcons.forEach((potionImage) => {
        potionImage.destroy(); // Détruire les images des potions
      });
      this.potionIcons = []; // Réinitialiser le tableau des images de potions
    }
  
    if (this.potionText) {
      this.potionText.forEach((text) => {
        text.destroy(); // Détruire les textes associés (nom et quantité)
      });
      this.potionText = []; // Réinitialiser le tableau des textes
    }
  
    // Masquer le bouton de retour s'il existe
    if (this.returnButton) {
      this.returnButton.destroy();
    }
  
    this.potionMenuVisible = false;
  }
  
  // Méthode pour réafficher les boutons d'attaque, défense, etc.
  showMainButtons() {
    this.attackButton.setVisible(true);
    this.defendButton.setVisible(true);
    this.fleeButton.setVisible(true);
    this.potionButton.setVisible(true);
  }
  
  
  hideAttackMenu() {
    // Masquer le menu d'attaque en supprimant les images d'attaque
    if (this.attackImages) {
      this.attackImages.forEach(image => image.destroy()); // Supprimer chaque image
      this.attackImages = []; // Réinitialiser le tableau
    }
  
    if (this.returnButton) {
      this.returnButton.destroy(); // Supprimer le bouton retour
    }
  
    this.attackMenuVisible = false;
  
    // Réafficher les boutons d'attaque/défense/potion/fuite
    this.showMainButtons();
  }
  
  


  handleAction(actionType) {
    if (this.isPlayerTurn) {
      switch (actionType) {
        case "attack":
          this.playerAttack();
          break;
        case "defend":
          this.playerDefend(Global.defenses[0]); // Passer les infos de défense
          break;
        case "potion":
          this.usePotion();
          break;
        case "flee":
          this.fleeCombat();
          break;
      }
      this.endPlayerTurn();
    }
  }


// Fonction pour gérer l'attaque du joueur
// Fonction pour gérer l'attaque du joueur
playerAttack(attack) {
  if (this.playerMP >= attack.mpCost) {
    this.playerMP -= attack.mpCost;
    this.playerMPText.setText(`MP: ${this.playerMP}`);

    let damage = this.applyBiomeBonus(attack); // Appliquer le bonus de biome si applicable

    // Ajouter le boost de force si activé
    if (this.forceBoost) {
      damage += this.forceBoost;
      this.updatePlayerActionText(`Votre attaque est boostée par ${this.forceBoost} points de force !`);
      this.forceBoost = 0; // Réinitialiser le boost après l'attaque
    }

    // Appeler l'animation d'attaque
    this.playAttackAnimation(); // Démarrer l'animation d'attaque

    this.inflictDamageToEnemy(damage); // Dégâts infligés à l'ennemi
    this.updatePlayerActionText(`${attack.name} inflige ${damage} dégâts à l'ennemi !`);

    // Masquer le menu d'attaque après l'attaque
    this.hideAttackMenu(); 

    setTimeout(() => {
      this.startAnimation()
    }, 1000); // 2000 millisecondes = 2 secondes
    
    if (this.enemyHP <= 0) {
      this.endCombat('win');
    } else {
      this.endPlayerTurn();
    }
  } else {
    this.updatePlayerActionText("Pas assez de mana !");
  }
}




// Fonction pour vérifier le biome supérieur
isBiomeSuperior(playerBiome, enemyBiome) {
    const biomeHierarchy = {
        "espace": "temps",
        "temps": "nature",
        "nature": "espace"
    };

    return biomeHierarchy[playerBiome] === enemyBiome;
}


playerDefend() {
  this.isDefending = true;
  this.defenseBoost = Phaser.Math.Between(5, 25);  // Réduction de dégâts aléatoire entre 5 et 25
  this.updatePlayerActionText(`Le joueur se défend et réduit les dégâts de ${this.defenseBoost} points.`);
  this.endPlayerTurn();
}



usePotion(potionType) {
  const potionInventory = Global.inventory.potions[potionType];

  // Vérifier s'il reste au moins une potion
  if (!potionInventory || potionInventory.length === 0) {
    this.updatePlayerActionText("Vous n'avez plus de cette potion !");
    return;
  }

  const potion = Global.potions[potionType];
  if (!potion) {
    this.updatePlayerActionText("Potion invalide !");
    return;
  }

  // Appliquer l'effet de la potion
  if (potionType === "vie" || potionType === "viePlus" || potionType === "vieFull") {
    const healAmount = potion.healAmount;
    this.playerHP = Math.min(this.playerHP + healAmount, 200); // Limiter les HP à 200
    this.updatePlayerActionText(`Vous avez récupéré ${healAmount} HP.`);
    this.updateHealthBar(this.playerHealthBar, this.playerHP, 200);

  } else if (potionType === "mana" || potionType === "manaPlus") {
    const restoreAmount = potion.restoreAmount;
    this.playerMP = Math.min(this.playerMP + restoreAmount, 100); // Limiter les MP à 100
    this.updatePlayerActionText(`Vous avez récupéré ${restoreAmount} MP.`);
    this.playerMPText.setText(`MP: ${this.playerMP}`);

  } else if (potionType === "force") {
    this.forceBoost = potion.boost; // Ajouter un boost de force temporaire
    this.updatePlayerActionText("Force augmentée pour le prochain tour !");

  } else if (potionType === "defense") {
    this.defenseBoost = potion.reduceDamage; // Ajouter un boost de défense temporaire
    this.updatePlayerActionText("Défense augmentée, vous subirez moins de dégâts pendant un tour !");

  } else if (potionType === "temps") {
    this.skipEnemyTurn = true; // Permet au joueur de jouer deux fois
    this.updatePlayerActionText("Vous jouez deux fois !");

  } else if (potionType === "espace") {
    const tempHP = this.enemyHP;
    this.enemyHP = this.enemyMP;
    this.enemyMP = tempHP;
    this.updatePlayerActionText("Les HP et MP de l'ennemi sont inversés !");
    
    // Vérifier si l'ennemi a 0 HP après l'inversion
    if (this.enemyHP <= 0) {
      this.updatePlayerActionText("L'ennemi a 0 HP après l'inversion, vous avez gagné !");
      this.endCombat("win");
    }
  }

  // Retirer la potion de l'inventaire après utilisation
  potionInventory.pop();

  // Mettre à jour et masquer le menu des potions après utilisation
  this.potionMenu.setVisible(false);
  this.potionMenuVisible = false;
}











// Fonction pour appliquer un boost temporaire
boostStat(type, boostAmount, duration) {
    if (type === "force") {
        this.attackBoost = boostAmount;
    } else if (type === "defense") {
        this.defenseBoost = boostAmount;
    }

    // Réinitialiser après la durée
    this.time.delayedCall(duration, () => {
        this.attackBoost = 0;
        this.defenseBoost = 0;
    });
}



  fleeCombat() {
    console.log("Le joueur tente de fuir !");
    // Logique pour fuir le combat
  }

  // Fin du tour du joueur
  endPlayerTurn() {
    this.playerMP = Math.min(this.playerMP + 10, 50); // Ajouter 10 MP à chaque tour
    this.playerMPText.setText(`MP: ${this.playerMP}`);

    // Passer au tour de l'ennemi
    this.enemyTurn();
}


  disableButtons() {
    this.attackButton.disableInteractive();
    this.defendButton.disableInteractive();
    this.potionButton.disableInteractive();
    this.fleeButton.disableInteractive();
  }

  enableButtons() {
    if (
      this.attackButton &&
      this.defendButton &&
      this.potionButton &&
      this.fleeButton
    ) {
      this.attackButton.setInteractive();
      this.defendButton.setInteractive();
      this.potionButton.setInteractive();
      this.fleeButton.setInteractive();
    }
  }

  updateEnemyMPText() {
    this.enemyMPText.setText(`MP: ${this.enemyMP}`);
  }

  enemyTurn() {
    if (this.skipEnemyTurn) {
      this.updateEnemyActionText("L'adversaire saute son tour !");
      this.skipEnemyTurn = false; // Réinitialiser l'effet après avoir sauté un tour
      this.startPlayerTurn(); // Repasser au tour du joueur immédiatement
      return;
    }
  
    this.time.delayedCall(1000, () => {
      let actions = [];
  
      // Chance d'utiliser une potion de vie si les HP sont faibles et si une potion de vie est disponible
      if (this.enemyHP <= 30 && Global.inventory.potions['vie'] && Global.inventory.potions['vie'].length > 0 && Math.random() < 0.2) {
        actions.push("usePotionHealth");
      }
  
      // Chance d'utiliser une potion de mana si les MP sont faibles et si une potion de mana est disponible
      if (this.enemyMP <= 10 && Global.inventory.potions['mana'] && Global.inventory.potions['mana'].length > 0 && Math.random() < 0.2) {
        actions.push("usePotionMana");
      }
  
      // Chance de se défendre
      if (Math.random() < 0.1) {
        actions.push("defend");
      }
  
      // Ajouter l'attaque comme action principale
      actions.push("attack");
  
      // Choisir une action au hasard parmi celles disponibles
      const randomAction = Phaser.Math.RND.pick(actions);
  
      if (randomAction === "attack") {
        this.enemyAttack();
      } else if (randomAction === "defend") {
        this.enemyDefend();
      } else if (randomAction === "usePotionHealth") {
        this.enemyUsePotion("health");
      } else if (randomAction === "usePotionMana") {
        this.enemyUsePotion("mana");
      }
  
      this.startPlayerTurn(); // Repasser au tour du joueur après l'action de l'ennemi
    });
  }
  
  

  // Utilisation de potion par l'ennemi
  enemyUsePotion(type) {
    if (type === "health") {
      const healAmount = Phaser.Math.Between(15, 25);
      this.enemyHP = Math.min(this.enemyHP + healAmount, 200); // Limiter les HP à 100
      this.updateHealthBar(this.enemyHealthBar, this.enemyHP, 200);
      this.updateEnemyActionText(
        `L'ennemi utilise une potion et récupère ${healAmount} HP.`
      );
    } else if (type === "mana") {
      const manaAmount = Phaser.Math.Between(15, 25);
      this.enemyMP = Math.min(this.enemyMP + manaAmount, 50); // Limiter les MP à 50
      this.updateEnemyMPText(); // Met à jour l'affichage des MP
      this.updateEnemyActionText(
        `L'ennemi utilise une potion et récupère ${manaAmount} MP.`
      );
    }
  }

  applyBiomeBonus(attack) {
    const enemyBiome = 'nature'; // Par exemple, ici l'ennemi est de type Nature
    const playerBiome = attack.biome; // Le biome de l'attaque actuelle

    const biomeBonus = {
        espace: 'temps',
        temps: 'nature',
        nature: 'espace',
    };

    if (biomeBonus[playerBiome] === enemyBiome) {
        return attack.damage * 1.2; // Appliquer un bonus de 20 % si le biome est supérieur
    }

    return attack.damage; // Pas de bonus, dégâts normaux
}


enemyAttack() {
  let damage = Phaser.Math.Between(10, 20); // Dégâts aléatoires

  // Lancer l'animation d'attaque de l'ennemi
  this.playEnemyAttackAnimation();

  // Appliquer le bonus de défense si présent
  if (this.defenseBoost) {
    damage = Math.max(0, damage - this.defenseBoost); // Réduire les dégâts subis
    this.updatePlayerActionText(`Vous avez bloqué ${this.defenseBoost} points de dégâts !`);
  }

  // Si l'ennemi utilise du mana pour l'attaque, vérifie que son mana ne tombe pas en dessous de 0
  this.enemyMP = Math.max(0, this.enemyMP - 5); // Empêche le mana de tomber en dessous de zéro
  this.updateEnemyMPText(); // Met à jour l'affichage des MP

  // Appeler le clignotement lorsque le joueur reçoit des dégâts
  this.flashRed(this.player);

  this.playerHP -= damage;
  this.updateHealthBar(this.playerHealthBar, this.playerHP, 200);

  // this.playerHPText.setText(`HP: ${this.playerHP}`);

  // Message d'attaque
  let message = (damage > 15) ? "L'ennemi a porté un coup critique !" : "L'ennemi a infligé des dégâts.";
  this.updateEnemyActionText(message);

  setTimeout(() => {
    this.startenemyIdleAnimation();
  }, 2000); 
  
  


  if (this.playerHP <= 0) {
    this.endCombat("lose");
  }
}






  enemyDefend() {
    console.log("L'ennemi se défend !");
    // L'ennemi réduit les dégâts subis pendant le tour du joueur
    this.enemyIsDefending = true;
  }

  // Reprise du tour du joueur
  startPlayerTurn() {
    if (this.combatEnded) {
      return; // Ne pas réactiver les boutons si le combat est terminé
    }

    this.isPlayerTurn = true;
    this.enableButtons(); // Réactiver les boutons d'action
    console.log("C'est de nouveau le tour du joueur !");
  }

  // Gérer la fin du combat
  endCombat(result) {
    this.isPlayerTurn = false;
    this.combatEnded = true; // Le combat est terminé

    this.disableButtons(); // Désactiver les boutons
    this.enemyIsDefending = false;

    if (result === "win") {
      this.endMessage.setText("Victoire !").setVisible(true);
      this.enemy.destroy();
    } else if (result === "lose") {
      this.endMessage.setText("Défaite...").setVisible(true);
      this.player.destroy();
    }

    this.attackButton.destroy();
    this.defendButton.destroy();
    this.potionButton.destroy();
    this.playerMPText.destroy();
    this.enemyMPText.destroy();
    this.playerActionTextBox.destroy();
    this.enemyActionTextBox.destroy();
    this.fleeButton.destroy();
  }

  fleeCombat() {
    console.log("Le joueur tente de fuir !");
    this.scene.stop("tpt"); // Stopper la scène tpt
    this.scene.resume("monde"); // Reprendre la scène monde
  }

  positionPlayerElements() {
    if (this.player && this.playerHealthBar && this.playerMPText) {
      // Position du joueur et de ses éléments liés (barres de vie, MP, etc.)
      this.player.setPosition(410, 670);
      this.playerHealthBar.setPosition(410, 550);
      this.playerMPText.setPosition(360, 500);
      this.playerActionTextBox.setPosition(250, 800);
    } else {
      console.error("Les éléments du joueur ne sont pas encore définis.");
    }
  }

  positionEnemyElements() {
    if (this.enemy && this.enemyHealthBar && this.enemyMPText) {
      // Position de l'ennemi et de ses éléments liés
      this.enemy.setPosition(1510, 570);
      this.enemyHealthBar.setPosition(1510, 370);
      this.enemyMPText.setPosition(1460, 330);
      this.enemyActionTextBox.setPosition(1220, 280);
    } else {
      console.error("Les éléments de l'ennemi ne sont pas encore définis.");
    }
  }

  gainManaPerTurn() {
    this.playerMP = Math.min(this.playerMP + 10, 100); // Ajoute 10 MP jusqu'à un maximum de 100
    this.playerMPText.setText(`MP: ${this.playerMP}`);
}

}
