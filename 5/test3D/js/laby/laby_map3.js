import EnemyLaby from "/5/test3D/js/enemy_laby.js";
import PlayerLaby from "/5/test3D/js/player_laby.js";

export default class Laby_map3 extends Phaser.Scene {
  constructor() {
    super({ key: "Laby_map3" });
    this.enemyGroups = null;
  }

  preload() {}

  create() {
    this.soundSpike = this.sound.add("spike", {
      volume: 0.3,
    });

    this.soundCoffre = this.sound.add("ouverture", {
      volume: 0.5,
    });

    this.soundArrow = this.sound.add("arrow", {
      volume: 0.4,
    });

    this.soundBack = this.sound.add("sound_laby", {
      volume: 0.2,
    });

    this.soundBack.play();

    this.physics.world.gravity.y = 0;
    this.physics.world.setFPS(120);
    this.physics.world.TILE_BIAS = 40;

    this.map = this.make.tilemap({ key: "laby_map3" });
    this.tileset = this.map.addTilesetImage("tileset_laby", "tileset_laby");
    this.wall_layer = this.map.createLayer("wall_layer", this.tileset);
    this.ground_layer = this.map.createLayer("ground_layer", this.tileset);
    this.spades_layer = this.map.createLayer("spades_layer", this.tileset);
    this.chest_layer = this.map.createLayer("chests_layer", this.tileset);
    this.object_layer = this.map.getObjectLayer("object_layer");

    this.wall_layer.setDepth(10);
    this.chest_layer.setDepth(15);
    this.spades_layer.setDepth(0);

    this.wall_layer.setCollisionByProperty({ estSolide: true });
    this.chest_layer.setCollisionByProperty({ coffre: true });
    this.chest_layer.setCollisionByProperty({ coffre_piege: true });
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    const startPoint = this.object_layer.objects.find(
      (obj) => obj.name === "start"
    );
    this.enemyGroups = this.physics.add.group();
    const enemyPoints = this.object_layer.objects.filter(
      (obj) => obj.name === "enemy"
    );

    if (startPoint) {
      this.player = new PlayerLaby(
        this,
        startPoint.x,
        startPoint.y,
        "hautAvance_1"
      );
    } else {
      console.error("Start point not found in object layer.");
    }
    this.player.sprite.setDepth(1);

    this.physics.add.collider(this.player.sprite, this.wall_layer);
    this.physics.add.collider(this.enemyGroups, this.wall_layer);
    this.physics.add.collider(this.player.sprite, this.chest_layer);

    this.enemies = [];
    enemyPoints.forEach((point) => {
      let enemy = new EnemyLaby(this, point.x, point.y, "enemy_laby");
      this.enemies.push(enemy);
      enemy.sprite.enemyInstance = enemy; // Associe l'instance de EnemyLaby au sprite

      this.enemyGroups.add(enemy.sprite); // Ajoute le sprite à enemyGroups pour les collisions
    });

    this.physics.add.overlap(
      this.player.attackHitbox,
      this.enemyGroups,
      this.attack,
      null,
      this
    );

    this.physics.add.overlap(
      this.player.sprite,
      this.enemyGroups,
      this.hit,
      null,
      this
    );

    this.spades_layer.forEachTile((tile) => {
      if (tile.properties.spike) {
        const spikePlatform = this.physics.add.image(
          tile.pixelX + tile.width / 2,
          tile.pixelY + tile.height / 2,
          "spike_off"
        );

        spikePlatform.setImmovable(true);
        spikePlatform.body.allowGravity = false;
        spikePlatform.active = false; // Par défaut, les piques sont désactivées

        this.physics.add.overlap(
          this.player.sprite,
          spikePlatform,
          () => {
            if (spikePlatform.active) {
              this.player.decreaseHealth(); // Le joueur perd des points de vie si les piques sont actives
            }
          },
          null,
          this
        );

        const spikeTime = parseInt(tile.properties.time) || 2000;
        this.time.addEvent({
          delay: spikeTime,
          callback: () => {
            spikePlatform.active = !spikePlatform.active;
            if (spikePlatform.active) {
              spikePlatform.setTexture("spike_on");
              this.soundSpike.play();
            } else {
              spikePlatform.setTexture("spike_off");
            }
          },
          loop: true,
        });

        this.spades_layer.removeTileAt(tile.x, tile.y);
      }
    });

    this.spades_layer.forEachTile((tile) => {
      if (tile.properties.fleche) {
        const orientation = tile.properties.orientation || "left";
        const time = parseInt(tile.properties.time) || 2000;

        const startX = tile.pixelX + tile.width / 2;
        const startY = tile.pixelY + tile.height / 2;

        const randomOffset = Phaser.Math.Between(0, time / 2);

        const shootArrow = () => {
          const distance = Phaser.Math.Distance.Between(
            this.player.sprite.x,
            this.player.sprite.y,
            startX,
            startY
          );

          if (distance < 7000) {
            this.soundArrow.play();
          }

          const arrow = this.physics.add.image(startX, startY, "arrow");
          arrow.body.allowGravity = false;

          switch (orientation) {
            case "left":
              arrow.setVelocityX(-1800);
              arrow.setRotation(0);
              break;
            case "right":
              arrow.setVelocityX(1800);
              arrow.setRotation(Phaser.Math.DegToRad(180));
              break;
            case "up":
              arrow.setVelocityY(-1800);
              arrow.setRotation(Phaser.Math.DegToRad(90));
              break;
            case "down":
              arrow.setVelocityY(1800);
              arrow.setRotation(Phaser.Math.DegToRad(-90));
              break;
          }

          this.physics.add.collider(arrow, this.wall_layer, () => {
            arrow.destroy();
          });

          this.physics.add.overlap(this.player.sprite, arrow, () => {
            this.player.decreaseHealth();
            arrow.destroy();
          });
        };

        this.time.addEvent({
          delay: time,
          callback: shootArrow,
          loop: true,
          startAt: randomOffset,
        });

        this.spades_layer.removeTileAt(tile.x, tile.y);
      }
    });

    this.chest_layer.forEachTile((tile) => {
      if (tile.properties.coffre || tile.properties.coffre_piege) {
        const orientation = tile.properties.orientation || "horizontal";
        const isVertical = orientation === "vertical";
        const topTile = isVertical
          ? this.chest_layer.getTileAt(tile.x, tile.y - 1)
          : this.chest_layer.getTileAt(tile.x + 1, tile.y);
        const bottomTile = tile;

        if (topTile && bottomTile) {
          const chestX = bottomTile.pixelX + bottomTile.width / 2;
          const chestY = isVertical
            ? (topTile.pixelY + bottomTile.pixelY) / 2 + bottomTile.height / 2
            : bottomTile.pixelY + bottomTile.height / 2;

          const chest = this.physics.add.image(chestX, chestY, "coffre_laby");

          chest.angle = isVertical ? 90 : 0;

          chest.setImmovable(true);
          chest.body.allowGravity = false;
          chest.isTrap = !!tile.properties.coffre_piege;

          if (isVertical) {
            chest.body.setSize(chest.width * 0.5, chest.height);
          } else {
            chest.body.setSize(chest.width, chest.height * 0.5);
          }

          this.physics.add.collider(
            this.player.sprite,
            chest,
            () => {
              if (this.player.keys.interact.isDown) {
                this.openChest(chest, isVertical);
              }
            },
            null,
            this
          );

          this.chest_layer.removeTileAt(tile.x, tile.y);
          this.chest_layer.removeTileAt(topTile.x, topTile.y);
        }
      }
    });

    this.wall_layer.forEachTile((tile) => {
      if (tile.properties.escalier) {
        const stair = this.physics.add.image(
          tile.pixelX + tile.width / 2,
          tile.pixelY + tile.height / 2,
          "stair_texture"
        );

        stair.setSize(tile.width, tile.height);

        stair.setImmovable(true);
        stair.body.allowGravity = false;

        this.physics.add.collider(
          this.player.sprite,
          stair,
          this.sortie,
          null,
          this
        );
      }
    });

    this.doors = [];
    this.lever = null;

    this.wall_layer.forEachTile((tile) => {
      if (tile.properties.porte) {
        const door = this.physics.add.staticImage(
          tile.pixelX + tile.width / 2,
          tile.pixelY + tile.height / 2,
          "door"
        );
        door.isOpen = tile.properties.etat === "open";

        door.orientation = tile.properties.orientation;

        // Ajuster la rotation et la taille de la porte selon l'orientation
        if (door.orientation === "vertical") {
          door.setRotation(Phaser.Math.DegToRad(90)); // Tourne la porte de 90 degrés
        }

        this.doors.push(door);
        this.updateDoorVisibility(door);

        this.wall_layer.removeTileAt(tile.x, tile.y);
      }

      if (tile.properties.levier) {
        const lever = this.physics.add.staticImage(
          tile.pixelX + tile.width / 2,
          tile.pixelY + tile.height / 2,
          "lever"
        );
        let keyPressed = false;
        lever.setInteractive();
        this.physics.add.collider(
          this.player.sprite,
          lever,
          () => {
            if (this.player.keys.interact.isDown && !keyPressed) {
              this.toggleDoors(lever);
              if (lever.texture.key === "lever") {
                lever.setTexture("lever_on");
              } else {
                lever.setTexture("lever");
              }
            }
          },
          null,
          this
        );

        setTimeout(() => {
          keyPressed = false; // Déverrouiller la touche quand elle est relâchée
        }, 800);
        this.lever = lever;

        this.wall_layer.removeTileAt(tile.x, tile.y);
      }
    });

    const zoomFactor = 0.2; // Par exemple, 0.2 pour réduire l'échelle à 20%

    this.cameras.main.setZoom(zoomFactor);

    this.cameras.main.startFollow(this.player.sprite);

    this.physics.world.setBounds(0, 0, 15360, 15360);
    this.cameras.main.setBounds(0, 0, 15360, 15360);
    this.cameras.main.setZoom(0.5);
  }

  update() {
    // Appeler l'update du joueur
    this.player.update();

    this.enemies.forEach((enemy) => {
      enemy.update(this.player);
    });
  }

  toggleDoors() {
    this.doors.forEach((door) => {
      door.isOpen = !door.isOpen;
      this.updateDoorVisibility(door);
    });
  }

  updateDoorVisibility(door) {
    if (door.isOpen) {
      door.disableBody(true, true); // Désactive les collisions et cache la porte
    } else {
      door.enableBody(false, door.x, door.y, true, true);
      if (door.orientation === "vertical") {
        door.body.setSize(door.height, door.width); // Ajuster la taille du body pour les portes verticales
      } else {
        door.body.setSize(door.width, door.height); // Taille par défaut pour les portes horizontales
      }
    }

    if (this.player) {
      this.physics.add.collider(this.player.sprite, door);
    }
  }

  hit() {
    this.player.decreaseHealth(this.scene);
  }

  attack(player, enemySprite) {
    enemySprite.enemyInstance.damage();
  }

  openChest(chest, isVertical) {
    if (chest.isOpened) {
      return;
    }

    chest.isOpened = true;

    if (chest.isTrap) {
      chest.setTexture("coffre_piege");
      this.player.decreaseHealth();
    } else {
      chest.setTexture("coffre_laby_ouvert");
      this.soundCoffre.play();
    }

    if (isVertical) {
      if (this.player.sprite.y < chest.y) {
        chest.setRotation(Phaser.Math.DegToRad(90));
      } else {
        chest.setRotation(Phaser.Math.DegToRad(-90));
      }
    } else {
      if (this.player.sprite.y < chest.y) {
        chest.setRotation(Phaser.Math.DegToRad(180)); // Tourne l'image de 180 degrés si le joueur est au-dessus
      } else {
        chest.setRotation(0); // Réinitialise la rotation si le joueur est en dessous
      }
    }
  }

  collectReward() {
    console.log("Récompense obtenue !");
  }

  sortie() {
    if (this.player.keys.interact.isDown) {
      this.scene.stop("Laby_map3");

      this.scene.start("tpt");
    }
  }

  fuite() {
    if (this.player.keys.interact.isDown) {
      this.scene.stop("Plateformer_map1");
      const mondeScene = this.scene.get("monde");
      this.scene.resume("monde");

      if (
        mondeScene.biomeMusic &&
        mondeScene.biomeMusic[mondeScene.currentMusic]
      ) {
        mondeScene.biomeMusic[mondeScene.currentMusic].resume();
      }
    }
  }
}
