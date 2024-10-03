import camera from "/5/test3D/js/cam.js";
import laser from "/5/test3D/js/laser.js";
//import player from "/5/test3D/js/player.js";
import { FBXLoader } from "/5/test3D/lib/FBXLoader.js";

export default class monde extends Scene3D {
  constructor() {
    super({ key: "monde" });
  }

  init() {
    this.accessThirdDimension();
  }

  create() {
    // Initialiser la caméra libre
    this.freeCamera = new camera(this);

    this.pointerLaser = new laser(this);
    /*
    this.player = new player(
      this,
      0,
      256,
      0,
      "/5/test3D/examples/anim_player/idle/_idle_1.png"
    );*/

    this.third.warpSpeed("light", "fog");
    // this.third.physics.debug.enable();

    const textureLoader = new THREE.TextureLoader();

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

    // Fonction pour changer la couleur de la sphère avec fondu
    const changeSkyColor = () => {
      startTime = performance.now(); // Obtenir l'heure de départ
      isDay = !isDay; // Changer l'état du jour à nuit ou vice versa

      // Gérer la visibilité des étoiles
      stars.forEach((star) => {
        star.visible = isDay; // Afficher les étoiles seulement la nuit
      });
    };

    const animateColorTransition = (timestamp) => {
      const elapsedTime = timestamp - startTime;

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

    setInterval(() => {
      changeSkyColor(); // Démarrer le changement de couleur
      requestAnimationFrame(animateColorTransition); // Commencer l'animation de fondu
    }, 1 * 5 * 1000); // 2 minutes

    this.third.camera.near = 0.1; // Distance minimale de rendu (par défaut c'est souvent 0.1)
    this.third.camera.far = 500000; // Augmente la distance maximale de rendu à 2000
    this.third.camera.updateProjectionMatrix(); // Applique les changements

    /**************************** */
    const texture = textureLoader.load("/5/test3D/examples/murail.png");
    const loader = new FBXLoader();

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
        fbx.rotation.y = Math.PI / 1.2; // Garder la même rotation pour chaque instance

        // Créer plusieurs instances du modèle
        const modelCount = 4; // Par exemple, 5 instances
        for (let i = 0; i < modelCount; i++) {
          // Cloner le modèle
          const clonedModel = fbx.clone();

          // Ajuster la position pour converger vers (0, 262, 0)
          const offsetX = 114 - 28.5 * i; // Converger de 114 vers 0
          const offsetZ = -198 + 50 * i; // Converger de -198 vers 0
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
      new THREE.MeshBasicMaterial({ map: topTexture1 }),
      new THREE.MeshBasicMaterial({ map: topTexture2 }),
      new THREE.MeshBasicMaterial({ map: topTexture3 }),
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
      new THREE.MeshBasicMaterial({ map: sideTexture }), // Face 1 (côté)
      new THREE.MeshBasicMaterial({ map: sideTexture }), // Face 2 (côté)
      new THREE.MeshBasicMaterial({ visible: false }), // Face supérieure (on la remplace par les biomes)
      new THREE.MeshBasicMaterial({ map: sideTexture }), // Face 4 (côté)
      new THREE.MeshBasicMaterial({ map: sideTexture }), // Face inférieure
      new THREE.MeshBasicMaterial({ map: sideTexture }), // Face 6 (côté)
    ];
    const cubeGeometry = new THREE.BoxGeometry(4000, 500, 4000);
    const cube = new THREE.Mesh(cubeGeometry, sideMaterials);

    // Ajouter le cube (côtés) à la scène
    cube.position.set(0, 1, 0);
    this.third.scene.add(cube);
    this.pointerLaser.addObject(cube);

    // Ajouter la physique au cube (collision)
    this.third.physics.add.existing(cube, { mass: 0 });

    const waterTexture = textureLoader.load("/5/test3D/examples/eau.png");

    const waterMaterial = new THREE.MeshBasicMaterial({
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

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      // Définir les coordonnées des coins
      const topRight = { x: 109, z: -217 };
      const topLeft = { x: -43, z: -245 };
      const bottomLeft = { x: -48, z: -216 };
      const bottomRight = { x: 99, z: -194 };

      // Nombre d'arbres à générer
      const treeCount = 150; // Ajuste ce nombre selon tes besoins

      for (let i = 0; i < treeCount; i++) {
        // Générer une position aléatoire entre les deux côtés (haut-bas)
        const t1 = Math.random(); // Interpolation pour la position sur le côté gauche
        const leftX = topLeft.x + t1 * (bottomLeft.x - topLeft.x);
        const leftZ = topLeft.z + t1 * (bottomLeft.z - topLeft.z);

        const t2 = Math.random(); // Interpolation pour la position sur le côté droit
        const rightX = topRight.x + t1 * (bottomRight.x - topRight.x);
        const rightZ = topRight.z + t1 * (bottomRight.z - topRight.z);

        // Générer la position finale en interpolant entre les deux côtés
        const finalT = Math.random();
        const finalX = leftX + finalT * (rightX - leftX);
        const finalZ = leftZ + finalT * (rightZ - leftZ);

        // Créer chaque arbre
        const tree = new THREE.Mesh(planeGeometry, planeMaterial);

        // Placer l'arbre à la position générée
        tree.position.set(finalX, 256, finalZ);
        tree.rotation.y = Math.random() * Math.PI * 2; // Rotation aléatoire pour chaque arbre

        // Ajouter l'arbre à la scène
        this.third.scene.add(tree);
      }
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      // Définir les coordonnées des nouveaux coins
      const topRight = { x: -43, z: -245 };
      const bottomRight = { x: -48, z: -216 };
      const topLeft = { x: -189, z: -159 };
      const bottomLeft = { x: -177, z: -144 };

      // Nombre total d'arbres à générer dans cette nouvelle zone
      const treeCount = 150; // Ajuste ce nombre selon tes besoins

      for (let i = 0; i < treeCount; i++) {
        // Générer une position aléatoire entre les deux côtés (haut-bas)
        const t1 = Math.random(); // Interpolation pour la position sur le côté gauche
        const leftX = topLeft.x + t1 * (bottomLeft.x - topLeft.x);
        const leftZ = topLeft.z + t1 * (bottomLeft.z - topLeft.z);

        const t2 = Math.random(); // Interpolation pour la position sur le côté droit
        const rightX = topRight.x + t1 * (bottomRight.x - topRight.x);
        const rightZ = topRight.z + t1 * (bottomRight.z - topRight.z);

        // Générer la position finale en interpolant entre les deux côtés
        const finalT = Math.random();
        const finalX = leftX + finalT * (rightX - leftX);
        const finalZ = leftZ + finalT * (rightZ - leftZ);

        // Créer chaque arbre
        const tree = new THREE.Mesh(planeGeometry, planeMaterial);

        // Placer l'arbre à la position générée
        tree.position.set(finalX, 256, finalZ);
        tree.rotation.y = Math.random() * Math.PI * 2; // Rotation aléatoire pour chaque arbre

        // Ajouter l'arbre à la scène
        this.third.scene.add(tree);
      }
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      // Définir les coordonnées des nouveaux coins
      const topRight = { x: -189, z: -159 };
      const bottomRight = { x: -177, z: -144 };
      const topLeft = { x: -241, z: -16 };
      const bottomLeft = { x: -213, z: -14 };

      // Nombre total d'arbres à générer dans cette nouvelle zone
      const treeCount = 150; // Ajuste ce nombre selon tes besoins

      for (let i = 0; i < treeCount; i++) {
        // Générer une position aléatoire entre les deux côtés (haut-bas)
        const t1 = Math.random(); // Interpolation pour la position sur le côté gauche
        const leftX = topLeft.x + t1 * (bottomLeft.x - topLeft.x);
        const leftZ = topLeft.z + t1 * (bottomLeft.z - topLeft.z);

        const t2 = Math.random(); // Interpolation pour la position sur le côté droit
        const rightX = topRight.x + t1 * (bottomRight.x - topRight.x);
        const rightZ = topRight.z + t1 * (bottomRight.z - topRight.z);

        // Générer la position finale en interpolant entre les deux côtés
        const finalT = Math.random();
        const finalX = leftX + finalT * (rightX - leftX);
        const finalZ = leftZ + finalT * (rightZ - leftZ);

        // Créer chaque arbre
        const tree = new THREE.Mesh(planeGeometry, planeMaterial);

        // Placer l'arbre à la position générée
        tree.position.set(finalX, 256, finalZ);
        tree.rotation.y = Math.random() * Math.PI * 2; // Rotation aléatoire pour chaque arbre

        // Ajouter l'arbre à la scène
        this.third.scene.add(tree);
      }
    });

    textureLoader.load("/5/test3D/examples/vie/vie-03.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      // Définir les 5 coins du pentagone
      const points = [
        { x: -213, z: -14 },
        { x: -22, z: -22 },
        { x: 97, z: -194 },
        { x: -51, z: -219 },
        { x: -180, z: -144 },
      ];

      // Calculer le centre du pentagone
      const calculatePolygonCenter = (points) => {
        const totalPoints = points.length;
        const sumX = points.reduce((sum, point) => sum + point.x, 0);
        const sumZ = points.reduce((sum, point) => sum + point.z, 0);
        return {
          x: sumX / totalPoints,
          z: sumZ / totalPoints,
        };
      };

      const villageCenter = calculatePolygonCenter(points); // Centre du pentagone
      const villageRadius = 50; // Rayon autour du centre où aucun arbre ne doit être placé

      // Fonction pour vérifier si un point est à l'intérieur du polygone
      const isInsidePolygon = (point, polygon) => {
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

      // Fonction pour vérifier si un point est à l'intérieur du rayon du village
      const isOutsideVillageRadius = (point, villageCenter, villageRadius) => {
        const distanceSquared =
          (point.x - villageCenter.x) ** 2 + (point.z - villageCenter.z) ** 2;
        return distanceSquared > villageRadius ** 2; // Vérifie si le point est en dehors du rayon du village
      };

      // Nombre d'arbres à générer dans cette zone
      const treeCount = 150; // Ajuste ce nombre selon tes besoins

      for (let i = 0; i < treeCount; i++) {
        let treePlaced = false;

        // Générer des arbres jusqu'à ce qu'un point valide à l'intérieur du polygone et à l'extérieur du village soit trouvé
        while (!treePlaced) {
          // Générer une position aléatoire dans les limites globales du polygone
          const minX = Math.min(...points.map((p) => p.x));
          const maxX = Math.max(...points.map((p) => p.x));
          const minZ = Math.min(...points.map((p) => p.z));
          const maxZ = Math.max(...points.map((p) => p.z));

          const randomX = minX + Math.random() * (maxX - minX);
          const randomZ = minZ + Math.random() * (maxZ - minZ);

          const randomPoint = { x: randomX, z: randomZ };

          // Vérifier si le point aléatoire est dans le polygone et en dehors du village
          if (
            isInsidePolygon(randomPoint, points) &&
            isOutsideVillageRadius(randomPoint, villageCenter, villageRadius)
          ) {
            // Créer chaque arbre
            const tree = new THREE.Mesh(planeGeometry, planeMaterial);

            // Placer l'arbre à la position générée
            tree.position.set(randomPoint.x, 256, randomPoint.z);
            tree.rotation.y = Math.random() * Math.PI * 2; // Rotation aléatoire pour chaque arbre

            // Ajouter l'arbre à la scène
            this.third.scene.add(tree);
            treePlaced = true;
          }
        }
      }
    });

    textureLoader.load("/5/test3D/examples/vie/vie-07.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      // Définir les coordonnées des coins
      const topRight = { x: 109, z: -217 };
      const topLeft = { x: -43, z: -245 };
      const bottomLeft = { x: -48, z: -216 };
      const bottomRight = { x: 99, z: -194 };

      // Nombre d'arbres à générer
      const treeCount = 150; // Ajuste ce nombre selon tes besoins

      for (let i = 0; i < treeCount; i++) {
        // Générer une position aléatoire entre les deux côtés (haut-bas)
        const t1 = Math.random(); // Interpolation pour la position sur le côté gauche
        const leftX = topLeft.x + t1 * (bottomLeft.x - topLeft.x);
        const leftZ = topLeft.z + t1 * (bottomLeft.z - topLeft.z);

        const t2 = Math.random(); // Interpolation pour la position sur le côté droit
        const rightX = topRight.x + t1 * (bottomRight.x - topRight.x);
        const rightZ = topRight.z + t1 * (bottomRight.z - topRight.z);

        // Générer la position finale en interpolant entre les deux côtés
        const finalT = Math.random();
        const finalX = leftX + finalT * (rightX - leftX);
        const finalZ = leftZ + finalT * (rightZ - leftZ);

        // Créer chaque arbre
        const tree = new THREE.Mesh(planeGeometry, planeMaterial);

        // Placer l'arbre à la position générée
        tree.position.set(finalX, 256, finalZ);
        tree.rotation.y = Math.random() * Math.PI * 2; // Rotation aléatoire pour chaque arbre

        // Ajouter l'arbre à la scène
        this.third.scene.add(tree);
      }
    });

    textureLoader.load("/5/test3D/examples/vie/vie-06.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      // Définir les coordonnées des nouveaux coins
      const topRight = { x: -43, z: -245 };
      const bottomRight = { x: -48, z: -216 };
      const topLeft = { x: -189, z: -159 };
      const bottomLeft = { x: -177, z: -144 };

      // Nombre total d'arbres à générer dans cette nouvelle zone
      const treeCount = 150; // Ajuste ce nombre selon tes besoins

      for (let i = 0; i < treeCount; i++) {
        // Générer une position aléatoire entre les deux côtés (haut-bas)
        const t1 = Math.random(); // Interpolation pour la position sur le côté gauche
        const leftX = topLeft.x + t1 * (bottomLeft.x - topLeft.x);
        const leftZ = topLeft.z + t1 * (bottomLeft.z - topLeft.z);

        const t2 = Math.random(); // Interpolation pour la position sur le côté droit
        const rightX = topRight.x + t1 * (bottomRight.x - topRight.x);
        const rightZ = topRight.z + t1 * (bottomRight.z - topRight.z);

        // Générer la position finale en interpolant entre les deux côtés
        const finalT = Math.random();
        const finalX = leftX + finalT * (rightX - leftX);
        const finalZ = leftZ + finalT * (rightZ - leftZ);

        // Créer chaque arbre
        const tree = new THREE.Mesh(planeGeometry, planeMaterial);

        // Placer l'arbre à la position générée
        tree.position.set(finalX, 256, finalZ);
        tree.rotation.y = Math.random() * Math.PI * 2; // Rotation aléatoire pour chaque arbre

        // Ajouter l'arbre à la scène
        this.third.scene.add(tree);
      }
    });

    textureLoader.load("/5/test3D/examples/vie/vie-05.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      // Définir les coordonnées des nouveaux coins
      const topRight = { x: -189, z: -159 };
      const bottomRight = { x: -177, z: -144 };
      const topLeft = { x: -241, z: -16 };
      const bottomLeft = { x: -213, z: -14 };

      // Nombre total d'arbres à générer dans cette nouvelle zone
      const treeCount = 150; // Ajuste ce nombre selon tes besoins

      for (let i = 0; i < treeCount; i++) {
        // Générer une position aléatoire entre les deux côtés (haut-bas)
        const t1 = Math.random(); // Interpolation pour la position sur le côté gauche
        const leftX = topLeft.x + t1 * (bottomLeft.x - topLeft.x);
        const leftZ = topLeft.z + t1 * (bottomLeft.z - topLeft.z);

        const t2 = Math.random(); // Interpolation pour la position sur le côté droit
        const rightX = topRight.x + t1 * (bottomRight.x - topRight.x);
        const rightZ = topRight.z + t1 * (bottomRight.z - topRight.z);

        // Générer la position finale en interpolant entre les deux côtés
        const finalT = Math.random();
        const finalX = leftX + finalT * (rightX - leftX);
        const finalZ = leftZ + finalT * (rightZ - leftZ);

        // Créer chaque arbre
        const tree = new THREE.Mesh(planeGeometry, planeMaterial);

        // Placer l'arbre à la position générée
        tree.position.set(finalX, 256, finalZ);
        tree.rotation.y = Math.random() * Math.PI * 2; // Rotation aléatoire pour chaque arbre

        // Ajouter l'arbre à la scène
        this.third.scene.add(tree);
      }
    });

    textureLoader.load("/5/test3D/examples/vie/vie-04.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      // Définir les 5 coins du pentagone
      const points = [
        { x: -213, z: -14 },
        { x: -22, z: -22 },
        { x: 97, z: -194 },
        { x: -51, z: -219 },
        { x: -180, z: -144 },
      ];

      // Calculer le centre du pentagone
      const calculatePolygonCenter = (points) => {
        const totalPoints = points.length;
        const sumX = points.reduce((sum, point) => sum + point.x, 0);
        const sumZ = points.reduce((sum, point) => sum + point.z, 0);
        return {
          x: sumX / totalPoints,
          z: sumZ / totalPoints,
        };
      };

      const villageCenter = calculatePolygonCenter(points); // Centre du pentagone
      const villageRadius = 50; // Rayon autour du centre où aucun arbre ne doit être placé

      // Fonction pour vérifier si un point est à l'intérieur du polygone
      const isInsidePolygon = (point, polygon) => {
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

      // Fonction pour vérifier si un point est à l'intérieur du rayon du village
      const isOutsideVillageRadius = (point, villageCenter, villageRadius) => {
        const distanceSquared =
          (point.x - villageCenter.x) ** 2 + (point.z - villageCenter.z) ** 2;
        return distanceSquared > villageRadius ** 2; // Vérifie si le point est en dehors du rayon du village
      };

      // Nombre d'arbres à générer dans cette zone
      const treeCount = 150; // Ajuste ce nombre selon tes besoins

      for (let i = 0; i < treeCount; i++) {
        let treePlaced = false;

        // Générer des arbres jusqu'à ce qu'un point valide à l'intérieur du polygone et à l'extérieur du village soit trouvé
        while (!treePlaced) {
          // Générer une position aléatoire dans les limites globales du polygone
          const minX = Math.min(...points.map((p) => p.x));
          const maxX = Math.max(...points.map((p) => p.x));
          const minZ = Math.min(...points.map((p) => p.z));
          const maxZ = Math.max(...points.map((p) => p.z));

          const randomX = minX + Math.random() * (maxX - minX);
          const randomZ = minZ + Math.random() * (maxZ - minZ);

          const randomPoint = { x: randomX, z: randomZ };

          // Vérifier si le point aléatoire est dans le polygone et en dehors du village
          if (
            isInsidePolygon(randomPoint, points) &&
            isOutsideVillageRadius(randomPoint, villageCenter, villageRadius)
          ) {
            // Créer chaque arbre
            const tree = new THREE.Mesh(planeGeometry, planeMaterial);

            // Placer l'arbre à la position générée
            tree.position.set(randomPoint.x, 256, randomPoint.z);
            tree.rotation.y = Math.random() * Math.PI * 2; // Rotation aléatoire pour chaque arbre

            // Ajouter l'arbre à la scène
            this.third.scene.add(tree);
            treePlaced = true;
          }
        }
      }
    });
    textureLoader.load("/5/test3D/examples/vie/vie-12.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const house = new THREE.Mesh(planeGeometry, planeMaterial);
      const house1 = new THREE.Mesh(planeGeometry, planeMaterial);
      const house2 = new THREE.Mesh(planeGeometry, planeMaterial);
      const house3 = new THREE.Mesh(planeGeometry, planeMaterial);
      const house4 = new THREE.Mesh(planeGeometry, planeMaterial);
      const house5 = new THREE.Mesh(planeGeometry, planeMaterial);

      // Placer l'arbre à la position générée
      house.position.set(-81, 256, -152);
      house.rotation.y = Math.PI * 2;

      house1.position.set(-67, 256, -150);
      house1.rotation.y = Math.PI * 2;

      house2.position.set(-137, 256, -143);
      house2.rotation.y = Math.PI * 1.5;

      house3.position.set(-81, 256, -152);
      house3.rotation.y = Math.PI * 2;

      house4.position.set(-81, 256, -152);
      house4.rotation.y = Math.PI * 2;

      house5.position.set(-81, 256, -152);
      house5.rotation.y = Math.PI * 2;

      // Ajouter l'arbre à la scène
      this.third.scene.add(house);
      this.third.scene.add(house1);
      this.third.scene.add(house2);
      this.third.scene.add(house3);
      this.third.scene.add(house4);
      this.third.scene.add(house5);
    });

    textureLoader.load("/5/test3D/examples/vie/vie-13.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const house = new THREE.Mesh(planeGeometry, planeMaterial);
      const house1 = new THREE.Mesh(planeGeometry, planeMaterial);
      const house2 = new THREE.Mesh(planeGeometry, planeMaterial);
      const house3 = new THREE.Mesh(planeGeometry, planeMaterial);
      const house4 = new THREE.Mesh(planeGeometry, planeMaterial);
      const house5 = new THREE.Mesh(planeGeometry, planeMaterial);

      // Placer l'arbre à la position générée
      house.position.set(-81, 256, -152);
      house.rotation.y = Math.PI * 2;

      house1.position.set(-67, 256, -150);
      house1.rotation.y = Math.PI * 2;

      house2.position.set(-137, 256, -143);
      house2.rotation.y = Math.PI * 1.5;

      house3.position.set(-81, 256, -152);
      house3.rotation.y = Math.PI * 2;

      house4.position.set(-81, 256, -152);
      house4.rotation.y = Math.PI * 2;

      house5.position.set(-81, 256, -152);
      house5.rotation.y = Math.PI * 2;

      // Ajouter l'arbre à la scène
      this.third.scene.add(house);
      this.third.scene.add(house1);
      this.third.scene.add(house2);
      this.third.scene.add(house3);
      this.third.scene.add(house4);
      this.third.scene.add(house5);
    });

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

    this.input.mouse.disableContextMenu();
  }

  // Correction de l'orthographe d'update
  update() {
    this.freeCamera.update();
    this.pointerLaser.update();

    //this.player.update(this);
  }
}
