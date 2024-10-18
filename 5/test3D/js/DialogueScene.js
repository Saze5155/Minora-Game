export default class DialogueScene extends Phaser.Scene {
    constructor() {
      super({ key: 'DialogueScene' });
      this.currentText = 0; // Pour gérer l'affichage du texte
      this.isTyping = false; // Pour vérifier si le texte est en train de s'écrire
    }
  
    preload() {
      // Charger les ressources nécessaires (si besoin)
    }
  
    create() {

      this.typingSound = this.sound.add("Dialogue_bonny",  { loop: true, volume: 0.3 });
      // Créer le background qui prend tout l'écran
      this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height);
  
      // Ajouter l'animation de bonny au centre
      this.bonny = this.add.sprite(this.scale.width / 2, this.scale.height / 2 - 100, 'anim_bonny').setScale(0.7);
      this.bonny.anims.play('anim_bonny');
  
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
        " Bonjour, tu t’appelles Cletra c’est ça ?",
        "Moi c’est Bonny, j’ai vu ton village partir en fumée, je vais tout te raconter...",
        "Tu vois l’île au loin ?",
        "Elle est dirigée par trois dieux: Ukufifa Déesse de la Vie, Khala Déesse de l’Espace et Khali son frère Jumeaux Dieu du Temps ! Elle est dirigée par trois dieux: Ukufifa Déesse de la Vie, Khala Déesse de l’Espace et Khali son frère Jumeaux dieu du Temps !",
        "Ils règnent sur trois nations séparées par des murailles.",
        "À l’époque, tout le peuple vivait main dans la main. Un jour, les Dieux ont mis la main sur une vieille prophétie ....",
        "« Une enfant née des trois nations viendra briser l’autorité des dieux »",
        "pris de panique, ils ont monté des murailles pour séparer leurs peuples. Ils ont découverts des années après l’existence de ton île et de ton petit village",
        "le dernier où toutes les nations vivent encore en communauté. Ainsi ils y ont mis feu, ce sont eux les responsables de tout ça, ils ont tué ta famille, tes amis, détruit ta maison, ton village et ton île entière et maintenant ils se cachent dans la tour centrale de l’île.",
        "Mais ne t’inquiètes pas, je vais t’aider à te venger, je te suivrai tout au long de ton périple pour t’aider à les retrouver.",
        "Commence par prendre le bateau pour rejoindre l’île",
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
  