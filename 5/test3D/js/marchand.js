import Global from "/5/test3D/js/inventaire.js";

export default class Marchand {
  constructor(scene, x, y, z) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.z = z;
    this.items = [];
    this.isDay = true;

    // Charger l'image du marchand
    const texture = new THREE.TextureLoader().load(
      "/5/test3D/examples/marchand.png"
    );
    const geometry = new THREE.PlaneGeometry(1.5, 3);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.5,
    });

    this.marchandMesh = new THREE.Mesh(geometry, material);
    this.marchandMesh.position.set(this.x, this.y, this.z);

    scene.third.physics.add.existing(this.marchandMesh, {
      shape: "box",
      depth: 2,
      mass: 0,
    });
    scene.third.scene.add(this.marchandMesh);

    this.generateItems();

    // Réinitialiser les articles toutes les 2 minutes
    this.resetTimer = setInterval(() => {
      this.generateItems();
    }, 120000); // 120000 ms = 2 minutes
  }

  showItemsForSale() {
    this.scene.scene.launch("MarchandScene", { marchand: this });
    this.scene.scene.pause("monde");
  }

  getPrice(type) {
    const prices = {
      "viande bien cuite": 10,
      potion_vie: 25,
      potion_force: 25,
      potion_mana: 25,
      potion_temps: 30,
      potion_defense: 25,
      "potion_mana+": 35,
      "potion_vie+": 35,
      potion_vieFull: 50,
    };
    return prices[type] || 0;
  }

  purchaseItem(item) {
    const playerCoins = Global.inventory.coins;
    const price = this.getPrice(item.type);

    if (playerCoins >= price && item.quantity > 0) {
      Global.inventory.coins -= price;
      item.quantity--;

      if (item.type.startsWith("potion")) {
        Global.addPotion(item.type);
      } else if (item.type === "viande bien cuite") {
        Global.addMeatOrHoney(item.type, 1);
      }
    } else {
      console.log("Pas assez de pièces ou article en rupture de stock !");
    }
  }

  generateItems() {
    this.items = [];
    const randomChance = Math.random() * 100;

    if (randomChance <= 80) {
      // 80% de chance d'avoir 2 articles
      this.items.push(this.createItem("viande bien cuite", 5));

      // Potion selon les pourcentages
      const potion = this.generatePotion();
      if (potion) {
        this.items.push(potion);
      }
    } else {
      // 20% de chance d'avoir 3 articles
      this.items.push(this.createItem("viande bien cuite", 5));

      // Deux potions
      const potion1 = this.generatePotion();
      const potion2 = this.generatePotion();
      if (potion1) {
        this.items.push(potion1);
      }
      if (potion2) {
        this.items.push(potion2);
      }
    }

    console.log("Articles générés :", this.items);
  }

  generatePotion() {
    const potionChance = Math.random() * 100;

    if (potionChance <= 15) return this.createItem("potion_vie", 1);
    if (potionChance <= 30) return this.createItem("potion_force", 1);
    if (potionChance <= 45) return this.createItem("potion_mana", 1);
    if (potionChance <= 60) return this.createItem("potion_temps", 1);
    if (potionChance <= 75) return this.createItem("potion_defense", 1);
    if (potionChance <= 85) return this.createItem("potion_mana+", 1);
    if (potionChance <= 95) return this.createItem("potion_vie+", 1);
    if (potionChance <= 100) return this.createItem("potion_vieFull", 1);

    return null; // Aucun article si rien n'est généré
  }
  createItem(type, quantity) {
    return { type, quantity };
  }

  destroy() {
    clearInterval(this.resetTimer);
    this.scene.third.scene.remove(this.marchandMesh);
    this.marchandMesh.geometry.dispose();
    this.marchandMesh.material.dispose();
  }
}
