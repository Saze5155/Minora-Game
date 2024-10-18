export default class DialogueScene2 extends Phaser.Scene {
    constructor() {
      super({ key: 'DialogueScene2' });
      this.currentText = 0; // Pour gérer l'affichage du texte
      this.isTyping = false; // Pour vérifier si le texte est en train de s'écrire
    }
  
    preload() {
      // Charger les ressources nécessaires (si besoin)
    }
  
    create() {

      this.typingSound = this.sound.add("Dialogue_bonny2",  { loop: true, volume: 0.3 });
      // Créer le background qui prend tout l'écran
      this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height);
  
      // Ajouter l'animation de bonny au centre
      this.bonny = this.add.sprite(this.scale.width / 2, this.scale.height / 2 - 100, 'anim_bonny2').setScale(0.7);
      this.bonny.anims.play('anim_bonny2');
  
      // Ajouter la boîte de dialogue en bas avec marge
      const boxWidth = this.scale.width * 0.7;
      const boxHeight = this.scale.height * 0.2;
      const boxX = (this.scale.width - boxWidth) / 2;
      const boxY = this.scale.height * 0.7;
      const margin = 20; // Marge à l'intérieur de la boîte
  
      const dialogueBox = this.add.graphics();
      dialogueBox.fillStyle(0x000000, 0.7); // Semi-transparent noir
      dialogueBox.fillRect(boxX, boxY, boxWidth, boxHeight);
  
      // Texte avec marge et une largeur maximale pour gérer le retour à la ligne
      const maxTextWidth = boxWidth - margin * 2;
      this.dialogueText = this.add.text(boxX + margin, boxY + margin, '', {
        fontSize: '24px',
        fill: '#ffffff',
        wordWrap: { width: maxTextWidth }, // Limiter la largeur du texte
      });
  
      // Ajouter le bouton 'E' en bas à droite de la boîte de dialogue
      this.eButton = this.add.circle(boxX + boxWidth - 40, boxY + boxHeight - 40, 20, 0xffffff);
      this.eButtonText = this.add.text(boxX + boxWidth - 45, boxY + boxHeight - 50, 'E', {
        fontSize: '24px',
        fill: '#000000',
      });
  
      // Liste des textes à afficher
      this.texts = [
        "Hahahahaha merci pour tes services petite idiote !",
        "Grâce à toi je suis enfin libre, tu as détruis mon sceau !!!!!",
        "Tu veux savoir la vérité ? Il y a toujours eu 4 dieux, Ukufifa Déesse de la Vie, Khala Déesse de l’Espace, Khali son frère Jumeaux Dieu du Temps et MOI ! De mon vrai nom… ISIBANI ! Déesse de la lumière ! ",
        "Lorsque j’ai découvert la prophétie, j’ai ordonné la séparation des trois nations pour séparer les dieux et régner en maître unique sur tout le peuple, mais mes confrères n’étaient pas d’accord et m’ont scellé dans la tour..",
        "Tour dans laquelle ils restent pour me surveiller ...",
        "Cependant, une partie de mon esprit à réussi à s’échapper lors de l’attaque, je suis devenue Bonny. Pour contrer la prophétie j’ai mis feu à ton petit village insignifiant, il ne me restait plus qu’à trouver un esprit assez naïf, simple à manipuler pour être libérée.",
        "C’est là que je t’ai vu, la victime parfaite, aveuglée par la haine tu as fait tout ce que je t’ai demandé de faire, sans aucune hésitation.",
        "Merci beaucoup, grâce à toi je suis enfin libre et mes confrères ne peuvent plus m’arrêter. Il ne me reste plus qu’à t’éliminer et tous mes problèmes auront disparu !!!!",
    ];
  
      // Lancer l'affichage du premier texte
      this.displayText();
  
      // Écouter l'entrée clavier pour la touche 'E'
      this.input.keyboard.on('keydown-E', () => {
        this.pressEButtonEffect(); // Ajouter l'effet d'appui sur le bouton
        if (this.isTyping) {
          // Si le texte est en train de s'écrire, on termine l'animation
          this.completeText();
        } else {
          // Si tout le texte est affiché, on passe au texte suivant
          this.nextText();
        }
      });
    }
  
    displayText() {
      this.typingSound.play();
      const currentText = this.texts[this.currentText];
      this.dialogueText.setText(''); // Réinitialiser le texte
      this.isTyping = true; // Le texte est en train de s'écrire
  
      let charIndex = 0;
  
      this.typingInterval = this.time.addEvent({
        delay: 30, // Vitesse de la machine à écrire (50ms entre chaque lettre)
        callback: () => {
          this.dialogueText.setText(this.dialogueText.text + currentText[charIndex]);
          charIndex++;
          
          // Quand le texte est entièrement affiché, arrêter l'intervalle
          if (charIndex === currentText.length) {
            this.typingInterval.remove(false);
            this.typingSound.stop();
            this.isTyping = false; // Fin de l'effet de machine à écrire
          }
        },
        loop: true,
      });
    }
  
    completeText() {
      const currentText = this.texts[this.currentText];
      // Affiche immédiatement tout le texte
      this.dialogueText.setText(currentText);
      this.typingSound.stop();
      // Arrêter l'intervalle de "machine à écrire" et indiquer que la frappe est terminée
      if (this.typingInterval) {
        this.typingInterval.remove(false);
      }
      this.isTyping = false;
    }
  
    nextText() {
      if (this.typingInterval) {
        this.typingInterval.remove(false); // Stopper l'animation en cours
      }
  
      this.currentText++;
  
      // Vérifier s'il y a encore du texte à afficher
      if (this.currentText < this.texts.length) {
        this.displayText(); // Afficher le texte suivant
      } else {
        // Si c'est le dernier texte, peut-être faire disparaître la boîte de dialogue
        this.dialogueText.setText("Fin du dialogue."); // Message final
        this.time.delayedCall(2000, () => {
          this.scene.stop(); // Fermer la scène de dialogue après 2 secondes
        });
      }
    }
  
    // Ajouter l'effet d'appui sur le bouton 'E'
    pressEButtonEffect() {
      // Réduire légèrement le cercle et le texte pour simuler l'appui
      this.tweens.add({
        targets: [this.eButton, this.eButtonText],
        scale: 0.9, // Réduire l'échelle
        duration: 100, // Durée rapide pour l'effet d'appui
        yoyo: true, // Retour à la taille normale
        ease: 'Power1',
      });
    }
  }
  