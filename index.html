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
    { event: "OLD_COINS", prob: 0.315, points: 10 },
    { event: "SHIPWRECK_DEBRIS", prob: 0.21, points: 20 },
    { event: "SUNKEN_CHEST", prob: 0.1575, points: 50 },
    { event: "ANCIENT_RELIC", prob: 0.0675, points: 100 }
  ],
  SOME_CURRENT: [
    { event: "LOST_BEARINGS", prob: 0.3 },
    { event: "SHARK", prob: 0.1 },
    { event: "OLD_COINS", prob: 0.225, points: 10 },
    { event: "SHIPWRECK_DEBRIS", prob: 0.16875, points: 20 },
    { event: "SUNKEN_CHEST", prob: 0.1125, points: 50 },
    { event: "ANCIENT_RELIC", prob: 0.09375, points: 100 }
  ],
  STRONG_CURRENTS: [
    { event: "LOST_BEARINGS", prob: 0.7 },
    { event: "SHARK", prob: 0.1 },
    { event: "ATLANTIS_DISCOVERY", prob: 0.2, points: 500 }
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

class DiveforAtlantisGame {
  constructor() {
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
  }

  checkGameOver() {
    if (this.mainAirSupply <= 0) {
      this.gameOver = true;
      this.inDive = false;
      this.currentHaul = 0;
    }
  }

  startDive() {
    if (this.gameOver || this.mainAirSupply <= 0) return false;
    this.mainAirSupply -= 20;
    if (this.mainAirSupply < 0) {
      this.checkGameOver();
      return false;
    }
    this.inDive = true;
    this.currentHaul = 0;
    this.currentStatus = this.rollCurrentStatus();
    this.lastEvent = null;
    return true;
  }

  rollCurrentStatus() {
    return weightedRandom(CURRENT_STATUS_PROBS).status;
  }

  diveDeeper() {
    if (!this.inDive || this.gameOver || this.mainAirSupply <= 0) return null;
    this.mainAirSupply -= 20;
    const event = weightedRandom(EVENT_TABLES[this.currentStatus]);
    this.lastEvent = event;
    let outcome = { ...event, haulBefore: this.currentHaul };

    if (event.event === "SHARK") {
      this.currentHaul = 0;
      this.inDive = false;
      this.checkGameOver();
      return { ...outcome, diveEnded: true, haulAfter: this.currentHaul };
    } else if (event.event === "LOST_BEARINGS") {
      // Nothing changes
    } else if (["ATLANTIS_DISCOVERY", "OLD_COINS", "SHIPWRECK_DEBRIS", "SUNKEN_CHEST", "ANCIENT_RELIC"].includes(event.event)) {
      this.currentHaul += event.points;
    }

    if (this.mainAirSupply <= 0) {
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
    this.currentHaul = 0;
    this.inDive = false;
    this.currentStatus = null;
    this.lastEvent = null;
    return true;
  }
}

// --- UI Logic ---

const game = new DiveforAtlantisGame();

const airEl = document.getElementById('air');
const scoreEl = document.getElementById('score');
const haulEl = document.getElementById('haul');
diveStatusEl = document.getElementById('dive-status');
const currentStatusEmojiEl = document.getElementById('current-status-emoji');
const currentStatusTextEl = document.getElementById('current-status-text');
const logEmojiEl = document.getElementById('log-emoji');
const logTextEl = document.getElementById('log-text');
const gameoverEl = document.getElementById('gameover');
const bigScoreEl = document.getElementById('bigscore');

const startDiveBtn = document.getElementById('start-dive');
const diveDeeperBtn = document.getElementById('dive-deeper');
const surfaceBtn = document.getElementById('surface');

const zkProofBtn = document.getElementById('zk-proof-btn');
const zkProofOutput = document.getElementById('zk-proof-output');

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
    case 'SOME_CURRENT': return '🌊';
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
    case 'OLD_COINS': return 'Found Old Coins! (+10 points)';
    case 'SHIPWRECK_DEBRIS': return 'Found Shipwreck Debris! (+20 points)';
    case 'SUNKEN_CHEST': return 'Found a Sunken Chest! (+50 points)';
    case 'ANCIENT_RELIC': return 'Discovered an Ancient Relic! (+100 points)';
    case 'ATLANTIS_DISCOVERY': return 'Incredible! Atlantis Discovery! (+500 points)';
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
    diveStatusEl.textContent = game.inDive ? 'Diving' : 'At Surface';
    if (game.inDive && game.currentStatus) {
        currentStatusEmojiEl.textContent = statusEmoji(game.currentStatus);
        currentStatusTextEl.textContent = `Sea State: ${statusText(game.currentStatus)}`;
    } else {
        currentStatusEmojiEl.textContent = '';
        currentStatusTextEl.textContent = '';
    }
    if (logMsg !== null) {
        logEmojiEl.textContent = logEmoji || '';
        logTextEl.textContent = logMsg;
    } else if (game.lastEvent) {
        logEmojiEl.textContent = eventEmoji(game.lastEvent);
        logTextEl.textContent = eventText(game.lastEvent);
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
}

startDiveBtn.addEventListener('click', () => {
  if (game.startDive()) {
    updateUI('You begin a new dive!', '🤿');
  } else {
    updateUI('Cannot start dive. Out of air or game over.', '❌');
  }
});

diveDeeperBtn.addEventListener('click', () => {
  const result = game.diveDeeper();
  if (!result) {
    updateUI('Cannot dive deeper.', '❌');
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

const resetGameBtn = document.getElementById('reset-game-btn');
resetGameBtn.addEventListener('click', () => {
    game.resetGame();
    sharkImg.style.display = 'none';
    zkProofOutput.style.display = 'none';
    updateUI('Welcome to Dive for Atlantis! Click Start Dive to begin.', '🤿');
});

// Initial UI
updateUI('Welcome to Dive for Atlantis! Click Start Dive to begin.', '🤿'); 
