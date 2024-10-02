import monde from "/5/test3D/js/monde.js";
import tpt from "/5/test3D/js/tpt.js";
import plateformer from "/5/test3D/js/plateformer.js";
import interfaceJeu from "/5/test3D/js/interfaceJeu.js";
import marchand from "/5/test3D/js/marchand.js";

export default class loading extends Scene3D {

    preload(){

    }

    create(){
        // chargement des scenes
        this.scene.add('monde', monde, false);
        // this.scene.add('tpt', tpt, false);
        // this.scene.add('plateformer', plateformer, false);
        // this.scene.add('marchand', marchand, false);

        // chargement de l'interface de jeu avec les parametres de victoire
        // this.scene.add('interfaceJeu', interfaceJeu, false, { remainingMonsters: remainingMonsters, remainingItems: remainingItems });
        
        // lancement du jeu
        this.scene.start("monde");
        

    }

}

