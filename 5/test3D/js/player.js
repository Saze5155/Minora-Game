export default class Player {

    constructor(scene, x, y, z, textureKey) {
        const texture = new THREE.TextureLoader().load(textureKey);
        const geometry = new THREE.PlaneGeometry(2.5, 2.5);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            alphaTest: 0.5,
        });

        // Stocker walkPlane en tant que propriété de l'instance
        this.walkPlane = new THREE.Mesh(geometry, material);
        this.walkPlane.position.set(x, y, z);
        scene.third.scene.add(this.walkPlane);

        // Ajouter un corps physique au personnage (walkPlane)
        scene.third.physics.add.existing(this.walkPlane, {
            shape: "box",
            width: 2.5,
            height: 2.5,
            depth: 0.1,
        });

        // Empêcher le personnage de tourner sur les axes X et Z
        this.walkPlane.body.setAngularFactor(0, 0, 0);

        // Initialisation des touches
        this.keys = {
            left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            forward: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            backward: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        };

        this.material = material; // Stocker le matériau pour l'utiliser dans animateWalk
        this.currentFrame = 0;
        this.walkTextures = [];
        this.isWalking = false;
        const framePaths = [];
        for (let i = 1; i <= 10; i++) {
            framePaths.push(`/5/test3D/examples/png/Walk(${i}).png`);
        }

        const textureLoader = new THREE.TextureLoader();
        let texturesLoaded = 0;

        framePaths.forEach((path, index) => {
            textureLoader.load(path, (texture) => {
                this.walkTextures[index] = texture;
                texturesLoaded++;
                console.log(`Texture ${index + 1} chargée : `, texture);
            }, undefined, (err) => {
                console.error(`Erreur lors du chargement de la texture ${path}:`, err);
            });
        });
    }

    // Fonction pour charger les textures de l'animation
    create(scene) {
        
    }

    // Fonction pour gérer l'animation de marche avec requestAnimationFrame
    animateWalk() {
        console.log(this.walkTextures);
        if (this.isWalking && this.walkTextures.length > 0) {
            this.material.map = this.walkTextures[this.currentFrame];
            this.material.needsUpdate = true;
            this.currentFrame = (this.currentFrame + 1) % this.walkTextures.length;

            // Utiliser requestAnimationFrame pour la récursion
            requestAnimationFrame(() => this.animateWalk());
        }
    }

    update(scene) {
        const body = this.walkPlane.body;  // Récupérer le corps physique du personnage
        let velocityX = 0;
        let velocityZ = 0;
        let isWalking = false;

        // Vérifier les touches appuyées
        if (this.keys.left.isDown) {
            velocityX = -2;
            this.walkPlane.scale.x = -1;  // Inverser l'orientation pour tourner à gauche
            isWalking = true;
        } else if (this.keys.right.isDown) {
            velocityX = 2;
            this.walkPlane.scale.x = 1;  // Tourner à droite
            isWalking = true;
        }

        if (this.keys.forward.isDown) {
            velocityZ = -2;  // Avancer
            isWalking = true;

            // Lancer l'animation si elle n'est pas déjà en cours
            if (!this.isWalking) {
                this.isWalking = true;
                this.animateWalk();
            }
        } else if (this.keys.backward.isDown) {
            velocityZ = 2;  // Reculer
            isWalking = true;
        }

        // Appliquer la vélocité
        body.setVelocityX(velocityX);
        body.setVelocityZ(velocityZ);

        // Suivre le joueur avec la caméra
        scene.third.camera.position.set(
            this.walkPlane.position.x,
            this.walkPlane.position.y + 2,
            this.walkPlane.position.z + 10
        );
        scene.third.camera.lookAt(this.walkPlane.position);

        // Si le personnage ne marche pas, arrêter le mouvement
        if (!isWalking) {
            body.setVelocity(0, 0, 0);
            this.isWalking = false; // Arrêter l'animation de marche
        }
    }

    getMesh() {
        return this.walkPlane;  // Expose le mesh pour y accéder depuis la scène
    }
}
