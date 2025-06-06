# Dive for Atlantis

Dive for Atlantis is a browser-based game where you play as a scuba diver searching for legendary treasures. The game features zero-knowledge proof integration, allowing players to generate cryptographic proofs of their achievements.

## How to Play

1. Open the game in your browser (deployed on Vercel or locally via a static server).
2. Play as a diver, collect treasures, and manage your air supply.
3. After surfacing, generate a zero-knowledge proof of your score directly in the browser.

## Development

- All static files (HTML, JS, WASM, zkey, verification key) are in the project root or subfolders.
- Proof artifacts (`score_proof_js/score_proof.wasm`, `score_proof_final.zkey`, `verification_key.json`) are required for ZK proof generation.
- The game logic is in `game.js` and the UI is in `index.html`.
- The game uses [snarkjs](https://github.com/iden3/snarkjs) loaded from a CDN for in-browser proof generation.

## Deployment

- Deploy to [Vercel](https://vercel.com/) as a static site.
- No backend is required; all logic runs in the browser.
- To deploy:
  1. Push your code to GitHub.
  2. Import the repo into Vercel and deploy as a static site.

## License

MIT or specify your own license. 