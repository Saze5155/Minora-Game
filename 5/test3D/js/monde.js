import Animal from "/5/test3D/js/animal.js";
//import camera from "/5/test3D/js/cam.js";
//import DevMode from "/5/test3D/js/dev.js";
import PNJBiomes from "/5/test3D/js/biome.js";
import EnemyRPG from "/5/test3D/js/enemy_rpg.js";
import Insect from "/5/test3D/js/insect.js";
import Global from "/5/test3D/js/inventaire.js";
import laser from "/5/test3D/js/laser.js";
import {
  getBuildingTexture,
  getBushTexture,
  getCactusTexture,
  getDecoTexture,
  getRockTexture,
  getTreeTexture,
} from "/5/test3D/js/loading.js";
import Marchand from "/5/test3D/js/marchand.js";
import player from "/5/test3D/js/player.js";
import { FBXLoader } from "/5/test3D/lib/FBXLoader.js";

export default class monde extends Scene3D {
  constructor() {
    super({ key: "monde" });
    this.devMode = null;
    this.tilesData = [];
    this.trees = [];
    this.enemies = [];
    this.animaux = [];
    this.grandArbre = null;
    this.isDay = true;
    this.insects = [];
    this.blockingObjects = [];
    this.player = null;
    this.shaderMaterials = new Map();
    this.biomeMusic = null;
    this.currentMusic = null;
    this.interactiveObjects = {
      marmites: [],
      arbres: [],
      etoile: [],
      pyramide: [],
    };
  }

  init() {
    this.accessThirdDimension();
  }
  async create() {
    const textureLoader = new THREE.TextureLoader();
    //this.freeCamera = new camera(this);
    this.pointerLaser = new laser(this);

    this.player = new player(
      this,
      -119,
      251.2,
      -55,
      "/5/test3D/examples/anim_player/idle/_idle_1.png"
    );

    Global.player = this.player;

    this.pentagonPoints = [
      { x: -200, z: -10 },
      { x: -15, z: -15 },
      { x: 90, z: -188 },
      { x: -45, z: -215 },
      { x: -170, z: -124 },
    ];

    this.pentagonPointsDesert = [
      { x: 123, z: -148 },
      { x: 211, z: -56 },
      { x: 198, z: 70 },
      { x: 126, z: 160 },
      { x: 39, z: 3 },
    ];

    this.pentagonPointsSpace = [
      { x: 190, z: 66 },
      { x: -27, z: 52 },
      { x: 32, z: 201 },
      { x: -110, z: 177 },
      { x: -194, z: 60 },
    ];

    this.isInsidePentagon = (point, polygon) => {
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x,
          zi = polygon[i].z;
        const xj = polygon[j].x,
          zj = polygon[j].z;
        const intersect =
          zi > point.z !== zj > point.z &&
          point.x < ((xj - xi) * (point.z - zi)) / (zj - zi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    };

    for (let i = 0; i < 30; i++) {
      let enemyPositionFound = false;
      let x, z;

      while (!enemyPositionFound) {
        x = Math.random() * (97 - -213) + -213;
        z = Math.random() * (-14 - -194) + -194;

        if (this.isInsidePentagon({ x, z }, this.pentagonPoints)) {
          enemyPositionFound = true;
        }
      }

      const enemy = new EnemyRPG(
        this,
        x,
        251.5,
        z,
        "/5/test3D/examples/monstre 2/_walkdroite_1.png",
        this.player
      );

      this.enemies.push(enemy);
    }

    this.enemies.forEach((enemy) => {
      this.third.physics.add.collider(
        this.player.walkPlane,
        enemy.walkPlane,
        () => {
          this.player.decreaseHealth();
        }
      );
    });

    // ANIMAL

    for (let i = 0; i < 30; i++) {
      let animalPositionFound = false;
      let x, z;

      while (!animalPositionFound) {
        x = Math.random() * (97 - -213) + -213;
        z = Math.random() * (-14 - -194) + -194;

        if (this.isInsidePentagon({ x, z }, this.pentagonPoints)) {
          animalPositionFound = true;
        }
      }
      const random = Math.random() < 0.5 ? 1 : 2;

      let image = null;

      if (random == 1) {
        image = "/5/test3D/examples/vie/vie-20.png";
      } else if (random == 2) {
        image = "/5/test3D/examples/vie/vie-19.png";
      }

      const animal = new Animal(this, x, 251.8, z, image, this.player);

      this.animaux.push(animal);
    }

    this.marchands = [];
    this.marchands.push(new Marchand(this, -65, 252.6, -106));
    this.marchands.push(new Marchand(this, -72, 252.6, 122));
    this.marchands.push(new Marchand(this, 138, 252.6, 43));

    this.marchands.forEach((pnj) => {
      this.third.physics.add.collider(
        this.player.walkPlane,
        pnj.marchandMesh,
        () => {
          if (
            this.player.keys.interact &&
            this.player.keys.interact.isDown &&
            !this.isDay
          ) {
            pnj.showItemsForSale();
          }
        }
      );
    });

    this.pnjs = [];
    this.pnjs.push(new PNJBiomes(this, 136, 252.3, 38, this.player));
    this.pnjs.push(new PNJBiomes(this, -68, 252.3, 118, this.player));
    this.pnjs.push(new PNJBiomes(this, -60, 252.3, -107, this.player));

    this.pnjs.forEach((pnj) => {
      this.third.physics.add.collider(
        this.player.walkPlane, // Le joueur
        pnj.marchandMesh, // Le PNJ actuel
        () => {
          // Si la touche "interact" est enfoncée lors de la collision avec ce PNJ
          if (this.player.keys.interact && this.player.keys.interact.isDown) {
            pnj.showBiomeOptions(); // Afficher les options du biome pour ce PNJ
          }
        }
      );
    });

    for (let i = 0; i < 10; i++) {
      this.insects.push(
        new Insect(this, "/5/test3D/examples/vie/vie-18.png", 0.1)
      );
      this.insects.push(
        new Insect(this, "/5/test3D/examples/vie/vie-23.png", 0.1)
      );
      this.insects.push(
        new Insect(this, "/5/test3D/examples/vie/vie-25.png", 0.1)
      );
    }

    textureLoader.load("/5/test3D/examples/cuisine/marmitte.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(1.5, 1.5);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(130, 251.5, -15);

      this.third.physics.add.existing(tile, {
        shape: "box",
        width: 1.3, // Utilise la largeur de hitbox fournie
        height: 1, // Hauteur fixe
        depth: 1, // Profondeur fixe
        mass: 0,
      });
      this.interactiveObjects.marmites.push(tile);
      this.third.scene.add(tile);

      this.marmitteBox(tile);
    });

    textureLoader.load("/5/test3D/examples/cuisine/marmitte.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(1.5, 1.5);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(-104, 251.5, 131);

      this.third.physics.add.existing(tile, {
        shape: "box",
        width: 1.3, // Utilise la largeur de hitbox fournie
        height: 1, // Hauteur fixe
        depth: 1, // Profondeur fixe
        mass: 0,
      });
      this.interactiveObjects.marmites.push(tile);
      this.third.scene.add(tile);

      this.marmitteBox(tile);
    });

    textureLoader.load("/5/test3D/examples/cuisine/marmitte.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(1.5, 1.5);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(-87, 251.5, -113);

      this.third.physics.add.existing(tile, {
        shape: "box",
        width: 1.3, // Utilise la largeur de hitbox fournie
        height: 1, // Hauteur fixe
        depth: 1, // Profondeur fixe
        mass: 0,
      });
      this.interactiveObjects.marmites.push(tile);
      this.third.scene.add(tile);

      this.marmitteBox(tile);
    });

    this.marmitteBox = (marmitteBody) => {
      this.third.physics.add.collider(
        this.player.walkPlane,
        marmitteBody,
        () => {
          if (this.player.keys.interact && this.player.keys.interact.isDown) {
            const meatItem = Global.inventory.meatsAndHoney.find(
              (item) => item.type === "viande cru"
            );
            if (meatItem && meatItem.quantity > 0) {
              this.scene.launch("Cook"); // Lance la scène du mini-jeu
              this.sound.play("marmitte");
              this.scene.pause();
              meatItem.quantity--;
              if (meatItem.quantity === 0) {
                const index = Global.inventory.meatsAndHoney.indexOf(meatItem);
                if (index !== -1) {
                  Global.inventory.meatsAndHoney.splice(index, 1);
                  Global.inventoryElements = Global.inventoryElements.filter(
                    (element) => {
                      if (
                        element.texture &&
                        element.texture.key === "viande cru" &&
                        element.setVisible
                      ) {
                        element.destroy(); // Détruire l'image
                        return false;
                      }

                      if (
                        element.text &&
                        element.text === `${meatItem.quantity}`
                      ) {
                        element.destroy(); // Détruire le texte de la quantité
                        return false;
                      }

                      return true;
                    }
                  );
                }
              }
            } else {
              console.log("Vous n'avez pas de viande crue à cuire !");
            }
          }
        }
      );
    };

    this.third.warpSpeed("light", "fog");

    //this.third.physics.debug.enable();

    //this.devMode = new DevMode(this, this.freeCamera.camera, textureLoader);

    // Soleil et Lune
    const sunGeometry = new THREE.SphereGeometry(200, 32, 32); // Taille du soleil
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Couleur jaune pour le soleil
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);

    const moonGeometry = new THREE.SphereGeometry(200, 32, 32); // Taille de la lune
    const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Couleur blanche pour la lune
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);

    // Ajouter le soleil et la lune à la scène
    this.third.scene.add(sun);
    this.third.scene.add(moon);

    const sunDistance = 2000; // Distance du centre pour le soleil et la lune
    const rotationSpeed = (2 * Math.PI) / 120000; // Vitesse de rotation pour 1 minute par tour complet

    // Décalage du centre de rotation
    const centerOffset = { x: 0, y: 500, z: 5000 };

    let sunStartTime = performance.now();
    let previousRotation = 0;

    // Position initiale du soleil et de la lune (soleil à droite et lune à gauche)
    sun.position.set(centerOffset.x + sunDistance, centerOffset.y, -6500);
    moon.position.set(centerOffset.x - sunDistance, centerOffset.y, -6500);

    // Créer la lumière directionnelle liée au soleil
    const sunLight = new THREE.DirectionalLight(0xffc64b); // Couleur et intensité de la lumière
    sunLight.castShadow = true;
    this.third.scene.add(sunLight);

    // Créer une lumière ambiante qui va simuler l'éclairage général
    const ambientLight = new THREE.AmbientLight(0x0000ff, 10); // Couleur grise douce, intensité initiale à 0
    this.third.scene.add(ambientLight);

    // Fonction pour ajuster progressivement l'intensité de la lumière
    const adjustLightIntensity = (angle) => {
      // On calcule l'angle entre -π/2 (soleil à droite) et π/2 (lune à droite)
      const normalizedAngle = (Math.sin(angle) + 1) / 2; // Normalise pour obtenir une valeur entre 0 et 1

      // Ajuste l'intensité de la lumière du soleil et de la lune
      sunLight.intensity = 10 * normalizedAngle; // La lumière rouge augmente quand le soleil est à droite
      ambientLight.intensity = 1 - normalizedAngle; // La lumière ambiante augmente quand le soleil disparaît
    };

    // Fonction pour faire tourner le soleil et la lune
    const rotateSunAndMoon = (timestamp) => {
      const elapsedTime = timestamp - sunStartTime;

      // Calcule l'angle de rotation en fonction du temps écoulé
      const angle = rotationSpeed * elapsedTime;

      // Mettre à jour les positions du soleil et de la lune
      sun.position.x = centerOffset.x + sunDistance * Math.cos(angle);
      sun.position.y = centerOffset.y + sunDistance * Math.sin(angle);
      sun.position.z = -6500;

      moon.position.x = centerOffset.x - sunDistance * Math.cos(angle); // Opposé du soleil
      moon.position.y = centerOffset.y - sunDistance * Math.sin(angle); // Opposé du soleil
      moon.position.z = -6500;

      // Faire en sorte que la lumière directionnelle suive le soleil
      sunLight.position.copy(sun.position);

      // Ajuster l'intensité de la lumière en fonction de la position du soleil/lune
      adjustLightIntensity(angle);

      // Calculer si le soleil a complété une nouvelle rotation complète (chaque 2π = 1 rotation complète)
      const currentRotation = Math.floor(angle / (2 * Math.PI));

      // Vérifier si on a fait une rotation complète
      if (currentRotation > previousRotation) {
        previousRotation = currentRotation;
        console.log(`Rotation complète du soleil : ${currentRotation}`);
      }

      // Continue la rotation en boucle
      requestAnimationFrame(rotateSunAndMoon);
    };

    // Démarrer la rotation
    requestAnimationFrame(rotateSunAndMoon);

    this.third.renderer.shadowMap.enabled = true;

    const uniforms = {
      topColor: { value: new THREE.Color(0x0077ff) }, // Bleu clair pour le haut du ciel
      bottomColor: { value: new THREE.Color(0xffffff) }, // Blanc pour l'horizon
      offset: { value: 33 }, // Pour ajuster la position du dégradé
      exponent: { value: 0.6 }, // Pour contrôler la courbure du dégradé
    };

    const skyMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;

        varying vec3 vWorldPosition;

        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide, // Inverser la sphère pour voir de l'intérieur
    });

    const skyGeometry = new THREE.SphereGeometry(10000, 32, 32);
    const skySphere = new THREE.Mesh(skyGeometry, skyMat);
    this.third.scene.add(skySphere);

    // Variables pour gérer le changement de couleur et l'opacité
    const fadeDuration = 2000; // Durée du fondu en millisecondes
    let startTime = 0;

    // Tableau pour stocker les étoiles
    const stars = [];
    const starGeometry = new THREE.SphereGeometry(15, 8, 8); // Petite sphère pour représenter une étoile
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Couleur blanche pour les étoiles

    const starRadius = 10000; // Rayon de la sphère (correspond à la sphère de nuit)
    for (let i = 0; i < 6000; i++) {
      // Créer 200 étoiles
      const star = new THREE.Mesh(starGeometry, starMaterial);

      // Calculer une position aléatoire sur la sphère
      const phi = Math.random() * Math.PI; // Angle azimutal
      const theta = Math.random() * 2 * Math.PI; // Angle polaire

      // Convertir les coordonnées sphériques en coordonnées cartésiennes
      const x = starRadius * Math.sin(phi) * Math.cos(theta);
      const y = starRadius * Math.cos(phi);
      const z = starRadius * Math.sin(phi) * Math.sin(theta);

      star.position.set(x, y, z); // Positionner l'étoile
      star.visible = false; // Cacher les étoiles par défaut
      stars.push(star); // Ajouter l'étoile au tableaus
      this.third.scene.add(star); // Ajouter chaque étoile à la scène
    }

    // Variable pour stocker le temps de départ
    let startTime10 = null;

    // Fonction pour changer la couleur de la sphère avec fondu
    const changeSkyColor = () => {
      startTime10 = performance.now(); // Obtenir l'heure de départ à chaque changement de couleur
      this.isDay = !this.isDay; // Changer l'état du jour à nuit ou vice versa

      // Gérer la visibilité des étoiles
      stars.forEach((star) => {
        star.visible = this.isDay; // Afficher les étoiles seulement la nuit
      });

      // Commencer l'animation de fondu dès que la couleur change
      requestAnimationFrame(animateColorTransition);
    };

    const animateColorTransition = (timestamp) => {
      const elapsedTime = timestamp - startTime10;

      // Calculer la progression du fondu
      const progress = Math.min(elapsedTime / fadeDuration, 1);

      // Interpoler les couleurs
      if (this.isDay) {
        uniforms.topColor.value.lerp(new THREE.Color(0x000033), progress); // Fondu vers le bleu foncé
        uniforms.bottomColor.value.lerp(new THREE.Color(0x0022bb), progress); // Fondu vers le bleu foncé
      } else {
        uniforms.topColor.value.lerp(new THREE.Color(0x0077ff), progress); // Fondu vers le bleu clair
        uniforms.bottomColor.value.lerp(new THREE.Color(0xffffff), progress); // Fondu vers le blanc
      }

      // Indiquer que les uniformes doivent être mis à jour
      skyMat.needsUpdate = true;

      // Continuer l'animation jusqu'à ce que le fondu soit terminé
      if (progress < 1) {
        requestAnimationFrame(animateColorTransition);
      }
    };

    // Appeler `changeSkyColor` immédiatement pour commencer le premier cycle de 1 minute
    changeSkyColor();

    // Utiliser un intervalle régulier de 1 minute (60 secondes) pour chaque cycle
    setInterval(() => {
      changeSkyColor(); // Démarrer le changement de couleur
    }, 60000); // Intervalle régulier de 60 secondes pour chaque cycle

    this.third.camera.near = 0.1;
    this.third.camera.far = 10000;
    this.third.camera.updateProjectionMatrix();

    /**************************** */
    const texture = textureLoader.load("/5/test3D/examples/murail.png");
    const loader = new FBXLoader();

    loader.load(
      "/5/test3D/examples/murail.fbx",
      (fbx) => {
        fbx.traverse((child) => {
          if (child.isMesh) {
            child.material.map = texture;
            child.material.needsUpdate = true;
          }
        });

        // Paramètres pour chaque instance de muraille
        const instances = [
          {
            scale: 0.3,
            rotation: Math.PI / 1.2,
            modelCount: 5,
            offsetX: 128,
            offsetZ: -234,
            stepX: -28.5,
            stepZ: 50,
          },
          {
            scale: 0.3,
            rotation: Math.PI / 2,
            modelCount: 5,
            offsetX: -250,
            offsetZ: 0,
            stepX: 55,
            stepZ: 0,
          },
          {
            scale: 0.3,
            rotation: Math.PI / 6,
            modelCount: 5,
            startX: 157,
            startZ: 284,
            endX: 4,
            endZ: 7,
          },
        ];

        instances.forEach((instance) => {
          fbx.scale.set(instance.scale, instance.scale, instance.scale);
          fbx.rotation.y = instance.rotation;

          const {
            modelCount,
            offsetX,
            offsetZ,
            stepX,
            stepZ,
            startX,
            startZ,
            endX,
            endZ,
          } = instance;

          for (let i = 0; i < modelCount; i++) {
            const clonedModel = fbx.clone();

            // Logique pour la première et la deuxième instance
            if (offsetX !== undefined && offsetZ !== undefined) {
              const posX = offsetX + stepX * i;
              const posZ = offsetZ + stepZ * i;
              clonedModel.position.set(posX, 262, posZ);
            }

            // Logique pour la troisième instance avec interpolation linéaire
            if (startX !== undefined && endX !== undefined) {
              const stepX = (endX - startX) / (modelCount - 1);
              const stepZ = (endZ - startZ) / (modelCount - 1);
              const posX = startX + stepX - 28.5 * i;
              const posZ = startZ + stepZ - 50 * i;
              clonedModel.position.set(posX, 262, posZ);
            }

            this.third.scene.add(clonedModel);

            // Ajouter la physique au modèle
            this.third.physics.add.existing(clonedModel, {
              shape: "box",
              width: clonedModel.scale.x * 220,
              height: clonedModel.scale.y * 300,
              depth: clonedModel.scale.z * 700,
              mass: 0,
            });
          }
        });
      },
      undefined,
      (error) => {
        console.error("Erreur lors du chargement du fichier FBX:", error);
      }
    );

    const textureTower = textureLoader.load("/5/test3D/examples/tower.png");

    loader.load(
      "/5/test3D/examples/tower.fbx",
      (fbx) => {
        fbx.traverse((child) => {
          if (child.isMesh) {
            // Appliquer la texture au matériau du modèle
            child.material.map = textureTower;
            child.material.needsUpdate = true;
          }
        });

        // Ajuster l'échelle et la rotation du modèle de base
        fbx.scale.set(0.5, 0.5, 0.5);

        fbx.position.set(0, 295, 0);

        // Ajouter le modèle cloné à la scène
        this.third.scene.add(fbx);
      },
      undefined,
      function (error) {
        console.error("Erreur lors du chargement du fichier FBX:", error);
      }
    );

    // Initialiser les musiques pour chaque biome avec volume par défaut
    this.biomeMusic = {
      nature: this.sound.add("nature_music", { loop: true, volume: 0.3 }), // Volume à 50%
      desert: this.sound.add("desert_music", { loop: true, volume: 0.5 }), // Volume à 70%
      espace: this.sound.add("space_music", { loop: true, volume: 0.1 }), // Volume à 40%
    };

    // Jouer la première musique (par exemple Nature)
    this.currentMusic = "nature";
    this.biomeMusic.nature.play();

    const topTexture1 = textureLoader.load(
      "/5/test3D/examples/vie/tuiles/tuile2.png"
    );
    const topTexture2 = textureLoader.load(
      "/5/test3D/examples/éléments desert/sol.png"
    );
    const topTexture3 = textureLoader.load(
      "/5/test3D/examples/espace/espace-13.png"
    );
    const sideTexture = textureLoader.load("/5/test3D/examples/eau.png");

    // Répétition des textures
    sideTexture.wrapS = THREE.RepeatWrapping;
    sideTexture.wrapT = THREE.RepeatWrapping;
    sideTexture.repeat.set(20, 3);

    topTexture1.wrapS = THREE.RepeatWrapping;
    topTexture1.wrapT = THREE.RepeatWrapping;
    topTexture1.repeat.set(50, 50); // Ajuste selon les besoins

    topTexture2.wrapS = THREE.RepeatWrapping;
    topTexture2.wrapT = THREE.RepeatWrapping;
    topTexture2.repeat.set(50, 50); // Ajuste selon les besoins

    topTexture3.wrapS = THREE.RepeatWrapping;
    topTexture3.wrapT = THREE.RepeatWrapping;
    topTexture3.repeat.set(50, 50); // Ajuste selon les besoins

    const topMaterials = [
      new THREE.MeshStandardMaterial({ map: topTexture1 }),
      new THREE.MeshStandardMaterial({ map: topTexture2 }),
      new THREE.MeshStandardMaterial({ map: topTexture3 }),
    ];

    const geometries = [
      new THREE.CircleGeometry(250, 3, Math.PI / 3, (2 * Math.PI) / 3), // Nature
      new THREE.CircleGeometry(250, 3, -Math.PI / 3, (2 * Math.PI) / 3), // Désert
      new THREE.CircleGeometry(250, 3, Math.PI, (2 * Math.PI) / 3), // Espace
    ];
    for (let i = 0; i < geometries.length; i++) {
      const topMesh = new THREE.Mesh(geometries[i], topMaterials[i]);
      topMesh.rotation.x = -Math.PI / 2; // Mettre à plat le plan
      topMesh.position.set(0, 251, 0); // Ajuste la position pour correspondre au cube
      this.third.scene.add(topMesh);
    }

    // Points de base pour le biome "espace"
    const spacePoints = [
      new THREE.Vector3(-11, 0, 14),
      new THREE.Vector3(105, 0, 217),
      new THREE.Vector3(-43, 0, 244),
      new THREE.Vector3(-189, 0, 158),
      new THREE.Vector3(-240, 0, 17),
    ];

    // Créer la forme de la base pour l'espace
    const spaceShape = new THREE.Shape();
    spaceShape.moveTo(spacePoints[0].x, spacePoints[0].z);
    for (let i = 1; i < spacePoints.length; i++) {
      spaceShape.lineTo(spacePoints[i].x, spacePoints[i].z);
    }
    spaceShape.lineTo(spacePoints[0].x, spacePoints[0].z); // Fermer la forme

    // Créer une courbe pour générer la forme arrondie uniquement pour l'espace
    const curve = new THREE.EllipseCurve(
      0,
      0, // Centre de l'ellipse
      180,
      180, // Rayon x et y pour un dôme plus petit
      0,
      Math.PI / 2, // Angle de départ et d'arrivée pour un demi-cercle
      false // Sens horaire
    );

    // Utiliser la courbe pour créer des points de rotation (lathe)
    const curvePoints = curve.getPoints(30); // Plus de points pour une forme plus lisse
    const latheGeometry = new THREE.LatheGeometry(
      curvePoints.map((p) => new THREE.Vector3(p.x, p.y, 0)), // Points de la courbe
      32 // Segments de rotation pour arrondir le dôme
    );

    // Appliquer le matériau au dôme
    const material = new THREE.MeshStandardMaterial({
      color: 0x000000,
      opacity: 0.95,
      transparent: true,
      side: THREE.DoubleSide,
    });

    // Créer le mesh du dôme
    const dome = new THREE.Mesh(latheGeometry, material);

    // Ajuster la position pour le placer au-dessus du biome "espace"
    dome.position.set(-110, 251, 186); // Ajuste la position selon les besoins de la scène
    //dome.rotation.x = Math.PI / 4; // Placer le dôme à plat
    this.third.scene.add(dome);

    const sideMaterials = [
      new THREE.MeshStandardMaterial({ map: sideTexture }), // Face 1 (côté)
      new THREE.MeshStandardMaterial({ map: sideTexture }), // Face 2 (côté)
      new THREE.MeshStandardMaterial({ visible: false }), // Face supérieure (on la remplace par les biomes)
      new THREE.MeshStandardMaterial({ map: sideTexture }), // Face 4 (côté)
      new THREE.MeshStandardMaterial({ map: sideTexture }), // Face inférieure
      new THREE.MeshStandardMaterial({ map: sideTexture }), // Face 6 (côté)
    ];
    const cubeGeometry = new THREE.BoxGeometry(4000, 500, 4000);
    const cube = new THREE.Mesh(cubeGeometry, sideMaterials);

    // Ajouter le cube (côtés) à la scène
    cube.position.set(0, 1, 0);
    this.third.scene.add(cube);
    this.pointerLaser.addObject(cube);

    // Ajouter la physique au cube (collision)
    this.third.physics.add.existing(cube, { mass: 0 });
    //this.devMode.setTargetCube(cube);

    const cubeVillageGeometry = new THREE.BoxGeometry(100, 10, 100);

    const materialVillage = new THREE.MeshStandardMaterial({
      map: topTexture1,
      side: THREE.DoubleSide,
    });
    const cubeVillage = new THREE.Mesh(cubeVillageGeometry, materialVillage);

    cubeVillage.position.set(356, 251, -325);
    this.third.physics.add.existing(cubeVillage, { mass: 0 });
    this.third.scene.add(cubeVillage);

    const waterTexture = textureLoader.load("/5/test3D/examples/eau.png");

    const waterMaterial = new THREE.MeshStandardMaterial({
      map: waterTexture,
      transparent: true, // Transparence pour l'eau
      opacity: 0.7, // Ajuste la transparence
      side: THREE.DoubleSide, // Visible des deux côtés
    });

    const cubeWater = new THREE.BoxGeometry(9000, 100, 9000);
    const water = new THREE.Mesh(cubeWater, waterMaterial);
    water.position.set(0, -1, 0);
    this.third.scene.add(water);

    // ARBRE

    fetch("/5/test3D/json/treePositions.json")
      .then((response) => response.json())
      .then((treePositions) => {
        treePositions.forEach((treeData) => {
          const { x, z, hitboxWidth, texture } = treeData;

          const loadedTexture = getTreeTexture(texture);
          if (loadedTexture) {
            const planeGeometry = new THREE.PlaneGeometry(25, 25);
            const planeMaterial = new THREE.MeshStandardMaterial({
              map: loadedTexture,
              side: THREE.DoubleSide,
              transparent: true,
              alphaTest: 0.5,
            });

            const tree = new THREE.Mesh(planeGeometry, planeMaterial);
            tree.position.set(x, 263.2, z);
            tree.rotation.y = Math.random() * Math.PI * 2;

            this.third.physics.add.existing(tree, {
              shape: "box",
              width: hitboxWidth,
              height: 40,
              depth: 1,
              mass: 0,
            });
            this.blockingObjects.push(tree);
            this.third.scene.add(tree);
          }
        });

        console.log("Tous les arbres ont été placés avec leurs hitboxs.");
      })
      .catch((error) => {
        console.error(
          "Erreur lors du chargement des positions des arbres:",
          error
        );
      });

    // BUSH ET FLOWER

    fetch("/5/test3D/json/bushPositions.json")
      .then((response) => response.json())
      .then((bushPositions) => {
        bushPositions.forEach((bushData) => {
          const { x, z, texture } = bushData;

          const loadedTexture = getBushTexture(texture);
          if (loadedTexture) {
            const planeGeometry = new THREE.PlaneGeometry(5, 5);
            const planeMaterial = new THREE.MeshStandardMaterial({
              map: loadedTexture,
              side: THREE.DoubleSide,
              transparent: true,
              alphaTest: 0.5,
            });

            const bush = new THREE.Mesh(planeGeometry, planeMaterial);
            bush.position.set(x, 253.5, z);
            bush.rotation.y = Math.random() * Math.PI * 2;

            this.third.scene.add(bush);
          }
        });

        console.log("Tous les arbres ont été placés avec leurs hitboxs.");
      })
      .catch((error) => {
        console.error(
          "Erreur lors du chargement des positions des arbres:",
          error
        );
      });

    // CACTUS
    fetch("/5/test3D/json/cactusPositions.json")
      .then((response) => response.json())
      .then((cactusPositions) => {
        cactusPositions.forEach((cactusData) => {
          const { x, z, hitboxWidth, texture, scale } = cactusData;

          const loadedTexture = getCactusTexture(texture);
          if (loadedTexture) {
            const planeGeometry = new THREE.PlaneGeometry(
              10 * scale,
              10 * scale
            ); // Applique le scale
            const planeMaterial = new THREE.MeshStandardMaterial({
              map: loadedTexture,
              side: THREE.DoubleSide,
              transparent: true,
              alphaTest: 0.5,
            });

            const cactus = new THREE.Mesh(planeGeometry, planeMaterial);
            cactus.position.set(x, 251 + 5 * scale, z);
            cactus.rotation.y = Math.random() * Math.PI * 2;

            this.third.physics.add.existing(cactus, {
              shape: "box",
              width: hitboxWidth,
              height: 40 * scale, // Applique le scale à la hitbox aussi
              depth: 1,
              mass: 0,
            });
            this.blockingObjects.push(cactus);
            this.third.scene.add(cactus);
          }
        });

        console.log(
          "Tous les cactus ont été placés avec leurs hitboxs et scale."
        );
      })
      .catch((error) => {
        console.error(
          "Erreur lors du chargement des positions des cactus:",
          error
        );
      });

    // MONTAGNE

    this.third.load
      .texture("/5/test3D/examples/heightmap-island.png")
      .then((heightmap) => {
        // La texture est maintenant chargée
        const colorScale = chroma
          .scale([
            "#a49463",
            "#a49420",
            "#a49463",
            "#867645",
            "#3c6114",
            "#5a7f32",
            "#8c8e7b",
            "#a0a28f",
            "#ebebeb",
          ])
          .domain([0, 0.025, 0.1, 0.2, 0.25, 0.8, 1.3, 1.45, 1.6]);

        const messh = this.third.heightMap.add(heightmap, {
          colorScale,
          colorSpace: "srgb",
        });

        if (messh) {
          // Nous positionnons, scalons, et ajoutons des propriétés physiques au mesh
          messh.scale.set(2000, 2000, 500);
          this.third.physics.add.existing(messh, { mass: 0 });
        }
      })
      .catch((error) => {
        console.error("Erreur lors du chargement de la texture:", error);
      });

    textureLoader.load("/5/test3D/examples/vie/grand arbre.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(50, 50);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -73.91736072700492,
        275.9680000000002,
        -112.16006335648504
      );
      if (12.173671532660457 != undefined) {
        tile.rotation.y = 12.173671532660457;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }

      this.third.physics.add.existing(tile, {
        shape: "box",
        width: 18, // Utilise la largeur de hitbox fournie
        height: 150, // Hauteur fixe
        depth: 1, // Profondeur fixe
        mass: 0, // Arbre statique
      });
      this.blockingObjects.push(tile);

      this.interactiveObjects.arbres.push(tile);
      this.third.scene.add(tile);

      this.treeInteraction(tile);
    });

    this.treeInteraction = (grandArbreBody) => {
      this.third.physics.add.collider(
        this.player.walkPlane,
        grandArbreBody,
        () => {
          if (this.player.keys.interact && this.player.keys.interact.isDown) {
            this.handleInteraction("arbre");
          }
        }
      );
    };

    textureLoader.load("/5/test3D/examples/vie/vie-12.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -24.144239471472503,
        255.86000000000018,
        -56.43107019313504
      );
      if (0.7853981633974483 != undefined) {
        tile.rotation.y = 0.7853981633974483;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });

      this.blockingObjects.push(tile);
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-12.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -135.11749303246083,
        255.86000000000018,
        -66.32331694264238
      );
      if (5.497787143782139 != undefined) {
        tile.rotation.y = 5.497787143782139;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.blockingObjects.push(tile);
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-12.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -24.006319521490433,
        255.86000000000018,
        -174.60762959277756
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.blockingObjects.push(tile);
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-12.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -93.04725448477414,
        255.86000000000018,
        -140.6607726239188
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.blockingObjects.push(tile);
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-13.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -60.55559940623982,
        255.9680000000002,
        -143.72091992381576
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.blockingObjects.push(tile);
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-13.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -51.483593674235486,
        255.9680000000002,
        -77.40248041852772
      );
      if (0.7853981633974483 != undefined) {
        tile.rotation.y = 0.7853981633974483;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.blockingObjects.push(tile);
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-13.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -110.07150414538015,
        255.9680000000002,
        -105.34423881433457
      );
      if (1.1780972450961724 != undefined) {
        tile.rotation.y = 1.1780972450961724;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.blockingObjects.push(tile);
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-13.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -151.73859002138175,
        255.9680000000002,
        -130.98043500265092
      );
      if (1.1780972450961724 != undefined) {
        tile.rotation.y = 1.1780972450961724;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.blockingObjects.push(tile);
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-12.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -36.716230635649,
        255.86000000000018,
        -117.61377363385355
      );
      if (11.388273369263008 != undefined) {
        tile.rotation.y = 11.388273369263008;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.blockingObjects.push(tile);
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-13.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -54.402909733833646,
        255.9680000000002,
        -25.801201630935132
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.blockingObjects.push(tile);
      this.third.scene.add(tile);
    });

    // DESERT

    fetch("/5/test3D/json/rockPositions.json")
      .then((response) => response.json())
      .then((rockPositions) => {
        rockPositions.forEach((rockData, index) => {
          const { x, y, z, hitboxWidth, texture, rotation, scale } = rockData;

          const loadedTexture = getRockTexture(texture);
          if (loadedTexture) {
            // Géométrie de base pour les rochers
            const planeGeometry = new THREE.PlaneGeometry(
              40 * scale,
              20 * scale
            );
            const planeMaterial = new THREE.MeshStandardMaterial({
              map: loadedTexture,
              side: THREE.DoubleSide,
              transparent: true,
              alphaTest: 0.5,
            });

            const rock = new THREE.Mesh(planeGeometry, planeMaterial);

            let adjustedZ = z;
            if (scale < 0.8) {
              if (index >= 20 && index < 40) {
                // Ajustement pour les petits rochers de la 2e rangée
                adjustedZ -= 18;
              } else if (index >= 40) {
                // Ajustement pour les petits rochers de la 3e rangée
                adjustedZ -= 25;
              } else {
                // Ajustement pour les autres petits rochers
                adjustedZ += 18;
              }
            }

            rock.position.set(x, y, adjustedZ);
            rock.rotation.y = rotation;

            // Ajouter la physique au rocher
            this.third.physics.add.existing(rock, {
              shape: "box",
              width: hitboxWidth * scale,
              height: 40 * scale,
              depth: 1,
              mass: 0,
            });

            this.blockingObjects.push(rock);
            this.third.scene.add(rock);
          }
        });

        console.log("Tous les rochers ont été placés avec leurs hitboxs.");
      })
      .catch((error) => {
        console.error(
          "Erreur lors du chargement des positions des rochers:",
          error
        );
      });

    fetch("/5/test3D/json/decoDesertPositions.json")
      .then((response) => response.json())
      .then((decoPositions) => {
        decoPositions.forEach((decoData) => {
          const { x, y, z, hitboxWidth, texture, scale } = decoData;

          const loadedTexture = getDecoTexture(texture);
          if (loadedTexture) {
            // Géométrie de base pour les rochers
            const planeGeometry = new THREE.PlaneGeometry(scale, scale);
            const planeMaterial = new THREE.MeshStandardMaterial({
              map: loadedTexture,
              side: THREE.DoubleSide,
              transparent: true,
              alphaTest: 0.5,
            });

            const deco = new THREE.Mesh(planeGeometry, planeMaterial);

            deco.position.set(x, y, z);
            if (texture == "/5/test3D/examples/éléments desert/arbremort.png") {
              this.third.physics.add.existing(deco, {
                shape: "box",
                width: hitboxWidth,
                height: 40 * scale,
                depth: 1,
                mass: 0,
              });
            }
            this.blockingObjects.push(deco);
            this.third.scene.add(deco);
          }
        });

        console.log("Tous les deco ont été placés avec leurs hitboxs.");
      })
      .catch((error) => {
        console.error(
          "Erreur lors du chargement des positions des deco:",
          error
        );
      });

    textureLoader.load(
      "/5/test3D/examples/éléments desert/pyramideporte.png",
      (texture) => {
        const planeGeometry = new THREE.PlaneGeometry(50, 50);
        const planeMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          alphaTest: 0.5,
        });

        const tile = new THREE.Mesh(planeGeometry, planeMaterial);
        tile.position.set(
          139.49409377707724,
          276.09999999999974,
          11.543831371491947
        );
        if (1.5707963267948966 != undefined) {
          tile.rotation.y = 1.5707963267948966;
        }
        if (0 != undefined) {
          tile.rotation.x = 0;
        }
        this.third.physics.add.existing(tile, { mass: 0 });

        this.interactiveObjects.pyramide.push(tile);

        this.third.scene.add(tile);

        this.pyramideInteraction(tile);
      }
    );

    this.pyramideInteraction = (pyramideBody) => {
      this.third.physics.add.collider(
        this.player.walkPlane,
        pyramideBody,
        () => {
          if (this.player.keys.interact && this.player.keys.interact.isDown) {
            this.handleInteraction("pyramide");
          }
        }
      );
    };

    textureLoader.load(
      "/5/test3D/examples/éléments desert/pyramide2.png",
      (texture) => {
        const planeGeometry = new THREE.PlaneGeometry(25, 25);
        const planeMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          alphaTest: 0.5,
        });

        const tile = new THREE.Mesh(planeGeometry, planeMaterial);
        tile.position.set(167.3921496324336, 264, -12.803236929366555);
        if (1.5707963267948966 != undefined) {
          tile.rotation.y = 1.5707963267948966;
        }
        if (0 != undefined) {
          tile.rotation.x = 0;
        }
        this.third.physics.add.existing(tile, { mass: 0 });
        this.third.scene.add(tile);
      }
    );

    textureLoader.load(
      "/5/test3D/examples/éléments desert/pyramide1.png",
      (texture) => {
        const planeGeometry = new THREE.PlaneGeometry(35, 35);
        const planeMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          alphaTest: 0.5,
        });

        const tile = new THREE.Mesh(planeGeometry, planeMaterial);
        tile.position.set(
          154.2903310815235,
          269.09999999999974,
          34.78227100052244
        );
        if (1.5707963267948966 != undefined) {
          tile.rotation.y = 1.5707963267948966;
        }
        if (0 != undefined) {
          tile.rotation.x = 0;
        }
        this.third.physics.add.existing(tile, { mass: 0 });
        this.third.scene.add(tile);
      }
    );

    textureLoader.load(
      "/5/test3D/examples/éléments desert/ruine1.png",
      (texture) => {
        const planeGeometry = new THREE.PlaneGeometry(10, 10);
        const planeMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          alphaTest: 0.5,
        });

        const tile = new THREE.Mesh(planeGeometry, planeMaterial);
        tile.position.set(
          183.72985239244892,
          255.99999999999974,
          -77.67657466825762
        );
        if (4.319689898685965 != undefined) {
          tile.rotation.y = 4.319689898685965;
        }
        if (6.283185307179588 != undefined) {
          tile.rotation.x = 6.283185307179588;
        }
        this.third.physics.add.existing(tile, { mass: 0 });
        this.third.scene.add(tile);
      }
    );

    textureLoader.load(
      "/5/test3D/examples/éléments desert/ruine2.png",
      (texture) => {
        const planeGeometry = new THREE.PlaneGeometry(10, 10);
        const planeMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          alphaTest: 0.5,
        });

        const tile = new THREE.Mesh(planeGeometry, planeMaterial);
        tile.position.set(
          140.7577316045796,
          255.69999999999973,
          86.46939844567527
        );
        if (0 != undefined) {
          tile.rotation.y = 0;
        }
        if (0 != undefined) {
          tile.rotation.x = 0;
        }
        this.third.physics.add.existing(tile, { mass: 0 });
        this.third.scene.add(tile);
      }
    );

    textureLoader.load(
      "/5/test3D/examples/éléments desert/ruine2.png",
      (texture) => {
        const planeGeometry = new THREE.PlaneGeometry(10, 10);
        const planeMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          alphaTest: 0.5,
        });

        const tile = new THREE.Mesh(planeGeometry, planeMaterial);
        tile.position.set(
          55.25745903018485,
          255.69999999999973,
          -1.555403591011519
        );
        if (0.7853981633974483 != undefined) {
          tile.rotation.y = 0.7853981633974483;
        }
        if (0 != undefined) {
          tile.rotation.x = 0;
        }
        this.third.physics.add.existing(tile, { mass: 0 });
        this.third.scene.add(tile);
      }
    );

    textureLoader.load(
      "/5/test3D/examples/éléments desert/ruine1.png",
      (texture) => {
        const planeGeometry = new THREE.PlaneGeometry(10, 10);
        const planeMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          alphaTest: 0.5,
        });

        const tile = new THREE.Mesh(planeGeometry, planeMaterial);
        tile.position.set(
          191.29863210654236,
          255.99999999999972,
          6.522124939996715
        );
        if (4.71238898038469 != undefined) {
          tile.rotation.y = 4.71238898038469;
        }
        if (0 != undefined) {
          tile.rotation.x = 0;
        }
        this.third.physics.add.existing(tile, { mass: 0 });
        this.third.scene.add(tile);
      }
    );

    textureLoader.load(
      "/5/test3D/examples/éléments desert/ruine1.png",
      (texture) => {
        const planeGeometry = new THREE.PlaneGeometry(10, 10);
        const planeMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          alphaTest: 0.5,
        });

        const tile = new THREE.Mesh(planeGeometry, planeMaterial);
        tile.position.set(
          99.91537600588174,
          255.99999999999972,
          -140.16139751607744
        );
        if (0 != undefined) {
          tile.rotation.y = 0;
        }
        if (0 != undefined) {
          tile.rotation.x = 0;
        }
        this.third.physics.add.existing(tile, { mass: 0 });
        this.third.scene.add(tile);
      }
    );

    //ESPACES

    textureLoader.load("/5/test3D/examples/espace/etoile.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(50, 50);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -89.81946315247924,
        273.69999999999973,
        121.5749217778453
      );
      if (5.497787143782139 != undefined) {
        tile.rotation.y = 6.497787143782139;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.interactiveObjects.etoile.push(tile);
      this.third.scene.add(tile);

      this.etoileInteraction(tile);
    });

    this.etoileInteraction = (etoileBody) => {
      this.third.physics.add.collider(this.player.walkPlane, etoileBody, () => {
        if (this.player.keys.interact && this.player.keys.interact.isDown) {
          this.handleInteraction("etoile");
        }
      });
    };

    fetch("/5/test3D/json/buildingPosition.json")
      .then((response) => response.json())
      .then((buildPositions) => {
        buildPositions.forEach((buildData) => {
          const { position, rotation_y, texture } = buildData;

          const loadedTexture = getBuildingTexture(texture);
          if (loadedTexture) {
            const planeGeometry = new THREE.PlaneGeometry(35, 75);
            const planeMaterial = new THREE.MeshStandardMaterial({
              map: loadedTexture,
              side: THREE.DoubleSide,
              transparent: true,
              alphaTest: 0.5,
            });

            const bush = new THREE.Mesh(planeGeometry, planeMaterial);
            bush.position.set(position.x, position.y, position.z);
            bush.rotation.y = rotation_y;

            this.third.scene.add(bush);
          }
        });

        console.log("Tous les build ont été placés avec leurs hitboxs.");
      })
      .catch((error) => {
        console.error(
          "Erreur lors du chargement des positions des build:",
          error
        );
      });

    fetch("/5/test3D/json/buildingSmallPosition.json")
      .then((response) => response.json())
      .then((buildPositions) => {
        buildPositions.forEach((buildData) => {
          const { position, rotation_y, texture } = buildData;

          const loadedTexture = getBuildingTexture(texture);
          if (loadedTexture) {
            const planeGeometry = new THREE.PlaneGeometry(8, 14);
            const planeMaterial = new THREE.MeshStandardMaterial({
              map: loadedTexture,
              side: THREE.DoubleSide,
              transparent: true,
              alphaTest: 0.5,
            });

            const bush = new THREE.Mesh(planeGeometry, planeMaterial);
            bush.position.set(position.x, position.y, position.z);
            bush.rotation.y = rotation_y;

            this.third.scene.add(bush);
          }
        });

        console.log("Tous les build ont été placés avec leurs hitboxs.");
      })
      .catch((error) => {
        console.error(
          "Erreur lors du chargement des positions des build:",
          error
        );
      });

    fetch("/5/test3D/json/treeSmallPosition.json")
      .then((response) => response.json())
      .then((buildPositions) => {
        buildPositions.forEach((buildData) => {
          const { position, rotation_y, texture } = buildData;

          const loadedTexture = getTreeTexture(texture);
          if (loadedTexture) {
            const planeGeometry = new THREE.PlaneGeometry(8, 14);
            const planeMaterial = new THREE.MeshStandardMaterial({
              map: loadedTexture,
              side: THREE.DoubleSide,
              transparent: true,
              alphaTest: 0.5,
            });

            const bush = new THREE.Mesh(planeGeometry, planeMaterial);
            bush.position.set(position.x, position.y, position.z);
            bush.rotation.y = rotation;

            this.third.scene.add(bush);
          }
        });

        console.log("Tous les build ont été placés avec leurs hitboxs.");
      })
      .catch((error) => {
        console.error(
          "Erreur lors du chargement des positions des build:",
          error
        );
      });
  }

  attackPlayer() {
    // Supprimer la hitbox actuelle s'il en existe déjà une
    this.player.removeHitbox();

    // Créer une nouvelle hitbox
    const hitbox = this.player.hitboxAttack();

    if (hitbox) {
      this.enemies.forEach((enemy) => {
        this.third.physics.add.collider(hitbox, enemy.walkPlane, () => {
          if (enemy.isTakingDamage) {
            enemy.isTakingDamage = false;
            enemy.takeDamage(this.player.walkPlane.position);
          }
          setTimeout(() => {
            enemy.isTakingDamage = true;
          }, 500);
        });
      });

      this.animaux.forEach((animal) => {
        this.third.physics.add.collider(hitbox, animal.walkPlane, () => {
          if (animal.isTakingDamage) {
            animal.isTakingDamage = false;
            animal.takeDamage(this.player.walkPlane.position);
          }
          setTimeout(() => {
            animal.isTakingDamage = true;
          }, 500);
        });
      });

      // Supprimer la hitbox après un court délai
      setTimeout(() => {
        this.player.removeHitbox();
      }, 100);
    }
  }

  update() {
    //this.freeCamera.update();
    this.pointerLaser.update();

    this.animaux.forEach((animal) => {
      animal.update(this.player);
    });
    this.enemies.forEach((enemy) => {
      enemy.update(this.player);
    });

    this.player.update(this);

    if (this.input.activePointer.leftButtonDown() && this.player.isOnGround()) {
      this.attackPlayer();
    }

    this.insects.forEach((insect) => insect.update());
  }
  changeMusic(biome) {
    // Arrêter la musique actuelle
    if (this.currentMusic && this.biomeMusic[this.currentMusic]) {
      this.biomeMusic[this.currentMusic].stop();
    }

    // Lancer la musique du nouveau biome
    if (this.biomeMusic[biome]) {
      this.biomeMusic[biome].play();
      this.currentMusic = biome;
    }
  }

  handleInteraction = (key) => {
    this.scene.pause("monde");
    if (key == "arbre") {
      this.scene.launch("Plateformer_map1", { previousScene: "monde" });
      this.player.scene.sound.stopByKey("walk_grass");
      this.biomeMusic[this.currentMusic].pause();
    } else if (key == "pyramide") {
      this.scene.launch("Laby_map1", { previousScene: "monde" });
      this.player.scene.sound.stopByKey("walk_grass");
      this.biomeMusic[this.currentMusic].pause();
    } else if (key == "etoile") {
      this.scene.launch("SpaceLevel", { previousScene: "monde" });
      this.player.scene.sound.stopByKey("walk_grass");
      this.biomeMusic[this.currentMusic].pause();
    }
  };

  destroyAllEnemiesAndAnimals() {
    // Boucle pour supprimer chaque ennemi
    this.enemies.forEach((enemy) => {
      this.third.scene.remove(enemy.walkPlane); // Supprime de la scène
      enemy.walkPlane.geometry.dispose(); // Libère la géométrie
      enemy.walkPlane.material.dispose(); // Libère le matériel
      if (enemy.walkPlane.body)
        this.third.physics.destroy(enemy.walkPlane.body); // Détruire le corps physique
    });

    // Boucle pour supprimer chaque animal
    this.animaux.forEach((animal) => {
      this.third.scene.remove(animal.walkPlane); // Supprime de la scène
      animal.walkPlane.geometry.dispose(); // Libère la géométrie
      animal.walkPlane.material.dispose(); // Libère le matériel
      if (animal.walkPlane.body)
        this.third.physics.destroy(animal.walkPlane.body); // Détruire le corps physique
    });

    // Vider les tableaux après destruction
    this.enemies = [];
    this.animaux = [];
  }

  spawnEnemiesAndAnimals(biome) {
    let pentagonPoints, xMin, xMax, zMin, zMax;

    // Définir les bornes pour chaque biome
    if (biome === "nature") {
      pentagonPoints = this.pentagonPoints;
      xMin = -213;
      xMax = 97;
      zMin = -194;
      zMax = -14;
    } else if (biome === "desert") {
      pentagonPoints = this.pentagonPointsDesert;
      xMin = 39;
      xMax = 211;
      zMin = -148;
      zMax = 160;
    } else if (biome === "espace") {
      pentagonPoints = this.pentagonPointsSpace;
      xMin = -194;
      xMax = 190;
      zMin = 52;
      zMax = 201;
    }

    // Générer des ennemis avec les coordonnées spécifiques au biome
    for (let i = 0; i < 30; i++) {
      let enemyPositionFound = false;
      let x, z;

      while (!enemyPositionFound) {
        // Générer des coordonnées aléatoires dans les bornes du biome actuel
        x = Math.random() * (xMax - xMin) + xMin;
        z = Math.random() * (zMax - zMin) + zMin;

        console.log(pentagonPoints);
        if (this.isInsidePentagon({ x, z }, pentagonPoints)) {
          enemyPositionFound = true;
        }
      }

      // Créer l'ennemi aux coordonnées générées
      const enemy = new EnemyRPG(
        this,
        x,
        251.5,
        z,
        "/5/test3D/examples/monstre 2/_walkdroite_1.png",
        this.player
      );

      this.enemies.push(enemy);
    }

    // Gérer les collisions des nouveaux ennemis avec le joueur
    this.enemies.forEach((enemy) => {
      this.third.physics.add.collider(
        this.player.walkPlane,
        enemy.walkPlane,
        () => {
          this.player.decreaseHealth();
        }
      );
    });

    // Création des animaux
    for (let i = 0; i < 30; i++) {
      let animalPositionFound = false;
      let x, z;

      while (!animalPositionFound) {
        x = Math.random() * (xMax - xMin) + xMin;
        z = Math.random() * (zMax - zMin) + zMin;

        // Vérifier si les coordonnées se trouvent à l'intérieur du pentagone du biome
        if (this.isInsidePentagon({ x, z }, pentagonPoints)) {
          animalPositionFound = true;
        }
      }
      const random = Math.random() < 0.5 ? 1 : 2;

      let image = null;
      if (biome == "espace") {
        if (random == 1) {
          image = "/5/test3D/examples/espace/espace-09.png";
        } else if (random == 2) {
          image = "/5/test3D/examples/espace/espace-10.png";
        }
      } else {
        if (random == 1) {
          image = "/5/test3D/examples/vie/vie-20.png";
        } else if (random == 2) {
          image = "/5/test3D/examples/vie/vie-19.png";
        }
      }

      const animal = new Animal(this, x, 251.8, z, image, this.player);

      this.animaux.push(animal);
      console.log(this.animaux);
    }
  }

  recreatePlayerAt(x, z) {
    if (this.player && this.player.walkPlane) {
      if (this.player.walkPlane.geometry) {
        console.log("Suppression de la géométrie");
        this.player.walkPlane.geometry.dispose(); // Libérer la géométrie
      }
      if (this.player.walkPlane.material) {
        console.log("Suppression du matériau");
        this.player.walkPlane.material.dispose(); // Libérer le matériau
      }

      console.log("Suppression du joueur de la scène");
      this.third.scene.remove(this.player.walkPlane); // Supprimer le mesh de la scène

      // Si le corps physique est présent, le détruire
      if (this.player.walkPlane.body) {
        console.log("Suppression du corps physique");
        this.third.physics.destroy(this.player.walkPlane.body);
      }
    }

    // Recréer un nouvel objet Player aux nouvelles coordonnées
    console.log(`Création du joueur à (${x}, 256, ${z})`);
    this.player = new player(
      this, // La scène actuelle
      x, // Nouvelle position en X
      251.2, // Position en Y (hauteur fixe)
      z, // Nouvelle position en Z
      "/5/test3D/examples/anim_player/idle/_idle_1.png"
    );

    this.resetColliders();

    // Mise à jour de la caméra pour suivre le nouveau joueur
    console.log("Mise à jour de la caméra");
    this.third.camera.position.set(
      this.player.walkPlane.position.x,
      this.player.walkPlane.position.y + 2,
      this.player.walkPlane.position.z + 10
    );
    this.third.camera.lookAt(this.player.walkPlane.position);

    this.pnjs.forEach((pnj) => {
      console.log(pnj);
      pnj.player = this.player; // Mettre à jour la référence du joueur dans chaque PNJ
    });
  }

  resetColliders() {
    this.marchands.forEach((pnj) => {
      this.third.physics.add.collider(
        this.player.walkPlane,
        pnj.marchandMesh,
        () => {
          if (
            this.player.keys.interact &&
            this.player.keys.interact.isDown &&
            !this.isDay
          ) {
            pnj.showItemsForSale();
          }
        }
      );
    });

    this.pnjs.forEach((pnj) => {
      this.third.physics.add.collider(
        this.player.walkPlane, // Le nouveau joueur
        pnj.marchandMesh, // Le PNJ
        () => {
          if (this.player.keys.interact && this.player.keys.interact.isDown) {
            pnj.showBiomeOptions(); // Afficher les options du biome pour ce PNJ
          }
        }
      );
    });

    this.enemies.forEach((enemy) => {
      this.third.physics.add.collider(
        this.player.walkPlane,
        enemy.walkPlane,
        () => {
          this.player.decreaseHealth();
        }
      );
    });

    this.interactiveObjects.marmites.forEach((marmite) => {
      this.marmitteBox(marmite); // Recréer les collisions pour chaque marmite
    });

    this.interactiveObjects.arbres.forEach((arbre) => {
      this.treeInteraction(arbre); // Recréer les collisions pour chaque arbre
    });

    this.interactiveObjects.pyramide.forEach((pyramide) => {
      this.pyramideInteraction(pyramide); // Recréer les collisions pour chaque arbre
    });

    this.interactiveObjects.etoile.forEach((etoile) => {
      this.etoileInteraction(etoile); // Recréer les collisions pour chaque arbre
    });
  }
}
