const framePaths = [];
          for (let i = 1; i <= 10; i++) {
            framePaths.push(`/5/test3D/examples/png/Walk(${i}).png`);
          }

          const walkTextures = [];
          let framesLoaded = 0;

          framePaths.forEach((path, index) => {
            textureLoader.load(path, (texture) => {
              walkTextures[index] = texture;
              framesLoaded++;

              if (framesLoaded === framePaths.length) {
                this.createWalkAnimation(walkTextures);
              }
            });
          });

          this.input.mouse.disableContextMenu();

          this.keys = {
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            forward: this.input.keyboard.addKey(
              Phaser.Input.Keyboard.KeyCodes.Z
            ),
            backward: this.input.keyboard.addKey(
              Phaser.Input.Keyboard.KeyCodes.S
            ),
          };
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
          walkPlane.position.set(0, 260, 0);
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

            if (
              this.keys.left.isDown ||
              this.keys.right.isDown ||
              this.keys.forward.isDown ||
              this.keys.backward.isDown
            ) {
              if (!isWalking) {
                isWalking = true;
                animateWalk();
              }

              let velocityX = 0;
              let velocityZ = 0;

              // Gérer le déplacement gauche/droite
              if (this.keys.left.isDown) {
                velocityX = -2; // Déplace à gauche
                if (direction !== -1) {
                  walkPlane.scale.x = -1;
                  direction = -1;
                }
              } else if (this.keys.right.isDown) {
                velocityX = 2; // Déplace à droite
                if (direction !== 1) {
                  walkPlane.scale.x = 1;
                  direction = 1;
                }
              }

              // Gérer le déplacement avant/arrière
              if (this.keys.forward.isDown) {
                velocityZ = -2; // Déplace vers l'avant
              } else if (this.keys.backward.isDown) {
                velocityZ = 2; // Déplace vers l'arrière
              }

              // Appliquer la vélocité au corps physique
              body.setVelocityX(velocityX);
              body.setVelocityZ(velocityZ);

              // Mettre à jour la position de la caméra pour qu'elle suive le personnage
              this.third.camera.position.set(
                walkPlane.position.x,
                walkPlane.position.y + 2, // Ajuster la hauteur de la caméra
                walkPlane.position.z + 10 // Ajuster la distance de la caméra
              );

              this.third.camera.lookAt(walkPlane.position);
            } else {
              isWalking = false;
              body.setVelocity(0, 0, 0); // Arrête le personnage si aucune touche n'est appuyée
            }
          });