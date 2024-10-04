import playerConfig from '/5/test3D/js/playerConfig.js';

export default class tpt extends Scene3D {
    constructor() {
        super({ key: 'tpt' });
        this.isPlayerTurn = true; // Initialement, c'est le tour du joueur
        this.combatEnded = false; // Initialement, le combat n'est pas terminé

        // Stats de combat de base
        this.playerHP = 100; // Points de vie du joueur
        this.playerMP = 50;  // Points de mana du joueur
        this.enemyHP = 100;  // Points de vie de l'ennemi
        this.enemyMP = 50;   // Points de mana de l'ennemi

        // Variables pour gérer l'état d'affichage des menus
        this.attackMenuVisible = false;
        this.potionMenuVisible = false;

        // Animation-related variables
        this.playerTextures = []; // Initialisation ici
        this.attackTextures = [];  // Pour l'animation d'attaque, initialisation ici
        this.currentFrame = 0;
    }

    preload() {

        this.loadTextures('idle', 'idle', 6, this.playerTextures); // Charger les images d'animation
        this.loadTextures('attack', 'attaquedroite', 8, this.attackTextures);  // Pour l'attaque

        // Charger les images du joueur, de l'ennemi et des boutons
        this.load.image('player', "/5/test3D/examples/anim_player/idle/_idle_1.png");
        this.load.image('enemy', "/5/test3D/examples/monstre1/walk_1.png");
        this.load.image('attackButton', "/5/test3D/examples/desert/caillou2.png");
        this.load.image('defendButton', "/5/test3D/examples/desert/caillou1.png");
        this.load.image('potionButton', "/5/test3D/examples/desert/caillou2.png");
        this.load.image('fleeButton', "/5/test3D/examples/desert/caillou2.png");
    }
    

    loadTextures(folder, name, frameCount, textureArray) {
        const framePaths = [];
        for (let i = 1; i <= frameCount; i++) {
            const framePath = `/5/test3D/examples/anim_player/${folder}/_${name}_${i}.png`;
            textureArray.push(framePath);
            this.load.image(`${name}_${i}`, framePath); // Charger chaque image individuellement
        }
        
    }

    create() {

        // Afficher le joueur avec la première image de l'animation
        this.player = this.add.image(100, 400, 'idle_1');
        this.player.setScale(0.2); // Ajuste la taille du personnage (0.5 est un exemple, ajuste selon tes besoins)

        this.enemy = this.add.image(600, 100, 'enemy');
        this.enemy.setScale(0.3); // Ajuste la taille initiale de l'ennemi

        // Démarrer l'animation de "respiration" pour l'ennemi
        this.startEnemyIdleAnimation();

        // Ajouter les barres de vie au-dessus des personnages
        this.playerHealthBar = this.add.rectangle(100, 360, 100, 10, 0x00ff00);
        this.enemyHealthBar = this.add.rectangle(600, 60, 100, 10, 0x00ff00);

        // Afficher les points de mana
        this.playerMPText = this.add.text(100, 390, `MP: ${this.playerMP}`, { fontSize: '16px', fill: '#fff' });
        this.enemyMPText = this.add.text(600, 90, `MP: ${this.enemyMP}`, { fontSize: '16px', fill: '#fff' });
        
        // Chatbox pour les actions du joueur
        this.playerActionTextBox = this.add.text(50, 300, '', { fontSize: '16px', fill: '#00ff00' });

        // Chatbox pour les actions de l'ennemi
        this.enemyActionTextBox = this.add.text(450, 150, '', { fontSize: '16px', fill: '#ff0000' })

        // Ajouter les boutons d'action
        this.attackButton = this.add.image(200, 500, 'attackButton').setInteractive();
        this.defendButton = this.add.image(350, 500, 'defendButton').setInteractive();
        this.potionButton = this.add.image(500, 500, 'potionButton').setInteractive();
        this.fleeButton = this.add.image(650, 500, 'fleeButton').setInteractive();

        // Actions au clic des boutons
        this.attackButton.on('pointerdown', () => this.showAttackMenu());
        this.defendButton.on('pointerdown', () => this.playerDefend(playerConfig.defenses[0]));
        this.potionButton.on('pointerdown', () => this.showPotionMenu());
        this.fleeButton.on('pointerdown', () => this.handleAction('flee'));

        // Zone pour le message de fin de combat
        this.endMessage = this.add.text(400, 300, '', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5).setVisible(false);

        // Initialisation des menus pour les attaques et potions
        this.attackMenu = this.add.text(400, 500, '', { fontSize: '16px', fill: '#fff' }).setVisible(false);
        this.potionMenu = this.add.text(400, 500, '', { fontSize: '16px', fill: '#fff' }).setVisible(false);

        // Afficher les différentes attaques
        let attackText = 'Choisissez une attaque :\n';
        playerConfig.attacks.forEach((attack, index) => {
            attackText += `${index + 1}. ${attack.name} (Dégâts: ${attack.damage}, Coût: ${attack.mpCost} MP)\n`;
        });

        this.attackMenu.setText(attackText);

        // Gérer le clic pour choisir une attaque
        this.input.keyboard.on('keydown', (event) => {
            if (this.attackMenuVisible) {
                const keyPressed = parseInt(event.key);
                if (keyPressed >= 1 && keyPressed <= playerConfig.attacks.length) {
                    this.playerAttack(playerConfig.attacks[keyPressed - 1]);
                }
            }
            if (this.potionMenuVisible) {
                const keyPressed = parseInt(event.key);
                if (keyPressed === 1) {
                    this.usePotion('health');
                } else if (keyPressed === 2) {
                    this.usePotion('mana');
                }
            }
        });

        this.startAnimation(); // Démarrer l'animation manuelle
    }

    enemyAttackAnimation() {
        const initialX = this.enemy.x;
        
        // Animation d'attaque : avancer puis reculer
        this.tweens.timeline({
            targets: this.enemy,
            ease: 'Power1',
            duration: 200,
            tweens: [
                { x: initialX - 20, duration: 150 },  // Avancer légèrement vers la gauche
                { x: initialX, duration: 150 }        // Reculer à sa position initiale
            ],
            onComplete: () => {
                // Appeler la fonction pour infliger des dégâts au joueur après l'animation
                this.inflictDamageToPlayer();
            }
        });
    }
    

    startEnemyIdleAnimation() {
        this.tweens.add({
            targets: this.enemy,
            scaleX: 0.32,  // Augmenter légèrement le scale sur l'axe X
            scaleY: 0.32,  // Augmenter légèrement le scale sur l'axe Y
            duration: 1000, // Durée de l'animation (1 seconde pour l'expansion)
            yoyo: true, // Revenir à la taille d'origine
            repeat: -1, // Répéter l'animation indéfiniment
            ease: 'Sine.easeInOut' // Utiliser un easing doux pour l'effet de "respiration"
        });
    }

    flashRed(target, onComplete) {
        const initialTint = target.tintTopLeft;
        
        this.isFlashing = true;  // Désactiver temporairement les actions
    
        this.tweens.add({
            targets: target,
            tint: 0xff0000,  // Change la couleur à rouge
            duration: 300,   // Durée ajustée pour ralentir l'effet
            yoyo: true,
            repeat: 2,       // Répéter seulement 2 fois
            onComplete: () => {
                target.clearTint();  // Retirer la teinte rouge
                this.isFlashing = false;  // Réactiver les actions
                if (onComplete) {
                    onComplete();  // Si une fonction est passée, l'appeler après l'animation
                }
            }
        });
    }
    

    inflictDamageToEnemy(damage) {
        this.enemyHP -= damage;
        this.updateHealthBar(this.enemyHealthBar, this.enemyHP, 100);
        this.flashRed(this.enemy);  // Flash rouge pour l'ennemi
    
        if (this.enemyHP <= 0) {
            this.endCombat('win');
        }
    }
    
    

    playAttackAnimation() {
        let currentFrame = 0;
        const attackFrames = this.attackTextures; // Utiliser les frames d'attaque que tu as chargées
    
        const attackInterval = setInterval(() => {
            if (currentFrame < attackFrames.length) {
                this.player.setTexture(`attaquedroite_${currentFrame + 1}`); // Met à jour la texture du sprite
                currentFrame++;
            } else {
                clearInterval(attackInterval); // Arrête l'animation après avoir joué toutes les frames
                this.player.setTexture('idle_1'); // Reviens à la texture idle après l'attaque
            }
        }, 100); // Délai entre chaque frame (ajuste à ta convenance)
    }
    

    startAnimation() {
        this.time.addEvent({
            delay: 150,  // Délai entre les frames en millisecondes
            callback: this.updateAnimationFrame,
            callbackScope: this,
            loop: true
        });
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
        // Afficher le menu des attaques
        let attackText = 'Choisissez une attaque :\n';
        playerConfig.attacks.forEach((attack, index) => {
            attackText += `${index + 1}. ${attack.name} (Dégâts: ${attack.damage}, Coût: ${attack.mpCost} MP)\n`;
        });
        this.attackMenu.setText(attackText).setVisible(true);
        this.attackMenuVisible = true;
        this.potionMenuVisible = false;
        this.potionMenu.setVisible(false); // Cacher le menu de potion si ouvert
    }

    // Affichage des messages contextuels dans la textbox
    updateActionText(damage) {
        let message = '';
        if (damage > 15) {
            message = 'Coup critique !';
        } else if (damage >= 10 && damage <= 15) {
            message = 'Une attaque solide.';
        } else {
            message = 'L\'attaque n\'a eu que peu d\'effet.';
        }
        this.actionTextBox.setText(message);
    }

    showPotionMenu() {
        // Afficher le menu des potions
        const potionText = 'Choisissez une potion :\n1. Potion de vie\n2. Potion de mana';
        this.potionMenu.setText(potionText).setVisible(true);
        this.potionMenuVisible = true;
        this.attackMenuVisible = false;
        this.attackMenu.setVisible(false); // Cacher le menu d'attaque si ouvert
    }

    handleAction(actionType) {
        if (this.isPlayerTurn) {
            switch (actionType) {
                case 'attack':
                    this.playerAttack();
                    break;
                case 'defend':
                    this.playerDefend(playerConfig.defenses[0]); // Passer les infos de défense
                    break;
                case 'potion':
                    this.usePotion();
                    break;
                case 'flee':
                    this.fleeCombat();
                    break;
            }
            this.endPlayerTurn();
        }
    }

    // Attaque du joueur
    // Attaque du joueur
playerAttack(attack) {
    if (this.playerMP >= attack.mpCost) {

        this.playerMP -= attack.mpCost;
        this.playerMPText.setText(`MP: ${this.playerMP}`);

        const damage = attack.damage;
        this.enemyHP -= damage; 

        // Mettre à jour la barre de vie de l'ennemi
        this.updateHealthBar(this.enemyHealthBar, this.enemyHP, 100);

        // Jouer l'animation d'attaque
        this.playAttackAnimation(); 

        // Appliquer le flash rouge à l'ennemi
        this.flashRed(this.enemy);

        // Mettre à jour la chatbox du joueur
        let message = '';
        if (damage > 15) {
            message = `Coup critique avec ${attack.name} !`;
        } else if (damage >= 10 && damage <= 15) {
            message = `${attack.name} a infligé des dégâts solides.`;
        } else {
            message = `${attack.name} n'a pas eu beaucoup d'effet.`;
        }
        this.updatePlayerActionText(message);

        this.attackMenu.setVisible(false);
        this.attackMenuVisible = false;

        if (this.enemyHP <= 0) {
            this.endCombat('win');
        } else {
            this.endPlayerTurn();
        }
    } else {
        this.updatePlayerActionText("Pas assez de mana !");
    }
}


    playerDefend(defense) {
        if (this.playerMP >= defense.mpCost) {
            this.playerMP -= defense.mpCost;
            this.playerMPText.setText(`MP: ${this.playerMP}`);
            this.isDefending = true;
            this.updatePlayerActionText(`Le joueur utilise ${defense.name} pour se défendre.`);
            this.endPlayerTurn();
        } else {
            this.updatePlayerActionText("Pas assez de mana pour se défendre !");
        }
    }

    

    usePotion(type) {
        if (type === 'health') {
            this.playerHP = Math.min(this.playerHP + playerConfig.potions.healAmount, 100);
            this.updateHealthBar(this.playerHealthBar, this.playerHP, 100);
            this.updatePlayerActionText(`Le joueur récupère ${playerConfig.potions.healAmount} HP.`);
        } else if (type === 'mana') {
            this.playerMP = Math.min(this.playerMP + playerConfig.potions.manaAmount, 50);
            this.playerMPText.setText(`MP: ${this.playerMP}`);
            this.updatePlayerActionText(`Le joueur récupère ${playerConfig.potions.manaAmount} MP.`);
        }

        this.potionMenu.setVisible(false);
        this.potionMenuVisible = false;
        this.endPlayerTurn();
    }
    

    fleeCombat() {
        console.log("Le joueur tente de fuir !");
        // Logique pour fuir le combat
    }

    // Fin du tour du joueur
    endPlayerTurn() {
        this.isPlayerTurn = false;
        this.disableButtons(); // Désactiver les boutons d'action
        
        // Ajoute un petit délai avant de lancer le tour de l'ennemi pour que tout se synchronise
        this.time.delayedCall(500, () => {
            this.enemyTurn(); // Appeler le tour de l'ennemi après une petite pause
        });
    }
    

    disableButtons() {
        this.attackButton.disableInteractive();
        this.defendButton.disableInteractive();
        this.potionButton.disableInteractive();
        this.fleeButton.disableInteractive();
    }

    enableButtons() {
        if (this.attackButton && this.defendButton && this.potionButton && this.fleeButton) {
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
        this.time.delayedCall(1000, () => {
            let actions = [];
    
            // Chance d'utiliser une potion de vie si les HP sont faibles
            if (this.enemyHP <= 30 && Math.random() < 0.004) {
                actions.push('usePotionHealth');
            }
    
            // Chance d'utiliser une potion de mana si les MP sont faibles
            if (this.enemyMP <= 10 && Math.random() < 0.004) {
                actions.push('usePotionMana');
            }
    
            // Chance de se défendre
            if (Math.random() < 0.003) {
                actions.push('defend');
            }
    
            // Ajouter l'attaque comme action principale
            actions.push('attack');
    
            // Choisir une action au hasard parmi celles disponibles
            const randomAction = Phaser.Math.RND.pick(actions);
    
            if (randomAction === 'attack') {
                this.enemyAttack();
            } else if (randomAction === 'defend') {
                this.enemyDefend();
            } else if (randomAction === 'usePotionHealth') {
                this.enemyUsePotion('health');
            } else if (randomAction === 'usePotionMana') {
                this.enemyUsePotion('mana');
            }
    
            this.startPlayerTurn(); // Repasser au tour du joueur après l'action de l'ennemi
        });
    }
    
    

    // Utilisation de potion par l'ennemi
    enemyUsePotion(type) {
        if (type === 'health') {
            const healAmount = Phaser.Math.Between(15, 25);
            this.enemyHP = Math.min(this.enemyHP + healAmount, 100); // Limiter les HP à 100
            this.updateHealthBar(this.enemyHealthBar, this.enemyHP, 100);
            this.updateEnemyActionText(`L'ennemi utilise une potion et récupère ${healAmount} HP.`);
        } else if (type === 'mana') {
            const manaAmount = Phaser.Math.Between(15, 25);
            this.enemyMP = Math.min(this.enemyMP + manaAmount, 50); // Limiter les MP à 50
            this.updateEnemyMPText(); // Met à jour l'affichage des MP
            this.updateEnemyActionText(`L'ennemi utilise une potion et récupère ${manaAmount} MP.`);
        }
    }
    
    

    enemyAttack() {
        const damage = Phaser.Math.Between(10, 20); // Dégâts aléatoires
        this.playerHP -= damage;
        
        // Si une attaque consomme des MP, les déduire ici (exemple)
        this.enemyMP -= 5; // Ajuster la consommation de mana si nécessaire
        this.updateEnemyMPText(); // Mettre à jour l'affichage des MP
    
        // Appeler le clignotement lorsque le joueur reçoit des dégâts
        this.flashRed(this.player);
    
        // Mettre à jour la barre de vie du joueur
        this.updateHealthBar(this.playerHealthBar, this.playerHP, 100);
        
        // Mise à jour du message dans la chatbox de l'ennemi
        let message = '';
        if (damage > 15) {
            message = "L'ennemi a porté un coup critique !";
        } else if (damage >= 10 && damage <= 15) {
            message = "L'ennemi a infligé des dégâts solides.";
        } else {
            message = "L'attaque de l'ennemi n'a pas eu beaucoup d'effet.";
        }
        this.updateEnemyActionText(message);
    
        if (this.playerHP <= 0) {
            this.endCombat('lose');
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
    
        if (result === 'win') {
            this.endMessage.setText('Victoire !').setVisible(true);
            this.enemy.destroy();
        } else if (result === 'lose') {
            this.endMessage.setText('Défaite...').setVisible(true);
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
    
    
}

// // Ajouter la scène à la configuration Phaser
// const config = {
//     type: Phaser.AUTO,
//     width: 800,
//     height: 600,
//     scene: [tpt], // Ta scène de combat
//     parent: 'gameContainer'
// };

// const game = new Phaser.Game(config);
