import camera from "/5/test3D/js/cam.js";
import DevMode from "/5/test3D/js/dev.js";
import Insect from "/5/test3D/js/insect.js";
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
  }

  init() {
    this.accessThirdDimension();
  }
  async create() {
    const textureLoader = new THREE.TextureLoader();
    this.freeCamera = new camera(this);
    this.pointerLaser = new laser(this);
    /*
    this.player = new player(
      this,
      -90,
      256,
      -109,
      "/5/test3D/examples/anim_player/idle/_idle_1.png"
    );

    Global.player = this.player;
*/
    const pentagonPoints = [
      { x: -200, z: -10 },
      { x: -15, z: -15 },
      { x: 90, z: -188 },
      { x: -45, z: -215 },
      { x: -170, z: -124 },
    ];

    const isInsidePentagon = (point, polygon) => {
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

    /* for (let i = 0; i < 30; i++) {
      let enemyPositionFound = false;
      let x, z;

      while (!enemyPositionFound) {
        x = Math.random() * (97 - -213) + -213;
        z = Math.random() * (-14 - -194) + -194;

        if (isInsidePentagon({ x, z }, pentagonPoints)) {
          enemyPositionFound = true;
        }
      }

      const enemy = new EnemyRPG(
        this,
        x,
        254.2,
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
    });*/

    // ANIMAL
    /*
    for (let i = 0; i < 30; i++) {
      let animalPositionFound = false;
      let x, z;

      while (!animalPositionFound) {
        x = Math.random() * (97 - -213) + -213;
        z = Math.random() * (-14 - -194) + -194;

        if (isInsidePentagon({ x, z }, pentagonPoints)) {
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

      const animal = new Animal(this, x, 254.2, z, image, this.player);

      this.animaux.push(animal);
    }*/

    this.marchand = new Marchand(this, -80, 252.4, -110);
    /*
    this.third.physics.add.collider(
      this.player.walkPlane,
      this.marchand.marchandMesh,
      () => {
        if (
          this.player.keys.interact &&
          this.player.keys.interact.isDown &&
          !this.isDay
        ) {
          this.marchand.showItemsForSale();
        }
      }
    );*/
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
      tile.position.set(-87, 251.5, -113);

      this.third.physics.add.existing(tile, {
        shape: "box",
        width: 1.3, // Utilise la largeur de hitbox fournie
        height: 1, // Hauteur fixe
        depth: 1, // Profondeur fixe
        mass: 0,
      });

      this.third.scene.add(tile);

      //this.marmitteBox(tile);
    });
    /*
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
*/
    this.third.warpSpeed("light", "fog");

    //this.third.physics.debug.enable();

    this.devMode = new DevMode(this, this.freeCamera.camera, textureLoader);

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
      nature: this.sound.add("nature_music", { loop: true, volume: 0.5 }), // Volume à 50%
      desert: this.sound.add("desert_music", { loop: true, volume: 0.7 }), // Volume à 70%
      space: this.sound.add("space_music", { loop: true, volume: 0.1 }), // Volume à 40%
    };

    // Jouer la première musique (par exemple Nature)
    this.currentMusic = "nature";
    this.biomeMusic.desert.play();

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
    this.devMode.setTargetCube(cube);

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
      this.third.scene.add(tile);

      this.hitbox(tile);
    });

    this.hitbox = (grandArbreBody) => {
      this.third.physics.add.collider(
        this.player.walkPlane,
        grandArbreBody,
        () => {
          if (this.player.keys.interact && this.player.keys.interact.isDown) {
            this.handleInteraction();
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

    //this.updateVisibility();

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
        this.third.scene.add(tile);
      }
    );

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
      this.third.scene.add(tile);
    });

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

    //////////////////////////////////////arbrebivdb

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -164.56775697861104,
        255.89999999999975,
        77.38088547696805
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -154.8225853775524,
        255.89999999999975,
        79.28345965192673
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -171.53537761363066,
        255.89999999999975,
        90.75486721807016
      );
      if (0.7853981633974483 != undefined) {
        tile.rotation.y = 0.7853981633974483;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -163.3435900579749,
        255.79999999999976,
        88.9723072692323
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -169.91540776719273,
        255.69999999999973,
        75.68029681216207
      );
      if (0.7853981633974483 != undefined) {
        tile.rotation.y = 0.7853981633974483;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -154.42500146318181,
        255.79999999999976,
        84.16944444394274
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -169.90868531704115,
        255.79999999999976,
        83.58414884146939
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -162.15110903195088,
        255.79999999999976,
        73.06660385074113
      );
      if (5.497787143782139 != undefined) {
        tile.rotation.y = 5.497787143782139;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -159.3747207969594,
        255.7999999999997,
        86.06092904836518
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -172.7554673843455,
        255.79999999999976,
        80.03664837889534
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -168.07621920934562,
        255.89999999999975,
        89.57523803467254
      );
      if (0.7853981633974483 != undefined) {
        tile.rotation.y = 0.7853981633974483;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -158.9752489103734,
        255.79999999999976,
        73.53622496968536
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -156.15891251575368,
        255.79999999999976,
        91.06778707106982
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-07.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -176.42033443442477,
        255.69999999999973,
        76.31888386640628
      );
      if (0.7853981633974483 != undefined) {
        tile.rotation.y = 0.7853981633974483;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -99.69190871833487,
        255.79999999999976,
        48.836446076269176
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -89.307144276395,
        255.69999999999976,
        40.362975535694396
      );
      if (12.173671532660457 != undefined) {
        tile.rotation.y = 12.173671532660457;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -83.40595926477383,
        255.7999999999998,
        55.012116809007985
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -74.58356760949128,
        255.79999999999976,
        47.22622872261828
      );
      if (0.7853981633974483 != undefined) {
        tile.rotation.y = 0.7853981633974483;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -71.94702873550578,
        255.79999999999976,
        60.925014662800564
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -91.75920345831418,
        255.49999999999966,
        57.62487003274941
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -81.45694798285031,
        255.89999999999975,
        45.18851087660874
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -98.14480845214895,
        255.7999999999997,
        39.03901736474341
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (6.283185307179588 != undefined) {
        tile.rotation.x = 6.283185307179588;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -80.42805749741072,
        255.59999999999977,
        61.141330593869796
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -99.43835640477346,
        255.8999999999998,
        58.475586062005746
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -89.74664913453682,
        255.69999999999976,
        49.624170085775255
      );
      if (12.173671532660457 != undefined) {
        tile.rotation.y = 12.173671532660457;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -76.3837507675467,
        255.7999999999998,
        37.607368720542866
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -106.10089112636324,
        254.89999999999978,
        46.45637869322168
      );
      if (18.45685683984004 != undefined) {
        tile.rotation.y = 18.45685683984004;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-07.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -75.02085109355461,
        255.79999999999976,
        55.36247020566296
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-07.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -94.92119450490877,
        255.49999999999966,
        46.94549907688452
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -105.54486367329963,
        255.79999999999976,
        92.48331849585854
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -118.00372351974728,
        255.8999999999998,
        83.60328183787533
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -106.78564612640226,
        255.69999999999976,
        77.6379541770741
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(0, 0, 0);
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -96.2480650610606,
        255.89999999999986,
        83.23831276827858
      );
      if (6.283185307179588 != undefined) {
        tile.rotation.y = 6.283185307179588;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -97.17548548858655,
        255.69999999999976,
        89.57697025149218
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -91.7998787628205,
        255.79999999999987,
        97.02398921010584
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -111.26552068451072,
        255.79999999999987,
        85.12272014054562
      );
      if (12.173671532660457 != undefined) {
        tile.rotation.y = 12.173671532660457;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -100.86773242159221,
        255.79999999999993,
        77.36411898317719
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -119.10524330729156,
        255.79999999999987,
        87.31234568832616
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -102.81640545662846,
        255.59999999999982,
        85.62941642889348
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -88.10974547027224,
        255.8999999999998,
        85.92079265289634
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -92.27789051858251,
        255.89999999999978,
        88.38207868626948
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -113.42680116997478,
        255.7999999999998,
        76.892986983133
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -123.24516538052738,
        255.8999999999998,
        81.43586645439484
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-07.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -189.74856074817265,
        255.59999999999977,
        90.91915999575792
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-07.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -182.60845497046273,
        255.39999999999978,
        73.93092774383179
      );
      if (5.497787143782139 != undefined) {
        tile.rotation.y = 5.497787143782139;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -191.29730555872598,
        255.59999999999977,
        81.33390977595278
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -178.7246994408749,
        255.79999999999973,
        94.2102365137088
      );
      if (12.173671532660457 != undefined) {
        tile.rotation.y = 12.173671532660457;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -183.70001770877843,
        255.79999999999987,
        86.98786355716818
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -174.00640675601602,
        255.9999999999998,
        65.58107996231581
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -177.50618104589282,
        255.69999999999982,
        83.64373571767122
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -146.0170944834516,
        255.69999999999982,
        135.7350930407807
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -134.33002408388447,
        255.79999999999976,
        126.3721970860249
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -129.68325767122278,
        255.7999999999998,
        140.3631450845704
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -118.34746815390302,
        255.89999999999984,
        129.30285420583738
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -143.3200219897383,
        255.5999999999999,
        152.62903406789573
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -166.19629299139515,
        255.7999999999998,
        127.56331139762105
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -165.07104173633252,
        255.69999999999987,
        149.08596063009068
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -158.44704126974847,
        255.89999999999966,
        142.1200796471678
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -178.53229546872075,
        255.7999999999998,
        134.23622933636173
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -134.7850717461722,
        255.69999999999987,
        145.4517840104994
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -155.70541852142597,
        256.09999999999974,
        153.53060534240913
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -155.8062373803848,
        255.79999999999993,
        130.20099990072734
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -141.44187969656252,
        255.89999999999964,
        144.51966639074635
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -120.0614989033158,
        255.79999999999984,
        146.99560495759135
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -168.562207084787,
        255.59999999999982,
        137.67908973840593
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -146.98836330560982,
        255.79999999999976,
        163.9498717945504
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-07.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -136.95391809573954,
        255.49999999999983,
        134.58213618809867
      );
      if (6.283185307179588 != undefined) {
        tile.rotation.y = 6.283185307179588;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-07.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -163.61063056772366,
        255.59999999999982,
        159.52751480713818
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -77.85318447881727,
        255.7999999999998,
        173.93598504841066
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -60.72104081181277,
        255.6999999999999,
        160.81023560153497
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -60.022610919290265,
        255.99999999999991,
        185.62565338019328
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -41.204316744890654,
        255.7999999999998,
        172.4252247567049
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -39.3578716283938,
        255.79999999999987,
        189.71555864589794
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -29.003771602081365,
        255.79999999999976,
        157.93838400636827
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -22.437516163381012,
        255.8999999999998,
        178.48806331381394
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -10.217169691666992,
        255.7999999999998,
        166.89291507013627
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -38.923111288437426,
        255.8999999999998,
        115.39692712037026
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -51.24063442925964,
        255.8999999999998,
        97.09024114322864
      );
      if (6.283185307179588 != undefined) {
        tile.rotation.y = 6.283185307179588;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -35.25848079238219,
        255.79999999999984,
        87.60881815032934
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        13.24246195932724,
        255.89999999999984,
        107.41381264699025
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        6.958028171679612,
        255.69999999999976,
        90.60287386489257
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        24.084953087713146,
        255.69999999999987,
        99.94245710618878
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        3.3396277404910943,
        255.99999999999986,
        147.63731707248405
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        24.05653161351347,
        255.89999999999986,
        156.89096024132027
      );
      if (5.497787143782139 != undefined) {
        tile.rotation.y = 5.497787143782139;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        12.351377427666264,
        255.79999999999995,
        176.4528816870268
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        33.57166922303684,
        255.69999999999982,
        184.40524655742263
      );
      if (6.675884388878313 != undefined) {
        tile.rotation.y = 6.675884388878313;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -89.08053538276258,
        255.8999999999998,
        165.3708309701713
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -75.81735564568427,
        255.69999999999973,
        188.95181809740274
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -53.491424709792966,
        255.69999999999987,
        172.91799341773117
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -50.267347888833335,
        255.69999999999976,
        201.940470926543
      );
      if (0.7853981633974483 != undefined) {
        tile.rotation.y = 0.7853981633974483;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -26.782769858666928,
        255.79999999999984,
        193.1158907672678
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(-4.413064074213311, 255.6, 176.97415432587073);
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -18.507660679599873,
        255.79999999999993,
        155.44476860149683
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -41.44949209266648,
        255.99999999999991,
        97.14067070576628
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -49.19169899956157,
        255.69999999999985,
        111.04221040790299
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        15.957290835624862,
        255.8999999999998,
        96.41658124646494
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        28.0271548032544,
        255.8999999999998,
        115.27420666617371
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        14.948838658120263,
        255.69999999999993,
        147.25573138909593
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(1.8919483357373714, 255.7, 167.4224205236143);
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        10.172381420100196,
        255.79999999999987,
        200.38707631943507
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(-94.31267410573962, 255.7, 175.85095005063687);
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -85.96836678419736,
        255.79999999999976,
        184.25283737134464
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -75.07903123681506,
        255.79999999999976,
        161.13848287687603
      );
      if (5.497787143782139 != undefined) {
        tile.rotation.y = 5.497787143782139;
      }
      if (12.566370614359181 != undefined) {
        tile.rotation.x = 12.566370614359181;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -48.36712284380879,
        255.59999999999985,
        183.65960767688122
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -13.237824832234708,
        255.79999999999993,
        199.59037077561186
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        19.83818591857153,
        255.5999999999999,
        169.00379543743605
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        33.47377718210681,
        255.9999999999997,
        139.0281746215615
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -32.03344478614743,
        255.59999999999988,
        171.26979144798088
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -66.03259403963874,
        255.79999999999987,
        172.4215688754949
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        10.069296335228554,
        255.89999999999975,
        160.77818249104962
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(36.47691503304241, 255.9, 163.5133333974182);
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -0.3050893548860909,
        255.99999999999983,
        193.42278959426713
      );
      if (0.7853981633974483 != undefined) {
        tile.rotation.y = 0.7853981633974483;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        20.62621827884487,
        255.7999999999998,
        111.24578092353406
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-07.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -44.44509810057775,
        255.39999999999978,
        105.7802357895949
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-07.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -11.889329668572973,
        255.59999999999982,
        143.19196524106616
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-07.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(18.4559701896961, 255.7999999999999, 188.3029081953364);
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-07.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -13.819831655765007,
        255.89999999999978,
        183.00199805557565
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-07.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -45.78897599330673,
        255.7999999999998,
        192.63268005250862
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-07.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -70.11723756194324,
        255.7999999999998,
        180.0986644308947
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-07.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -98.3863099141008,
        255.8999999999998,
        157.50263589893424
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -63.172744903101915,
        255.59999999999965,
        44.79140835240351
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -65.59947530927423,
        255.99999999999974,
        54.94914808180892
      );
      if (5.497787143782139 != undefined) {
        tile.rotation.y = 5.497787143782139;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -66.61921083208831,
        256.0999999999998,
        70.65955041917253
      );
      if (0.7853981633974483 != undefined) {
        tile.rotation.y = 0.7853981633974483;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -74.86186425169072,
        255.59999999999982,
        82.56175612747953
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -62.12774906789507,
        255.9999999999998,
        88.17833153593504
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -50.82197495024873,
        255.69999999999982,
        65.14919987633154
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -46.75264986848478,
        255.7999999999998,
        80.90943367191392
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -32.15671578957259,
        255.79999999999978,
        60.9036544178612
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -13.629249039377072,
        255.59999999999982,
        85.35635814448268
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -28.52455019666602,
        255.7999999999998,
        69.80108951848243
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -44.71931022736926,
        255.89999999999992,
        48.697886236389444
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -57.466403908839155,
        255.69999999999982,
        74.64090655070613
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -41.023463704551645,
        255.79999999999976,
        60.488285261870324
      );
      if (0.7853981633974483 != undefined) {
        tile.rotation.y = 0.7853981633974483;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -18.002326748134003,
        255.59999999999977,
        48.26920325233567
      );
      if (5.497787143782139 != undefined) {
        tile.rotation.y = 5.497787143782139;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -3.048258615853332,
        255.69999999999976,
        76.5163149841664
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -74.84944983642038,
        255.59999999999977,
        92.43350608230526
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -61.782758646449466,
        255.69999999999976,
        105.60501679025481
      );
      if (0.7853981633974483 != undefined) {
        tile.rotation.y = 0.7853981633974483;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -82.81298571414416,
        256.0999999999998,
        77.71386256424157
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -39.851089966034905,
        256.09999999999974,
        75.87390483701346
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -18.917259909378764,
        255.99999999999974,
        68.54799855198732
      );
      if (5.497787143782139 != undefined) {
        tile.rotation.y = 5.497787143782139;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -53.41340465569529,
        255.8999999999998,
        127.60277744861972
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-07.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -57.45028964031795,
        255.49999999999977,
        58.16700865848772
      );
      if (0 != undefined) {
        tile.rotation.y = 0;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-07.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -68.93910843033103,
        255.59999999999977,
        102.21689783441585
      );
      if (5.890486225480863 != undefined) {
        tile.rotation.y = 5.890486225480863;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-07.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(
        -26.933431538474323,
        255.59999999999977,
        90.00289765266636
      );
      if (0.39269908169872414 != undefined) {
        tile.rotation.y = 0.39269908169872414;
      }
      if (0 != undefined) {
        tile.rotation.x = 0;
      }
      this.third.physics.add.existing(tile, { mass: 0 });
      this.third.scene.add(tile);
    });
  }

  createLoupeMaterial(object) {
    const originalMaterial = object.material.clone();
    this.shaderMaterials.set(object, originalMaterial);

    const uniforms = {
      playerPosition: { value: this.player.walkPlane.position },
      loupeRadius: { value: 18.0 }, // Rayon de la zone transparente
      texturee: { value: object.material.map }, // Utiliser la texture de l'objet
      opacityFactor: { value: 0.3 }, // Facteur d'opacité pour la zone en dehors de la loupe
    };

    const loupeMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: `
            varying vec3 vWorldPosition;
            varying vec2 vUv;
            void main() {
                vUv = uv; // Passe les coordonnées UV au fragment shader
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * viewMatrix * worldPosition;
            }
        `,
      fragmentShader: `
            uniform vec3 playerPosition;
            uniform float loupeRadius;
            uniform sampler2D texturee;
            uniform float opacityFactor;
            varying vec3 vWorldPosition;
            varying vec2 vUv;

            void main() {
                float distance = length(vWorldPosition - playerPosition);
                vec4 texColor = texture2D(texturee, vUv);

                // Si le pixel est transparent, on le garde transparent
                if (texColor.a < 0.1) {
                    discard; // Ne dessine pas les pixels transparents de la texture
                }

                // Si le joueur est derrière l'objet et à l'intérieur de la loupe, appliquer la transparence
                if (distance < loupeRadius) {
                    gl_FragColor = vec4(texColor.rgb, texColor.a * 0.1); // Appliquer une transparence légère dans la zone de la loupe
                } else {
                    gl_FragColor = texColor; // Garder la texture intacte en dehors de la loupe
                }
            }
        `,
      transparent: true,
    });

    object.material = loupeMaterial;
  }

  /*updateVisibility() {
    const cameraPosition = this.third.camera.position;
    const playerPosition = this.player.walkPlane.position;

    // Créer un raycaster pour détecter les objets entre la caméra et le joueur
    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3()
      .subVectors(playerPosition, cameraPosition)
      .normalize();
    raycaster.set(cameraPosition, direction);

    // Vérifier les intersections avec les objets de `this.blockingObjects`
    const intersects = raycaster.intersectObjects(this.blockingObjects, true);

    // Réinitialiser les matériaux des objets précédemment détectés
    this.blockingObjects.forEach((object) => {
      if (this.shaderMaterials.has(object)) {
        object.material = this.shaderMaterials.get(object);
      }
    });

    // Si un objet est détecté entre la caméra et le joueur, appliquer le shader
    if (intersects.length > 0) {
      const firstObstacle = intersects[0].object;
      this.createLoupeMaterial(firstObstacle);
    }
  }*/

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
    this.freeCamera.update();
    this.pointerLaser.update();
    /*
    this.animaux.forEach((animal) => {
      animal.update(this.player);
    });
    this.enemies.forEach((enemy) => {
      enemy.update(this.player);
    });

    this.player.update(this);
    if (this.player.keys.attack.isDown && this.player.isOnGround()) {
      this.attackPlayer();
    }
*/
    this.insects.forEach((insect) => insect.update());
    //this.updateVisibility();
    /*
    const playerX = this.player.walkPlane.position.x;
    const playerZ = this.player.walkPlane.position.z;

    const centerX = 0; // Coordonnées du centre du cercle
    const centerZ = 0;

    let newBiome = null;

    // Définir les zones pour chaque biome
    if (playerX > centerX && playerZ > centerZ) {
      // Secteur Nature
      newBiome = "nature";
    } else if (playerX < centerX && playerZ > centerZ) {
      // Secteur Désert
      newBiome = "desert";
    } else {
      // Secteur Espace
      newBiome = "space";
    }

    // Si le biome a changé, changer la musique
    if (newBiome !== this.currentMusic) {
      this.changeBiomeMusic(newBiome);
    }*/
  }

  // Méthode pour rendre les objets transparents si entre la caméra et le joueur

  handleInteraction = () => {
    this.scene.pause("monde");

    this.scene.launch("Plateformer_map1", { previousScene: "monde" });
    this.player.scene.sound.stopByKey("walk_grass");
    this.biomeMusic[this.currentMusic].pause();
  };

  getRandomTree() {
    const randomIndex = Math.floor(Math.random() * this.trees.length);
    return this.trees[randomIndex];
  }

  // Fonction pour changer la musique
  changeBiomeMusic(newBiome) {
    // Arrêter la musique actuelle
    if (this.currentMusic) {
      this.biomeMusic[this.currentMusic].stop();
    }

    // Jouer la nouvelle musique
    this.biomeMusic[newBiome].play();

    // Mettre à jour le biome actuel
    this.currentMusic = newBiome;
  }
}
