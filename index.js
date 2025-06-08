import * as snarkjs from 'snarkjs';

console.log("snarkjs loaded:", typeof snarkjs === "object");

import axios from 'axios';
import fs from 'fs';

// Set your API URL and API KEY
const API_URL = 'https://relayer-api.horizenlabs.io/api/v1';
const API_KEY = '598f259f5f5d7476622ae52677395932fa98901f'; // Replace with your actual API key

// Read your proof, public inputs, and verification key files
const proof = JSON.parse(fs.readFileSync('./proof.json'));
const publicInputs = JSON.parse(fs.readFileSync('./public.json'));
const vkey = JSON.parse(fs.readFileSync('./main.groth16.vkey.json'));

async function main() {
  try {
    const params = {
      proofType: "groth16",
      vkRegistered: false,
      proofOptions: {
        library: "snarkjs",
        curve: "bn128"
      },
      proofData: {
        proof: proof,
        publicSignals: publicInputs,
        vk: vkey
      }
    };

    const requestResponse = await axios.post(`${API_URL}/submit-proof/${API_KEY}`, params);
    console.log(requestResponse.data);

    // Poll for job status
    while (true) {
      const jobStatusResponse = await axios.get(`${API_URL}/job-status/${API_KEY}/${requestResponse.data.jobId}`);
      if (jobStatusResponse.data.status === "Finalized") {
        console.log("Job finalized successfully");
        console.log(jobStatusResponse.data);
        break;
      } else {
        console.log("Job status: ", jobStatusResponse.data.status);
        console.log("Waiting for job to finalize...");
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

main();