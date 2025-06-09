// --- Item Database for Dive for Atlantis ---

// Base class for all items
class Item {
  constructor(id, name, description, rarity, value, imageUrl) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.rarity = rarity; // COMMON, UNCOMMON, RARE, EPIC, LEGENDARY
    this.value = value;
    this.imageUrl = imageUrl;
  }
}

// Base class for treasures
class Treasure extends Item {
  constructor(id, name, description, rarity, value, imageUrl, historicalPeriod, condition, attributes = {}) {
    super(id, name, description, rarity, value, imageUrl);
    this.type = 'TREASURE';
    this.historicalPeriod = historicalPeriod;
    this.condition = condition; // MINT, GOOD, FAIR, POOR
    this.attributes = attributes; // Custom attributes for this specific treasure
  }
}

// Base class for creatures
class Creature extends Item {
  constructor(id, name, description, rarity, value, imageUrl, behavior, habitat) {
    super(id, name, description, rarity, value, imageUrl);
    this.type = 'CREATURE';
    this.behavior = behavior; // DOCILE, NEUTRAL, AGGRESSIVE
    this.habitat = habitat;
  }
}

// Base class for crafting recipes
class Recipe extends Item {
  constructor(id, name, description, rarity, value, imageUrl, ingredients, result) {
    super(id, name, description, rarity, value, imageUrl);
    this.type = 'RECIPE';
    this.ingredients = ingredients; // Array of {itemId: string, quantity: number}
    this.result = result; // {itemId: string, quantity: number}
  }
}

// Item Database
const ITEMS = {
  // Treasures
  OLD_COINS: new Treasure(
    'OLD_COINS',
    'Ancient Coins',
    'A collection of weathered coins from a forgotten era.',
    'COMMON',
    10,
    '🪙',
    'Ancient',
    'FAIR'
  ),
  
  SHIPWRECK_DEBRIS: new Treasure(
    'SHIPWRECK_DEBRIS',
    'Shipwreck Debris',
    'Pieces of a sunken vessel, still bearing traces of its former glory.',
    'UNCOMMON',
    20,
    '⚓️',
    'Colonial',
    'POOR'
  ),
  
  SUNKEN_CHEST_1: new Treasure(
    'SUNKEN_CHEST_1',
    'Pirate Captain\'s Chest',
    'A weathered chest bearing the mark of the feared pirate captain Blackbeard. The lock is rusted shut, but the gold trim still glints in the water.',
    'RARE',
    50,
    '💰',
    'Colonial',
    'GOOD',
    {
      origin: 'Pirate Ship',
      material: 'Oak with Gold Trim',
      specialFeature: 'Carved Skull and Crossbones',
      contents: 'Gold Coins and Jewelry',
      historicalSignificance: 'Belonged to Blackbeard\'s fleet'
    }
  ),
  
  SUNKEN_CHEST_2: new Treasure(
    'SUNKEN_CHEST_2',
    'Merchant\'s Strongbox',
    'A sturdy iron-bound chest that once carried the fortunes of a wealthy merchant. The intricate lock mechanism is still intact.',
    'RARE',
    45,
    '💰',
    'Medieval',
    'FAIR',
    {
      origin: 'Trading Vessel',
      material: 'Iron and Hardwood',
      specialFeature: 'Complex Lock Mechanism',
      contents: 'Trade Goods and Documents',
      historicalSignificance: 'Part of the Silk Road maritime trade'
    }
  ),
  
  SUNKEN_CHEST_3: new Treasure(
    'SUNKEN_CHEST_3',
    'Royal Treasury Chest',
    'An ornate chest bearing the royal seal of an ancient kingdom. The gold leaf and precious stones have survived the centuries remarkably well.',
    'EPIC',
    75,
    '💰',
    'Ancient',
    'MINT',
    {
      origin: 'Royal Ship',
      material: 'Gold Leaf and Precious Stones',
      specialFeature: 'Royal Seal',
      contents: 'Royal Artifacts and Jewels',
      historicalSignificance: 'Part of a royal fleet'
    }
  ),
  
  ANCIENT_RELIC: new Treasure(
    'ANCIENT_RELIC',
    'Ancient Relic',
    'A mysterious artifact of immense historical value.',
    'EPIC',
    100,
    '🏺',
    'Prehistoric',
    'MINT'
  ),
  
  ATLANTIS_DISCOVERY: new Treasure(
    'ATLANTIS_DISCOVERY',
    'Atlantis Artifact',
    'An artifact from the legendary lost city of Atlantis!',
    'LEGENDARY',
    500,
    '🏛️',
    'Mythical',
    'MINT'
  ),

  // Creatures
  SHARK: new Creature(
    'SHARK',
    'Great White Shark',
    'A formidable predator of the deep.',
    'RARE',
    0,
    '🦈',
    'AGGRESSIVE',
    'Deep Ocean'
  ),

  // Example Recipe
  MERMAID_NECKLACE: new Recipe(
    'MERMAID_NECKLACE',
    'Mermaid\'s Necklace Recipe',
    'Combine pearls and ancient gold to create a magical necklace.',
    'RARE',
    0,
    '📜',
    [
      { itemId: 'PEARL', quantity: 3 },
      { itemId: 'ANCIENT_GOLD', quantity: 1 }
    ],
    { itemId: 'MERMAID_NECKLACE', quantity: 1 }
  )
};

// Helper functions for working with items
const ItemManager = {
  getItem(id) {
    return ITEMS[id];
  },

  getItemsByType(type) {
    return Object.values(ITEMS).filter(item => item.type === type);
  },

  getItemsByRarity(rarity) {
    return Object.values(ITEMS).filter(item => item.rarity === rarity);
  },

  // Get items by attribute value
  getItemsByAttribute(attribute, value) {
    return Object.values(ITEMS).filter(item => 
      item.attributes && item.attributes[attribute] === value
    );
  },

  // Get items by historical period
  getItemsByHistoricalPeriod(period) {
    return Object.values(ITEMS).filter(item => 
      item.historicalPeriod === period
    );
  },

  // Add a new item to the database
  addItem(item) {
    if (ITEMS[item.id]) {
      throw new Error(`Item with ID ${item.id} already exists`);
    }
    ITEMS[item.id] = item;
  }
};

// Make items available globally
window.ITEMS = ITEMS;
window.ItemManager = ItemManager;
window.Item = Item;
window.Treasure = Treasure;
window.Creature = Creature;
window.Recipe = Recipe; 