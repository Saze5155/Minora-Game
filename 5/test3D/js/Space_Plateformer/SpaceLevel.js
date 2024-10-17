import PlayerSpace from "/5/test3D/js/player_space.js"; 
import EnemyPlat from "/5/test3D/js/enemy_plat.js"; // Importation de la classe EnemyPlat
import Global from "/5/test3D/js/inventaire.js";

export default class SpaceLevel extends Phaser.Scene {
  constructor() {
    super({ key: "SpaceLevel" });
    this.gravityInverted = false; // Suivre l'état de la gravité
    this.lastDirection = 'right'; // Initialiser par défaut
  }

  preload() {
    // Le preload se trouve dans loading.js donc on n'a rien à ajouter ici
    this.load.image('bouleTexture', '/5/test3D/examples/monstre1/walk_1.png');
  }

  create() {
    // Charger la carte et les tilesets
    const carteDuNiveau = this.add.tilemap("carte");
    const tileset = carteDuNiveau.addTilesetImage("TuilesJeu", "Phaser_tuilesdejeu");

    const zoomFactor = 0.5; // Par exemple, 0.5 pour réduire l'échelle à 50%

    // Appliquer le zoom initial
    this.cameras.main.setZoom(zoomFactor);
    
    // Définir les limites du monde et de la caméra
    this.physics.world.setBounds(0, 0, 15360, 15360);
    this.cameras.main.setBounds(0, 0, 15360, 15360);
    
    // Ajouter le background fixe (derrière le calque des plateformes)
    this.background = this.add.image(0, 0, 'space_bg').setOrigin(0.5, 0.5);
    this.background.setScrollFactor(0); // Fixe le background à la caméra
    
    // Fonction pour ajuster la taille et la position du background
    const resizeBackground = () => {
        this.background.setDisplaySize(
            this.cameras.main.width / this.cameras.main.zoom,
            this.cameras.main.height / this.cameras.main.zoom
        );
        // Centrer le background sur la caméra
        this.background.setPosition(
            this.cameras.main.worldView.centerX,
            this.cameras.main.worldView.centerY
        );
    };
    
    // Appeler cette fonction une fois pour initialiser la taille correcte
    resizeBackground();
    
    // Ajuster la taille du background à chaque fois que la caméra change de zoom ou que la fenêtre est redimensionnée
    this.cameras.main.on('camerazoom', resizeBackground);
    this.cameras.main.on('center', resizeBackground); // Réajuster lors du déplacement de la caméra
    this.scale.on('resize', resizeBackground); // Ajuste le background si la fenêtre est redimensionnée.
    
    

this.physics.world.setFPS(120);
    this.physics.world.TILE_BIAS = 40;

    // Créer les calques de la carte
    this.calque_plateformes = carteDuNiveau.createLayer("calque_plateformes", tileset);
    
    // Configurer la collision pour les tuiles solides
    this.calque_plateformes.setCollisionByProperty({ estSolide: true });

    // Créer le joueur avec le fichier `PlayerSpace`
    this.player = new PlayerSpace(this, 100, 450, "idle_1");
    this.player.sprite.setScale(0.3);
    // Gérer les collisions entre le joueur et les plateformes
    this.physics.add.collider(this.player.sprite, this.calque_plateformes);

    
    this.cameras.main.startFollow(this.player.sprite);


// Créer le groupe d'ennemis
this.enemyGroups = this.physics.add.group();

// Charger les ennemis depuis l'Object Layer 'ennemies' défini dans Tiled
const enemiesLayer = carteDuNiveau.getObjectLayer('ennemies');
enemiesLayer.objects.forEach(enemyObj => {
    // Créer un ennemi à la position de chaque objet de l'Object Layer
    const enemy = new EnemyPlat(this, enemyObj.x, enemyObj.y, "alien_1");
    enemy.sprite.setScale(0.4);
    this.enemyGroups.add(enemy.sprite);

    // Stocker une référence à l'instance de l'ennemi dans son sprite
    enemy.sprite.setData('ref', enemy);

    // Définir une vitesse initiale pour chaque ennemi
    enemy.sprite.setVelocityX(Phaser.Math.Between(-150, 150)); // Vitesse aléatoire pour chaque ennemi
    enemy.sprite.play("enemy_space", true);
});

// Gérer les collisions entre les ennemis et les plateformes
this.physics.add.collider(this.enemyGroups, this.calque_plateformes);

// Gérer les collisions entre les ennemis et le joueur
this.physics.add.collider(this.player.sprite, this.enemyGroups, this.playerHitEnemy, null, this);



    // Définir les limites du monde
    const mapWidth = carteDuNiveau.widthInPixels;
    const mapHeight = carteDuNiveau.heightInPixels;
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    // Configurer la caméra pour suivre le joueur
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.startFollow(this.player.sprite);

    // Configurer la gravité initiale
    this.physics.world.gravity.y = 500;

    // Configurer la touche pour inverser la gravité
    this.invertGravityKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Charger la carte et les socles de l'object layer
    const objectsLayer = carteDuNiveau.getObjectLayer('socles');
    objectsLayer.objects.forEach(socle => {
        new LaserPlatform(this, socle.x, socle.y);
    });

    // Créer les petites boules à partir du object layer
    this.bouleGroup = this.physics.add.group({
        bounceX: 1, 
        bounceY: 1, 
        collideWorldBounds: true
    });

    const bouleObjects = carteDuNiveau.getObjectLayer("boules").objects;
    bouleObjects.forEach(bouleObj => {
        const randomBoule = Phaser.Math.RND.pick(['block', 'block2', 'block3', 'block4']);
        const boule = this.bouleGroup.create(bouleObj.x, bouleObj.y, randomBoule);
        boule.setCircle(boule.width / 2); // Ajuste la forme pour qu'elle soit circulaire
        boule.setScale(1.2); // Ajuste la taille de la boule (0.5 réduit à 50% de la taille originale)
        boule.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100)); // Vitesse initiale aléatoire
        boule.body.allowGravity = false; // Simule la gravité zéro
    });
     // Gérer les collisions entre les boules et les plateformes
     this.physics.add.collider(this.bouleGroup, this.calque_plateformes);
     this.physics.add.collider(this.player.sprite, this.bouleGroup, this.playerHitBoule, null, this);
     this.physics.add.collider(this.bouleGroup, this.bouleGroup);

    // Créer une touche pour attaquer
    this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O); // Touche O pour attaquer

    this.cursors = this.input.keyboard.addKeys({
        left: Phaser.Input.Keyboard.KeyCodes.Q,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        interact: Phaser.Input.Keyboard.KeyCodes.E
    }); 


    // piece

   // Charger les pièces à partir de l'Object Layer 'pieces' défini dans Tiled
const piecesLayer = carteDuNiveau.getObjectLayer('pieces');
this.piecesGroup = this.physics.add.group();

piecesLayer.objects.forEach(pieceObj => {
    // Créer une pièce à la position de chaque objet de l'Object Layer
    const piece = this.piecesGroup.create(pieceObj.x, pieceObj.y, 'piece-01');
    piece.play('piece'); // Jouer l'animation de la pièce (elle doit correspondre au nom de ton animation)
    piece.setScale(0.5); // Ajuster la taille si nécessaire
    piece.body.allowGravity = false; // Les pièces ne subissent pas la gravité
});

// Gérer la collision entre le joueur et les pièces
this.physics.add.overlap(this.player.sprite, this.piecesGroup, this.collectPiece, null, this);

// 

 // Charger les coffres depuis le calque 'chests'
const chestsLayer = carteDuNiveau.getObjectLayer('chests');
if (chestsLayer) {
    chestsLayer.objects.forEach((chestObj) => {
        const chest = this.physics.add.image(chestObj.x, chestObj.y, 'chest_close').setScale(0.5);
        chest.setData('isOpen', false);
        chest.body.allowGravity = false; // Désactiver la gravité pour que le coffre reste en place
        chest.setImmovable(true); // Le coffre ne bouge pas quand il est touché par le joueur

        // Ajouter une interaction pour ouvrir le coffre
        this.physics.add.overlap(this.player.sprite, chest, () => {
            if (this.cursors.interact.isDown && !chest.getData('isOpen')) {
                console.log("Coffre ouvert !");
                chest.setTexture('chest_open');
                chest.setData('isOpen', true);
            }
        });
    });
}

// Charger les portails depuis le calque 'portals'
const portalsLayer = carteDuNiveau.getObjectLayer('portals');
if (portalsLayer) {
    portalsLayer.objects.forEach((portalObj) => {
        const portal = this.physics.add.image(portalObj.x, portalObj.y, 'portal').setScale(0.9);
        portal.body.allowGravity = false; // Désactiver la gravité pour que le portail reste en place
        portal.setImmovable(true); // Le pthis.scene.stop('SpaceLevel')

        // Ajouter une interaction pour changer de niveau
        this.physics.add.overlap(this.player.sprite, portal, () => {
            if (this.cursors.interact.isDown) {
                console.log("Entrée dans le portail !");
                this.scene.stop('SpaceLevel')

                this.scene.start('RocketLevel');
               

            }
        });
    });
}

// 


    
  }

        update() {
                
        // Mettre à jour le joueur et lui passer l'état de la gravité
        this.player.update(this.gravityInverted);
    
        // Gérer l'inversion de gravité pour le joueur et l'ennemi
        if (Phaser.Input.Keyboard.JustDown(this.invertGravityKey)   ) {
            this.gravityInverted = !this.gravityInverted; // Inverser l'état de la gravité
        
            if (this.gravityInverted) {
                this.physics.world.gravity.y = -1500; // Augmenter la valeur pour rendre la gravité inversée plus puissante
                this.player.sprite.setFlipY(true);
                this.enemyGroups.children.each((enemySprite) => {
                    const enemy = enemySprite.getData('ref');
                    if (enemy && enemy.sprite) {
                        enemy.sprite.setFlipY(true);
                    }
                });
            } else {
                this.physics.world.gravity.y = 1500; // Ajuster également la gravité normale si besoin
                this.player.sprite.setFlipY(false);
                this.enemyGroups.children.each((enemySprite) => {
                    const enemy = enemySprite.getData('ref');
                    if (enemy && enemy.sprite) {
                        enemy.sprite.setFlipY(false);
                    }
                });
            }
        }
        
        // Gérer le comportement des ennemis
        this.enemyGroups.children.each((enemySprite) => {
            const enemy = enemySprite.getData('ref');
            if (enemy && enemy.sprite) {
                enemy.sprite.setFlipY(this.gravityInverted); // Tourner l'ennemi
            }
    
            if (enemy && enemy.sprite && enemy.sprite.active) {
                const distanceToPlayer = Phaser.Math.Distance.Between(
                    enemy.sprite.x, enemy.sprite.y,
                    this.player.sprite.x, this.player.sprite.y
                );
    
                if (distanceToPlayer < 500) {
                    if (this.player.sprite.x < enemy.sprite.x) {
                        enemy.sprite.setVelocityX(-200);
                        enemy.sprite.flipX = true;
                    } else {
                        enemy.sprite.setVelocityX(200);
                        enemy.sprite.flipX = false;
                    }
                } else {
                    if (!enemy.isMovingRandomly) {
                        this.moveEnemyRandomly(enemy);
                    }
                }
            }
        });
    
        // Suivre la dernière direction du joueur
        if (this.cursors.left.isDown) {
            this.lastDirection = 'left';
        } else if (this.cursors.right.isDown) {
            this.lastDirection = 'right';
        }
    
        // Gérer l'attaque du joueur
        if (this.input.keyboard.checkDown(this.attackKey, 200)) {
            this.playerAttack();
        }
    }
    

    moveEnemyRandomly(enemy) {
        enemy.isMovingRandomly = true;
        const randomDirection = Phaser.Math.Between(-1, 1); // -1 pour gauche, 1 pour droite, 0 pour rester sur place
        const randomSpeed = Phaser.Math.Between(30, 70); // Vitesse aléatoire

        enemy.sprite.setVelocityX(randomDirection * randomSpeed);
        enemy.sprite.flipX = randomDirection === -1;

        // L'ennemi change de direction après un temps aléatoire
        this.time.delayedCall(2000, () => {
            enemy.isMovingRandomly = false;
        });
    }

    handleInteraction(player, interactable) {
        // Vérifier si la touche E est pressée
        if (Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
            const type = interactable.getData('type');
    
            if (type === 'coffre' && !interactable.getData('opened')) {
                // Changer l'image du coffre lorsqu'il est ouvert
                interactable.setTexture('chest_open'); // Assurez-vous de précharger l'image 'coffre_open' dans preload()
                interactable.setData('opened', true);
                console.log("Le coffre a été ouvert !");
            } else if (type === 'portail') {
                // Changer de scène vers RocketLevel
                this.scene.start('RocketLevel');
            }
        }
    }
    



    playerHitEnemy(player, enemy) {
        // Si l'ennemi touche le joueur, il perd de la vie
        console.log("Le joueur a été touché par l'ennemi !");
        this.player.decreaseHealth();  // Si tu as une méthode decreaseHealth
    }


    playerAttack() {
        const attackRange = 450; // Rayon de l'attaque
    
        // Empêcher les actions concurrentes
        this.isAttacking = true;
    
        // Stopper la vélocité du joueur pour éviter le slide
        this.player.sprite.setVelocityX(0);
    
        // Jouer l'animation d'attaque en fonction de la direction
        if (this.lastDirection === 'right') {
            this.player.sprite.play('attaquedroite', true);
        } else if (this.lastDirection === 'left') {
            this.player.sprite.play('attaquegauche', true);
        }
    
        // Calculer la position de l'attaque en fonction de la direction
        let attackX = this.player.sprite.x;
        if (this.lastDirection === 'right') {
            attackX += attackRange; // Attaque à droite
        } else if (this.lastDirection === 'left') {
            attackX -= attackRange; // Attaque à gauche
        }
    
        // Vérifier si un ennemi est dans la portée de l'attaque
        this.enemyGroups.children.each((enemySprite) => {
            const enemy = enemySprite.getData('ref');  // Récupère l'instance EnemyPlat
    
            if (Math.abs(enemySprite.x - this.player.sprite.x) <= attackRange) {
                console.log("Attaque réussie !");
                enemy.takeDamage();
            } else {
                console.log("Attaque ratée, hors de portée.");
            }
        });
    
        // Écouter la fin de l'animation pour réactiver les actions normales
        this.player.sprite.once('animationcomplete', () => {
            this.isAttacking = false; // L'attaque est terminée
        });
    }
    
    collectPiece(player, piece) {
        // Désactiver la pièce visuellement et la retirer de la scène
        piece.disableBody(true, true);
    
        // Ajouter des points au score ou jouer un son, etc.
        console.log("Pièce collectée !");
    }
    
    





  playerHitBoule(player, boule) {
    // Logique lorsque le joueur touche une boule
    console.log("Le joueur a été touché par une boule !");
    this.player.decreaseHealth();  // Si tu as une méthode decreaseHealth dans PlayerSpace
  }
}

class LaserPlatform {
    constructor(scene, x, y) {
      this.scene = scene;
      this.sprite = scene.physics.add.sprite(x, y, "socle"); // Le socle
      
      // Augmenter la taille et l'épaisseur du laser
      const laserWidth = 10; // Largeur du laser (plus grand pour l'épaissir)
      const laserHeight = 1000; // Hauteur du laser (plus grand pour l'allonger)
  
      this.laser = scene.add.rectangle(x, y - laserHeight / 2, laserWidth, laserHeight, 0xff0000); // Le laser
      this.laser.setAlpha(0); // Invisible au début
  
      scene.physics.add.existing(this.laser, true); 
      this.sprite.body.allowGravity = false;
      this.laserActive = false;
  
      this.scheduleLaser();
    }
  

  scheduleLaser() {
    this.scene.time.addEvent({
      delay: Phaser.Math.Between(2000, 5000), // Intervalle aléatoire
      callback: this.prepareLaser,
      callbackScope: this,
    });
  }

  prepareLaser() {
    this.laser.setAlpha(0.3);
    this.laserActive = false;

    this.scene.time.delayedCall(1000, this.activateLaser, [], this);
  }

  activateLaser() {
    this.laser.setAlpha(1);
    this.laserActive = true;

    this.scene.physics.add.overlap(this.laser, this.scene.player.sprite, () => {
      if (this.laserActive) {
        this.scene.player.decreaseHealth();
      }
    });

    this.scene.time.delayedCall(500, this.deactivateLaser, [], this);
  }

  deactivateLaser() {
    this.laser.setAlpha(0); 
    this.laserActive = false;
    this.scheduleLaser();
  }
}
