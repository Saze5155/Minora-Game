export default class VictoryScene extends Phaser.Scene {
    constructor() {
      super({ key: 'VictoryScene' });
    }
  
    create() {
      this.add.text(400, 300, 'Vous avez gagné le combat final !', { fontSize: '32px', fill: '#fff' });
  
      // Rediriger vers le monde après quelques secondes
      this.time.delayedCall(3000, () => {
        this.scene.start('monde'); // Reprendre la scène "monde" après la victoire
      }, [], this);
    }
  }
  