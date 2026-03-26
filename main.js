import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAcm1CkxsM_UnbiGYirI_AG6dBzt6Yk5Vc",
    authDomain: "motorsystem-7b532.firebaseapp.com",
    databaseURL: "https://motorsystem-7b532-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "motorsystem-7b532",
    storageBucket: "motorsystem-7b532.appspot.com",
    messagingSenderId: "1028712392437",
    appId: "1:1028712392437:web:8e3649520b299e50401d89"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Helper function para sa momentary switches
const handleMomentary = (path, state) => {
    set(ref(db, `ignition/${path}`), state);
    console.log(`${path.toUpperCase()}: ${state}`);
};

// --- 1. ENGINE CONTROL ---

// Engine Start (Momentary: ON habang pinipindot, OFF kapag binitawan)
const startBtn = document.getElementById('btnStart');
const stopBtn = document.getElementById('btnStop');

startBtn.onmousedown = () => handleMomentary('start', 'ON'); // Tutunog ang starter
startBtn.onmouseup = () => handleMomentary('start', 'OFF');  // Titigil ang starter
startBtn.ontouchstart = () => handleMomentary('start', 'ON'); // Para sa mobile
startBtn.ontouchend = () => handleMomentary('start', 'OFF');

// Engine Stop (Toggle: ON/OFF)
stopBtn.onclick = () => {
    // Kapag pinindot ang stop, siguraduhing OFF ang engine
    set(ref(db, 'ignition/engine'), 'OFF');
    console.log("ENGINE: OFF (Command Sent)");
};

// --- 2. HORN CONTROL ---

// Horn Control (Momentary: Tutunog habang pinipindot)
const hornBtn = document.getElementById('btnHorn');
hornBtn.onmousedown = () => handleMomentary('horn', 'ON');
hornBtn.onmouseup = () => handleMomentary('horn', 'OFF');
hornBtn.ontouchstart = () => handleMomentary('horn', 'ON');
hornBtn.ontouchend = () => handleMomentary('horn', 'OFF');

// --- 3. HAZARD CONTROL ---

// Hazard Control (Toggle: Isang pindot para ON, isang pindot para OFF)
const hazardBtn = document.getElementById('btnHazard');
let hazardActive = false;

// Kumuha muna ng initial state mula sa DB
onValue(ref(db, 'ignition/hazard'), (snapshot) => {
    const value = snapshot.val();
    hazardActive = (value === 'ON');
    updateHazardUI();
});

const updateHazardUI = () => {
    const state = hazardActive ? "ON" : "OFF";
    hazardBtn.innerText = `HAZARD: ${state}`;
    if (hazardActive) {
        hazardBtn.style.backgroundColor = '#e68a00'; // Darker orange kapag ON
    } else {
        hazardBtn.style.backgroundColor = '#ff9800'; // Default orange
    }
};

hazardBtn.onclick = () => {
    hazardActive = !hazardActive; // I-toggle ang local variable
    set(ref(db, 'ignition/hazard'), hazardActive ? "ON" : "OFF");
    console.log(`HAZARD: ${hazardActive ? "ON" : "OFF"}`);
};

// --- 4. ANTI-THEFT LOGIC ---
document.getElementById('securityToggle').onchange = (e) => {
    const state = e.target.checked ? "LOCKED" : "UNLOCKED";
    set(ref(db, 'ignition/security'), state);
    document.getElementById('securityStatus').innerText = `System: ${state}`;
    console.log(`SECURITY: ${state}`);
};

// --- 5. REAL-TIME STATUS UPDATE ---
// Basahin ang 'ignition/engine' state para sa display
onValue(ref(db, 'ignition/engine'), (snapshot) => {
    const value = snapshot.val();
    const statusBox = document.getElementById('statusBox');
    statusBox.innerText = `ENGINE: ${value}`;
    
    // Palitan ang kulay depende sa status
    if (value === 'ON') {
        statusBox.className = 'status on';
    } else {
        statusBox.className = 'status off';
    }
});