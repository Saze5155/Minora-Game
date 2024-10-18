export default class Dialogue extends Phaser.Scene {
  constructor() {
    super({ key: 'Dialogue' });
  }

  create() {
    // Création d'un background semi-transparent
    const background = this.add.graphics();
    background.fillStyle(0x000000, 0.7);
    background.fillRect(0, this.cameras.main.height - 200, this.cameras.main.width, 200);

    // Création du texte de dialogue
    this.dialogueText = this.add.text(50, this.cameras.main.height - 180, '', {
      fontSize: '24px',
      fill: '#ffffff',
      wordWrap: { width: this.cameras.main.width - 100 } // Gestion du retour à la ligne
    });

    this.options = [];
  }

  showDialogue(text, options) {
    // Vérification que dialogueText est bien défini
    if (this.dialogueText) {
      this.dialogueText.setText(text);
      this.options.forEach(option => option.destroy());
      this.options = [];

      // Affichage des options
      options.forEach((optionText, index) => {
        const option = this.add.text(50, this.cameras.main.height - 140 + index * 30, optionText.text, {
          fontSize: '20px',
          fill: '#ffffff'
        });
        option.setInteractive();
        option.on('pointerdown', () => {
          this.hideDialogue();
          optionText.callback();
        });
        this.options.push(option);
      });
    } else {
      console.error('dialogueText is undefined');
    }
  }

  hideDialogue() {
    this.dialogueText.setText('');
    this.options.forEach(option => option.destroy());
    this.options = [];
  }
}
