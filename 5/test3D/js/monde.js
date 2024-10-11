//import camera from "/5/test3D/js/cam.js";
//import DevMode from "/5/test3D/js/dev.js";
import Animal from "/5/test3D/js/animal.js";
import EnemyRPG from "/5/test3D/js/enemy_rpg.js";
import Global from "/5/test3D/js/inventaire.js";
import laser from "/5/test3D/js/laser.js";
import { getBushTexture, getTreeTexture } from "/5/test3D/js/loading.js";
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
      -90,
      256,
      -109,
      "/5/test3D/examples/anim_player/idle/_idle_1.png"
    );

    Global.player = this.player;

    const pentagonPoints = [
      { x: -213, z: -14 },
      { x: -22, z: -22 },
      { x: 97, z: -194 },
      { x: -51, z: -219 },
      { x: -180, z: -144 },
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

    for (let i = 0; i < 30; i++) {
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
    });

    // ANIMAL

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
    }

    this.marchand = new Marchand(this, -80, 252.4, -110);

    this.third.physics.add.collider(
      this.player.walkPlane,
      this.marchand.marchandMesh,
      () => {
        if (this.player.keys.interact && this.player.keys.interact.isDown) {
          this.marchand.showItemsForSale();
        }
      }
    );

    textureLoader.load("/5/test3D/examples/cuisine/marmitte.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(2.5, 2.5);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const tile = new THREE.Mesh(planeGeometry, planeMaterial);
      tile.position.set(-87, 251.9, -113);

      this.third.physics.add.existing(tile, {
        shape: "box",
        width: 1.3, // Utilise la largeur de hitbox fournie
        height: 1, // Hauteur fixe
        depth: 1, // Profondeur fixe
        mass: 0, // Arbre statique
      });

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

    this.third.warpSpeed("fog");
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
    let isDay = true;
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
      isDay = !isDay; // Changer l'état du jour à nuit ou vice versa

      // Gérer la visibilité des étoiles
      stars.forEach((star) => {
        star.visible = isDay; // Afficher les étoiles seulement la nuit
      });

      // Commencer l'animation de fondu dès que la couleur change
      requestAnimationFrame(animateColorTransition);
    };

    const animateColorTransition = (timestamp) => {
      const elapsedTime = timestamp - startTime10;

      // Calculer la progression du fondu
      const progress = Math.min(elapsedTime / fadeDuration, 1);

      // Interpoler les couleurs
      if (isDay) {
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

        fbx.scale.set(0.3, 0.3, 0.3);
        fbx.rotation.y = Math.PI / 1.2;

        const modelCount = 4;
        for (let i = 0; i < modelCount; i++) {
          // Cloner le modèle
          const clonedModel = fbx.clone();

          const offsetX = 114 - 28.5 * i;
          const offsetZ = -198 + 50 * i;
          clonedModel.position.set(offsetX, 262, offsetZ);

          this.third.scene.add(clonedModel);
        }
      },
      undefined,
      function (error) {
        console.error("Erreur lors du chargement du fichier FBX:", error);
      }
    );

    loader.load(
      "/5/test3D/examples/murail.fbx",
      (fbx) => {
        fbx.traverse((child) => {
          if (child.isMesh) {
            // Appliquer la texture au matériau du modèle
            child.material.map = texture;
            child.material.needsUpdate = true;
          }
        });

        // Ajuster l'échelle et la rotation du modèle de base
        fbx.scale.set(0.3, 0.3, 0.3);
        fbx.rotation.y = Math.PI / 2; // Garder la même rotation pour chaque instance

        // Créer plusieurs instances du modèle
        const modelCount = 4; // Par exemple, 5 instances
        for (let i = 0; i < modelCount; i++) {
          // Cloner le modèle
          const clonedModel = fbx.clone();

          // Ajuster la position pour converger vers (0, 262, 0)
          const offsetX = -220 + 55 * i; // Converger de 114 vers 0
          const offsetZ = 0 * i; // Converger de -198 vers 0
          clonedModel.position.set(offsetX, 262, offsetZ);

          // Ajouter le modèle cloné à la scène
          this.third.scene.add(clonedModel);
        }
      },
      undefined,
      function (error) {
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

    const topTexture1 = textureLoader.load(
      "/5/test3D/examples/vie/tuiles/tuile2.png"
    );
    const topTexture2 = textureLoader.load(
      "/5/test3D/examples/éléments desert/sol.png"
    );
    const topTexture3 = textureLoader.load("/5/test3D/examples/eau.png");
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

    const geometries = [];

    geometries.push(
      new THREE.CircleGeometry(250, 3, Math.PI / 3, (2 * Math.PI) / 3)
    ); // Ajuste selon la taille
    geometries.push(
      new THREE.CircleGeometry(250, 3, -Math.PI / 3, (2 * Math.PI) / 3)
    ); // Ajuste selon la taille
    geometries.push(
      new THREE.CircleGeometry(250, 3, Math.PI, (2 * Math.PI) / 3)
    ); // Ajuste selon la taille

    for (let i = 0; i < geometries.length; i++) {
      const topMesh = new THREE.Mesh(geometries[i], topMaterials[i]);
      topMesh.rotation.x = -Math.PI / 2; // Mettre à plat le plan
      topMesh.position.set(0, 251, 0); // Ajuste la position pour correspondre au cube
      this.third.scene.add(topMesh);
    }

    // Créer des matériaux distincts pour les côtés uniquement
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
      this.third.scene.add(tile);
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
    if (this.player.keys.attack.isDown && this.player.isOnGround()) {
      this.attackPlayer();
    }
  }

  handleInteraction = () => {
    this.scene.pause("monde");

    this.scene.launch("tpt", { previousScene: "monde" });
  };
  getRandomTree() {
    const randomIndex = Math.floor(Math.random() * this.trees.length);
    return this.trees[randomIndex];
  }
}
