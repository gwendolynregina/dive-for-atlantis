// --- Dive for Atlantis Game Logic ---

const CURRENT_STATUS_PROBS = [
  { status: "NO_CURRENT", prob: 0.2 },
  { status: "SOME_CURRENT", prob: 0.5 },
  { status: "STRONG_CURRENTS", prob: 0.3 }
];

const EVENT_TABLES = {
  NO_CURRENT: [
    { event: "SHARK", prob: 0.05 },
    { event: "LOST_BEARINGS", prob: 0.1 },
    { event: "OLD_COINS", prob: 0.315, money: 10 },
    { event: "SHIPWRECK_DEBRIS", prob: 0.21, money: 20 },
    { event: "SUNKEN_CHEST", prob: 0.1575, money: 50 },
    { event: "ANCIENT_RELIC", prob: 0.0675, money: 100 }
  ],
  SOME_CURRENT: [
    { event: "LOST_BEARINGS", prob: 0.2 },
    { event: "SHARK", prob: 0.1 },
    { event: "OLD_COINS", prob: 0.265, money: 10 },
    { event: "SHIPWRECK_DEBRIS", prob: 0.19875, money: 20 },
    { event: "SUNKEN_CHEST", prob: 0.1325, money: 50 },
    { event: "ANCIENT_RELIC", prob: 0.10375, money: 100 }
  ],
  STRONG_CURRENTS: [
    { event: "LOST_BEARINGS", prob: 0.7 },
    { event: "SHARK", prob: 0.1 },
    { event: "ATLANTIS_DISCOVERY", prob: 0.2, money: 500 }
  ]
};

const BOOSTED_EVENT_TABLES = {
  NO_CURRENT: [
    { event: "SHARK", prob: 0, type: "bust" },
    { event: "LOST_BEARINGS", prob: 0.05, type: "neutral" },
    { event: "OLD_COINS", prob: 0.40, type: "treasure", money: 10 },
    { event: "SHIPWRECK_DEBRIS", prob: 0.30, type: "treasure", money: 20 },
    { event: "SUNKEN_CHEST", prob: 0.17, type: "treasure", money: 50 },
    { event: "ANCIENT_RELIC", prob: 0.08, type: "treasure", money: 100 }
  ],
  SOME_CURRENT: [
    { event: "LOST_BEARINGS", prob: 0.05, type: "neutral" },
    { event: "SHARK", prob: 0, type: "bust" },
    { event: "OLD_COINS", prob: 0.39, type: "treasure", money: 10 },
    { event: "SHIPWRECK_DEBRIS", prob: 0.31, type: "treasure", money: 20 },
    { event: "SUNKEN_CHEST", prob: 0.14, type: "treasure", money: 50 },
    { event: "ANCIENT_RELIC", prob: 0.11, type: "treasure", money: 100 }
  ],
  STRONG_CURRENTS: [
    { event: "LOST_BEARINGS", prob: 0.2, type: "neutral" },
    { event: "SHARK", prob: 0.05, type: "bust" },
    { event: "ATLANTIS_DISCOVERY", prob: 0.75, type: "treasure", money: 500 }
  ]
};

function weightedRandom(options) {
  const r = Math.random();
  let acc = 0;
  for (const opt of options) {
    acc += opt.prob;
    if (r < acc) return opt;
  }
  return options[options.length - 1];
}

class GameManager {
  constructor() {
    this.DIVE_COSTS = {
      NO_CURRENT: 10,
      SOME_CURRENT: 15,
      STRONG_CURRENTS: 25
    };
    
    // Shop item prices
    this.ITEM_PRICES = {
      AIR_TANK: 80,
      SHARK_REPELLENT: 150,
      METAL_DETECTOR: 100,
      SONAR_PING: 50
    };
    
    this.resetGame();
  }

  resetGame() {
    this.mainAirSupply = 200;
    this.totalScore = 0;
    this.currentHaul = 0;
    this.inDive = false;
    this.currentStatus = null;
    this.gameOver = false;
    this.lastEvent = null;
    this.sharksEncountered = 0;
    this.sharkRepellents = 0;
    this.metalDetectors = 0;
    this.metalDetectorActive = false;
    this.wallet = 200;
    this.airTanks = 0;
    this.sonarPings = 0;
    this.predictedEvent = null;
    this.inventory = new Map(); // Track collected items
    this.depthMeters = 0;
    this.depthFeet = 0;
  }

  // Add item to inventory
  addToInventory(itemId, quantity = 1) {
    const currentQuantity = this.inventory.get(itemId) || 0;
    this.inventory.set(itemId, currentQuantity + quantity);
  }

  // Remove item from inventory
  removeFromInventory(itemId, quantity = 1) {
    const currentQuantity = this.inventory.get(itemId) || 0;
    if (currentQuantity < quantity) {
      return false;
    }
    this.inventory.set(itemId, currentQuantity - quantity);
    return true;
  }

  // Get inventory item count
  getInventoryCount(itemId) {
    return this.inventory.get(itemId) || 0;
  }

  // Shop functionality
  buyItem(itemType) {
    const price = this.ITEM_PRICES[itemType];
    
    // Check if player has enough money
    if (this.wallet < price) {
      return { success: false, message: "Not enough money!" };
    }

    // Process the purchase
    switch (itemType) {
      case 'AIR_TANK':
        this.airTanks++;
        break;
      case 'SHARK_REPELLENT':
        this.sharkRepellents++;
        break;
      case 'METAL_DETECTOR':
        this.metalDetectors++;
        break;
      case 'SONAR_PING':
        this.sonarPings++;
        break;
      default:
        return { success: false, message: "Invalid item!" };
    }

    // Deduct money from wallet
    this.wallet -= price;
    
    // Update UI
    this.updateShopUI();
    
    // Get user-friendly item name
    const itemNames = {
      'AIR_TANK': 'an Air Tank',
      'SHARK_REPELLENT': 'a Shark Repellent',
      'METAL_DETECTOR': 'a Metal Detector',
      'SONAR_PING': 'a Sonar Ping'
    };
    
    return { success: true, message: `Successfully purchased ${itemNames[itemType]}!` };
  }

  updateShopUI() {
    // Update money display
    document.getElementById('money').textContent = this.wallet;
    
    // Update item counts
    document.getElementById('air-tank-count').textContent = this.airTanks;
    document.getElementById('repellents').textContent = this.sharkRepellents;
    document.getElementById('detectors').textContent = this.metalDetectors;
    document.getElementById('sonar-pings').textContent = this.sonarPings;
  }

  checkGameOver() {
    if (this.mainAirSupply <= 0) {
      if (this.airTanks > 0) {
        // Don't end game if player has air tanks
        return false;
      }
      this.gameOver = true;
      this.inDive = false;
      this.currentHaul = 0;
      return true;
    }
    return false;
  }

  startDive() {
    if (this.gameOver || this.mainAirSupply <= 0) {
      if (this.mainAirSupply <= 0 && this.airTanks > 0) {
        return { success: false, message: "Out of air! Use an Air Tank to continue diving." };
      }
      return false;
    }
    this.mainAirSupply -= 20;
    if (this.mainAirSupply < 0) {
      if (this.airTanks > 0) {
        return { success: false, message: "Out of air! Use an Air Tank to continue diving." };
      }
      this.checkGameOver();
      return false;
    }
    this.inDive = true;
    this.currentHaul = 0;
    this.currentStatus = this.rollCurrentStatus();
    this.lastEvent = null;
    this.depthMeters = 5;
    this.depthFeet = 16;
    return { success: true };
  }

  rollCurrentStatus() {
    return weightedRandom(CURRENT_STATUS_PROBS).status;
  }

  useMetalDetector() {
    if (!this.inDive || this.gameOver || this.metalDetectors <= 0 || this.metalDetectorActive) {
      // Cannot use if: not in a dive, game is over, no detectors left, or one is already active for this turn
      return false;
    }

    this.metalDetectors--; // Consume one detector
    this.metalDetectorActive = true; // Activate the effect for the next dive deeper
    
    return true; // Signal to the UI that it was successful
  }

  useAirTank() {
    if (this.inDive || this.gameOver || this.airTanks <= 0) {
      // Cannot use if: in a dive, game is over, or no air tanks left
      return { success: false, message: "Cannot use Air Tank now." };
    }

    this.airTanks--; // Consume one air tank
    this.mainAirSupply += 200; // Add 200 bar to air supply
    
    // Update UI
    this.updateShopUI();
    
    return { success: true, message: "Air Tank used! Added 200 bar to your air supply." };
  }

  useSonarPing() {
    if (!this.inDive || this.gameOver || this.sonarPings <= 0) {
      // Cannot use if: not in a dive, game is over, or no sonar pings left
      return { success: false, message: "Cannot use Sonar Ping now." };
    }

    // Get the next event without actually triggering it
    const eventTables = this.metalDetectorActive ? BOOSTED_EVENT_TABLES : EVENT_TABLES;
    const nextEvent = weightedRandom(eventTables[this.currentStatus]);
    
    // Store the predicted event
    this.predictedEvent = nextEvent;
    
    // Consume one sonar ping
    this.sonarPings--;
    
    // Update UI
    this.updateShopUI();
    
    // Return the event category with immersive message
    let message;
    if (nextEvent.event === "SHARK") {
      message = "The echo comes back distorted and heavy. The sonar flags the ominous silhouette of a nearby predator. Danger ahead.";
    } else if (nextEvent.event === "LOST_BEARINGS") {
      message = "Only the faint hum of the open ocean answers your call. The sonar finds nothing of significance nearby; the path ahead is clear, but empty.";
    } else {
      message = "A clear, high-pitched chime returns! The sonar has locked onto the unmistakable signature of treasure.";
    }
    
    return { 
      success: true, 
      message: message,
      category: nextEvent.event === "SHARK" ? "danger" : 
                nextEvent.event === "LOST_BEARINGS" ? "neutral" : 
                "treasure"
    };
  }

  diveDeeper() {
    if (!this.inDive || this.gameOver) return false;
    
    const cost = this.DIVE_COSTS[this.currentStatus];
    if (this.mainAirSupply < cost) {
      if (this.airTanks > 0) {
        return { success: false, message: "Out of air! Use an Air Tank to continue diving." };
      }
      this.checkGameOver();
      return false;
    }
    
    this.mainAirSupply -= cost;
    this.depthMeters += 10;
    this.depthFeet += 32;
    
    let event;
    if (this.predictedEvent) {
      event = this.predictedEvent;
      this.predictedEvent = null;
    } else {
      const eventTables = this.metalDetectorActive ? BOOSTED_EVENT_TABLES : EVENT_TABLES;
      event = weightedRandom(eventTables[this.currentStatus]);
    }
    
    this.lastEvent = event;
    let outcome = { ...event, haulBefore: this.currentHaul };

    if (event.event === "SHARK") {
      this.sharksEncountered++;
      
      if (this.sharkRepellents > 0) {
        this.sharkRepellents--;
        outcome.repellentUsed = true;
      } else {
        this.currentHaul = 0;
        this.inDive = false;
      }
    } else if (event.event === "LOST_BEARINGS") {
      // Nothing changes
    } else {
      // Handle treasure discovery
      const item = window.ItemManager.getItem(event.event);
      if (item) {
        this.currentHaul += item.value;
        this.addToInventory(event.event);
      }
    }

    if (this.metalDetectorActive) {
      this.metalDetectorActive = false;
    }

    if (this.mainAirSupply <= 0) {
      if (this.airTanks > 0) {
        return { ...outcome, success: false, message: "Out of air! Use an Air Tank to continue diving." };
      }
      this.checkGameOver();
      this.inDive = false;
      return { ...outcome, diveEnded: true, haulAfter: this.currentHaul };
    } else if (event.event !== "SHARK") {
      this.currentStatus = this.rollCurrentStatus();
    }

    return { ...outcome, diveEnded: !this.inDive, haulAfter: this.currentHaul };
  }

  surfaceSafely() {
    if (!this.inDive || this.gameOver) return false;
    this.totalScore += this.currentHaul;
    this.wallet += this.currentHaul; // Add hauled money to wallet
    this.currentHaul = 0;
    this.inDive = false;
    this.currentStatus = null;
    this.lastEvent = null;
    this.depthMeters = 0;
    this.depthFeet = 0;
    return true;
  }
}

// --- UI Logic ---

const game = new GameManager();

const airEl = document.getElementById('air');
const scoreEl = document.getElementById('score');
const haulEl = document.getElementById('haul');
const treasuresEl = document.getElementById('treasures');
const sharksEl = document.getElementById('sharks');
const repellentsEl = document.getElementById('repellents');
const detectorsEl = document.getElementById('detectors');
const useDetectorBtn = document.getElementById('use-detector');
const diveStatusEl = document.getElementById('dive-status');
const currentStatusEmojiEl = document.getElementById('current-status-emoji');
const currentStatusTextEl = document.getElementById('current-status-text');
const logEmojiEl = document.getElementById('log-emoji');
const logTextEl = document.getElementById('log-text');
const gameoverEl = document.getElementById('gameover');
const bigScoreEl = document.getElementById('bigscore');

const startDiveBtn = document.getElementById('start-dive');
const diveDeeperBtn = document.getElementById('dive-deeper');
const surfaceBtn = document.getElementById('surface');

// ZK Proof related elements
const zkProofBtn = document.getElementById('zk-proof-btn');
const zkProofOutput = document.getElementById('zk-proof-output');
const decodeProofBtn = document.getElementById('decode-proof-btn');
const decodedProofOutput = document.getElementById('decoded-proof-output');

// Background image for each current status
const CURRENT_STATUS_IMAGE = {
  NO_CURRENT: 'https://images.unsplash.com/photo-1637563954989-0d522aa0f7f6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  SOME_CURRENT: 'https://images.unsplash.com/photo-1736769585570-e72ddc202433?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  STRONG_CURRENTS: 'https://images.unsplash.com/photo-1668199755381-3f0d5af1ad2d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
};

const statusBox = document.querySelector('.status');
const sharkImg = document.getElementById('shark-img');
const statusAlert = document.getElementById('status-alert');

function setStatusBackground(status) {
  if (!status) {
    statusBox.style.backgroundImage = '';
    return;
  }
  const img = CURRENT_STATUS_IMAGE[status];
  statusBox.style.backgroundImage = img ? `url('${img}')` : '';
}

function statusEmoji(status) {
  switch (status) {
    case 'NO_CURRENT': return '🟦';
    case 'SOME_CURRENT': return '��';
    case 'STRONG_CURRENTS': return '🌪️';
    default: return '';
  }
}

function eventEmoji(event) {
  switch (event.event) {
    case 'SHARK': return '🦈';
    case 'LOST_BEARINGS': return '❓';
    case 'OLD_COINS': return '🪙';
    case 'SHIPWRECK_DEBRIS': return '⚓️';
    case 'SUNKEN_CHEST': return '💰';
    case 'ANCIENT_RELIC': return '🏺';
    case 'ATLANTIS_DISCOVERY': return '🏛️';
    default: return '';
  }
}

function statusText(status) {
  switch (status) {
    case 'NO_CURRENT': return 'Calm';
    case 'SOME_CURRENT': return 'Choppy (Moderately challenging)';
    case 'STRONG_CURRENTS': return 'Turbulent (Dangerous!)';
    default: return '';
  }
}

function eventText(event) {
  switch (event.event) {
    case 'SHARK': return 'Shark Encounter! You lost your haul and the dive ends!';
    case 'LOST_BEARINGS': return 'Lost your bearings. No treasure found.';
    case 'OLD_COINS': return 'Found Old Coins! (+$10)';
    case 'SHIPWRECK_DEBRIS': return 'Found Shipwreck Debris! (+$20)';
    case 'SUNKEN_CHEST': return 'Found a Sunken Chest! (+$50)';
    case 'ANCIENT_RELIC': return 'Discovered an Ancient Relic! (+$100)';
    case 'ATLANTIS_DISCOVERY': return 'Incredible! Atlantis Discovery! (+$500)';
    default: return '';
  }
}

function showZKProofButton() {
    zkProofBtn.style.display = '';
}
function hideZKProofButton() {
    zkProofBtn.style.display = 'none';
    zkProofOutput.style.display = 'none';
}

function updateUI(logMsg = null, logEmoji = null) {
    airEl.textContent = game.mainAirSupply;
    scoreEl.textContent = game.totalScore;
    haulEl.textContent = game.currentHaul;
    sharksEl.textContent = game.sharksEncountered;
    repellentsEl.textContent = game.sharkRepellents;
    detectorsEl.textContent = game.metalDetectors;
    document.getElementById('money').textContent = game.wallet; // Update wallet display
    document.getElementById('depth').textContent = game.depthMeters;
    document.getElementById('depth-feet').textContent = game.depthFeet;
    useDetectorBtn.disabled = !game.inDive || game.gameOver || game.metalDetectors <= 0 || game.metalDetectorActive;
    diveStatusEl.textContent = game.inDive ? "Diving 🤿" : "At Surface 🚤";
    if (game.inDive && game.currentStatus) {
        const cost = game.DIVE_COSTS[game.currentStatus];
        const hasEnoughAir = game.mainAirSupply >= cost;
        currentStatusEmojiEl.textContent = '';
        currentStatusTextEl.innerHTML = `<div style="display: flex; justify-content: space-between; width: 100%;">
            <span>${statusEmoji(game.currentStatus)} Sea State: ${statusText(game.currentStatus)}</span>
            <span style="color: ${hasEnoughAir ? '#005580' : '#c62828'}">Dive Cost: ${cost} air</span>
        </div>`;
    } else {
        currentStatusEmojiEl.textContent = '';
        currentStatusTextEl.textContent = '';
    }
    if (logMsg !== null) {
        logEmojiEl.textContent = logEmoji || '';
        logTextEl.textContent = logMsg;
    } else if (game.lastEvent) {
        let msg = eventText(game.lastEvent);
        let emoji = eventEmoji(game.lastEvent);
        if (game.lastEvent.repellentUsed) {
            msg += ' (Shark Repellent saved your haul!)';
            emoji = '🛡️';
        }
        logEmojiEl.textContent = emoji;
        logTextEl.textContent = msg;
    } else {
        logEmojiEl.textContent = '';
        logTextEl.textContent = '';
    }
    if (game.lastEvent && game.lastEvent.event === 'SHARK') {
        sharkImg.style.display = '';
        statusAlert.textContent = 'Shark alert!';
        statusBox.style.minHeight = '60px';
        statusBox.style.backgroundImage = '';
    } else if (game.lastEvent && game.lastEvent.event === 'ATLANTIS_DISCOVERY') {
        sharkImg.style.display = 'none';
        statusAlert.textContent = '';
        statusBox.style.backgroundImage = "url('https://images.unsplash.com/photo-1594470944234-82b61c0a1af4?q=80&w=1947&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
        statusBox.style.minHeight = '320px';
    } else {
        sharkImg.style.display = 'none';
        statusAlert.textContent = '';
        if (game.inDive && game.currentStatus) {
            setStatusBackground(game.currentStatus);
            statusBox.style.minHeight = '320px';
        } else {
            statusBox.style.backgroundImage = '';
            statusBox.style.minHeight = '60px';
        }
    }
    if (game.gameOver) {
        gameoverEl.textContent = `Game Over! Final Score: ${game.totalScore}`;
        showZKProofButton();
    } else {
        gameoverEl.textContent = '';
        // Show ZK proof button if not in a dive, not game over, and score > 0
        if (!game.inDive && game.totalScore > 0) {
            showZKProofButton();
        } else {
            hideZKProofButton();
        }
    }
    bigScoreEl.textContent = `Total Score: ${game.totalScore}`;
    startDiveBtn.disabled = game.inDive || game.gameOver || game.mainAirSupply <= 0;
    diveDeeperBtn.disabled = !game.inDive || game.gameOver || game.mainAirSupply <= 0;
    surfaceBtn.disabled = !game.inDive || game.gameOver;
    document.getElementById('use-air-tank').disabled = game.inDive || game.gameOver || game.airTanks <= 0;
    document.getElementById('use-sonar').disabled = !game.inDive || game.gameOver || game.sonarPings <= 0;
}

startDiveBtn.addEventListener('click', () => {
  const result = game.startDive();
  if (result.success) {
    updateUI('You begin a new dive!', '🤿');
  } else {
    updateUI(result.message || 'Cannot start dive. Out of air or game over.', '❌');
  }
});

diveDeeperBtn.addEventListener('click', () => {
  const result = game.diveDeeper();
  if (!result) {
    updateUI('Cannot dive deeper.', '❌');
    return;
  }
  if (!result.success) {
    updateUI(result.message, '❌');
    return;
  }
  let msg = eventText(result);
  let emoji = eventEmoji(result);
  if (result.diveEnded && game.gameOver) {
    msg += ' | Out of air! Game over.';
  } else if (result.diveEnded) {
    msg += ' | The dive ends.';
  }
  updateUI(msg, emoji);
});

surfaceBtn.addEventListener('click', () => {
  if (game.surfaceSafely()) {
    updateUI('You surfaced safely and banked your haul!', '⬆️');
  } else {
    updateUI('Cannot surface now.', '❌');
  }
});

useDetectorBtn.addEventListener('click', () => {
    if (game.useMetalDetector()) {
        updateUI('Metal Detector activated! Next dive will have better treasure chances!', '🔍');
    } else {
        updateUI('Cannot use Metal Detector now.', '❌');
    }
});

zkProofBtn.addEventListener('click', async () => {
    if (!window.snarkjs || !window.snarkjs.groth16) {
        zkProofOutput.style.display = 'block';
        zkProofOutput.textContent = 'snarkjs or groth16 not loaded. Please check your internet connection or snarkjs version.';
        zkProofBtn.disabled = true;
        return;
    }
    zkProofBtn.disabled = true;
    zkProofOutput.style.display = 'block';
    zkProofOutput.textContent = 'Generating proof... (this may take a few seconds)';

    const input = {
        final_score: game.totalScore,
        air_left: game.mainAirSupply,
    };

    try {
        // Generate the proof
        const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
            input,
            'main.wasm',
            'main.groth16.zkey'
        );

        // Store the proof data for later decoding
        lastProofData = { proof, publicSignals };

        zkProofOutput.textContent = 'Proof generated! Submitting to zkVerify...';

        // Load verification key
        const vkey = await fetch('main.groth16.vkey.json').then(res => res.json());

        // Prepare params for zkVerify
        const API_URL = 'https://relayer-api.horizenlabs.io/api/v1';
        const API_KEY = '598f259f5f5d7476622ae52677395932fa98901f';

        const params = {
            proofType: "groth16",
            vkRegistered: false,
            proofOptions: {
                library: "snarkjs",
                curve: "bn128"
            },
            proofData: {
                proof: proof,
                publicSignals: publicSignals,
                vk: vkey
            }
        };

        // Submit proof
        const response = await fetch(`${API_URL}/submit-proof/${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });
        const requestResponse = await response.json();

        if (requestResponse.optimisticVerify !== "success") {
            zkProofOutput.textContent = "Proof verification failed, check proof artifacts.";
            console.error("Proof verification, check proof artifacts");
            zkProofBtn.disabled = false;
            return;
        }

        const explorerLink = requestResponse.txHash ? 
            `\n\n🔍 View Transaction: <a href="https://zkverify-testnet.subscan.io/extrinsic/${requestResponse.txHash}" target="_blank" style="color: #0066cc; text-decoration: underline; font-weight: bold;">https://zkverify-testnet.subscan.io/extrinsic/${requestResponse.txHash}</a>` : '';
        zkProofOutput.innerHTML = "Proof submitted! Waiting for finalization..." + explorerLink + "\n\nJob ID: " + requestResponse.jobId;

        // Poll for job status (max 2 minutes)
        let finalized = false;
        let attempts = 0;
        const maxAttempts = 24; // 2 minutes at 5s interval
        while (!finalized && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
            const statusResp = await fetch(`${API_URL}/job-status/${API_KEY}/${requestResponse.jobId}`);
            const jobStatusResponse = await statusResp.json();
            if (jobStatusResponse.status === "Finalized") {
                const explorerLink = jobStatusResponse.txHash ? 
                    `\nTransaction Hash: <a href="https://zkverify-testnet.subscan.io/extrinsic/${jobStatusResponse.txHash}" target="_blank">${jobStatusResponse.txHash}</a>` : '';
                zkProofOutput.innerHTML = "Job finalized successfully!" + explorerLink + "\n\n" +
                    JSON.stringify(jobStatusResponse, null, 2);
                finalized = true;

                // ADD THIS LINE:
                decodeProofBtn.style.display = 'block'; // Show the decode button
            } else {
                zkProofOutput.textContent = "Job status: " + jobStatusResponse.status +
                    "\nWaiting for job to finalize...\n\n" +
                    JSON.stringify(jobStatusResponse, null, 2);
            }
            attempts++;
        }
        if (!finalized) {
            zkProofOutput.textContent += "\nTimeout: Proof not finalized after 2 minutes.";
        }
    } catch (err) {
        zkProofOutput.textContent = 'Error generating or submitting proof:\n' + err;
    }
    zkProofBtn.disabled = false;
});

decodeProofBtn.addEventListener('click', () => {
    if (lastProofData) {
        // Format the stored proof data as a readable string
        const formattedProof = JSON.stringify(lastProofData, null, 2);

        // Display the data in the output element
        decodedProofOutput.textContent = formattedProof;

        // Toggle visibility
        if (decodedProofOutput.style.display === 'none') {
            decodedProofOutput.style.display = 'block';
        } else {
            decodedProofOutput.style.display = 'none';
        }
    } else {
        decodedProofOutput.textContent = 'No proof data available to decode.';
        decodedProofOutput.style.display = 'block';
    }
});

const resetGameBtn = document.getElementById('reset-game-btn');
resetGameBtn.addEventListener('click', () => {
    game.resetGame();
    sharkImg.style.display = 'none';
    zkProofOutput.style.display = 'none';
    updateUI('Welcome to Dive for Atlantis! Click Start Dive to begin.', '🤿');
});

// Shop button event listeners
document.querySelectorAll('.buy-item-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    const itemType = e.target.getAttribute('data-item-type');
    const result = game.buyItem(itemType);
    if (!result.success) {
      updateUI(result.message, '❌');
    } else {
      updateUI(result.message, '💰');
    }
  });
});

// Add event listener for sonar ping button
document.getElementById('use-sonar').addEventListener('click', () => {
  const result = game.useSonarPing();
  if (result.success) {
    updateUI(result.message, '📡');
  } else {
    updateUI(result.message, '❌');
  }
});

// Add event listener for air tank button
document.getElementById('use-air-tank').addEventListener('click', () => {
  const result = game.useAirTank();
  if (result.success) {
    updateUI(result.message, '💨');
  } else {
    updateUI(result.message, '❌');
  }
});

// Initial UI
updateUI('Welcome to Dive for Atlantis! Click Start Dive to begin.', '🤿'); 