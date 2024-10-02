import player from "/5/test3D/js/player.js";

export default class monde extends Scene3D {
    constructor() {
      super({ key: "monde" });
    }

    init() {
      this.accessThirdDimension();
    }

    create() {
        this.player = new player(this, 0, 256, 0, "/5/test3D/examples/png/Walk(1).png");
        const playerMesh = this.player.getMesh();

      this.third.warpSpeed("light", "fog", "orbitControls");
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
          uniforms.bottomColor.value.lerp(
            new THREE.Color(0x0022bb),
            progress
          ); // Fondu vers le bleu foncé
        } else {
          uniforms.topColor.value.lerp(new THREE.Color(0x0077ff), progress); // Fondu vers le bleu clair
          uniforms.bottomColor.value.lerp(
            new THREE.Color(0xffffff),
            progress
          ); // Fondu vers le blanc
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
        // Appel de la méthode update du joueur
        this.player.update(this);
    }

    createWalkAnimation(walkTextures) {
      const geometry = new THREE.PlaneGeometry(2.5, 2.5);
      const material = new THREE.MeshBasicMaterial({
        map: walkTextures[0],
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });
      const walkPlane = new THREE.Mesh(geometry, material);
      walkPlane.position.set(0, 255, 0);
      this.third.scene.add(walkPlane);
      // Ajouter un corps physique au personnage (walkPlane)
      this.third.physics.add.existing(walkPlane, {
        shape: "box",
        width: 2.5,
        height: 2.5,
        depth: 0.1,
      });
      // Empêcher le personnage de tourner sur les axes X et Z pour qu'il reste droit
      walkPlane.body.setAngularFactor(0, 0, 0); // Permet uniquement la rotation sur l'axe Y (rotation horizontale)

      let currentFrame = 0;
      const totalFrames = walkTextures.length;
      let isWalking = false;
      let direction = 1;

      const animateWalk = () => {
        if (isWalking) {
          material.map = walkTextures[currentFrame];
          material.needsUpdate = true;
          currentFrame = (currentFrame + 1) % totalFrames;
          setTimeout(animateWalk, 100);
        }
      };

      animateWalk();

      this.events.on("update", () => {
        const body = walkPlane.body; // Récupérer le corps physique du personnage

        
      });
    }
  }