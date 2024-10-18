export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenu" });
    }

    preload() {
        // Load images for buttons and backgrounds
        this.load.image("ecran-jeu", "/5/test3D/examples/Accueil/ecran-jeu.png"); // Replace with correct path
        this.load.image("bouton-play", "/5/test3D/examples/Accueil/bouton-play.png");
        this.load.image("bouton-credits", "/5/test3D/examples/Accueil/bouton-credits.png");
        this.load.image("ecrans-credits", "/5/test3D/examples/Accueil/ecrans-credits.png");
        this.load.image("bouton-retour", "/5/test3D/examples/Accueil/bouton-retour.png");
    }

    create() {
        // Add the background image
        this.background = this.add.image(0, 0, "ecran-jeu").setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);
        
        // Add the play button
        this.playButton = this.add.image(this.scale.width / 2, this.scale.height / 2 - 50, "bouton-play").setInteractive();
        this.playButton.setScale(0.5); // Resize if necessary

        // Add the credits button
        this.creditsButton = this.add.image(this.scale.width / 2, this.scale.height / 2 + 50, "bouton-credits").setInteractive();
        this.creditsButton.setScale(0.5); // Resize if necessary

        // Add hover effect to Play button
        this.playButton.on("pointerover", () => {
            this.playButton.setScale(0.55); // Enlarge on hover
        });
        this.playButton.on("pointerout", () => {
            this.playButton.setScale(0.5); // Reset size on hover out
        });

        // Add hover effect to Credits button
        this.creditsButton.on("pointerover", () => {
            this.creditsButton.setScale(0.55); // Enlarge on hover
        });
        this.creditsButton.on("pointerout", () => {
            this.creditsButton.setScale(0.5); // Reset size on hover out
        });

        // Add click functionality for Play button
        this.playButton.on("pointerdown", () => {
            this.scene.start("monde"); // Start the "monde" scene
        });

        // Add click functionality for Credits button
        this.creditsButton.on("pointerdown", () => {
            this.showCredits();
        });
    }

    showCredits() {
        // Remove the main menu buttons
        this.playButton.destroy();
        this.creditsButton.destroy();

        // Change the background
        this.background.setTexture("ecrans-credits");

        // Add the Retour button
        this.returnButton = this.add.image(this.scale.width - 200, this.scale.height - 100, "bouton-retour").setInteractive();
        this.returnButton.setScale(0.5);

        // Add hover effect to Retour button
        this.returnButton.on("pointerover", () => {
            this.returnButton.setScale(0.55); // Enlarge on hover
        });
        this.returnButton.on("pointerout", () => {
            this.returnButton.setScale(0.5); // Reset size on hover out
        });

        // Add click functionality for Retour button
        this.returnButton.on("pointerdown", () => {
            this.returnToMainMenu();
        });
    }

    returnToMainMenu() {
        // Change the background back to the main menu
        this.background.setTexture("ecran-jeu");
    
        // Add the play and credits buttons again
        this.playButton = this.add.image(this.scale.width / 2, this.scale.height / 2 - 50, "bouton-play").setInteractive();
        this.playButton.setScale(0.5);
        this.creditsButton = this.add.image(this.scale.width / 2, this.scale.height / 2 + 50, "bouton-credits").setInteractive();
        this.creditsButton.setScale(0.5);
    
        // Apply hover effect for play button
        this.playButton.on("pointerover", () => {
            this.playButton.setScale(0.55);
        });
        this.playButton.on("pointerout", () => {
            this.playButton.setScale(0.5);
        });
    
        // Apply click functionality for play button
        this.playButton.on("pointerdown", () => {
            this.scene.start("monde"); // Start the "monde" scene
        });
    
        // Apply hover effect for credits button
        this.creditsButton.on("pointerover", () => {
            this.creditsButton.setScale(0.55);
        });
        this.creditsButton.on("pointerout", () => {
            this.creditsButton.setScale(0.5);
        });
    
        // Apply click functionality for credits button
        this.creditsButton.on("pointerdown", () => {
            this.showCredits(); // Go back to credits
        });
    
        // Remove the Retour button
        this.returnButton.destroy();
    }
    
}
