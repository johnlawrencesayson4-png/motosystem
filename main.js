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

// Helper function para sa momentary updates (Start/Horn)
const updateDB = (path, state) => set(ref(db, `ignition/${path}`), state);

// --- 1. START ENGINE (Momentary) ---
const startBtn = document.getElementById('btnStart');
const handleStart = (state) => updateDB('start', state);

startBtn.onmousedown = () => handleStart("ON");
startBtn.onmouseup = () => handleStart("OFF");
startBtn.ontouchstart = () => handleStart("ON");
startBtn.ontouchend = () => handleStart("OFF");

// --- 2. STOP ENGINE (Toggle to OFF) ---
document.getElementById('btnStop').onclick = () => {
    updateDB('engine', "OFF");
};

// --- 3. HORN (Momentary) ---
const hornBtn = document.getElementById('btnHorn');
const handleHorn = (state) => updateDB('horn', state);

hornBtn.onmousedown = () => handleHorn("ON");
hornBtn.onmouseup = () => handleHorn("OFF");
hornBtn.ontouchstart = () => handleHorn("ON");
hornBtn.ontouchend = () => handleHorn("OFF");

// --- 4. HAZARD (Toggle) ---
let hazardActive = false;
const hazardBtn = document.getElementById('btnHazard');

// Listen sa actual state ng hazard sa DB
onValue(ref(db, 'ignition/hazard'), (snapshot) => {
    hazardActive = (snapshot.val() === "ON");
    hazardBtn.innerText = `HAZARD: ${hazardActive ? "ON" : "OFF"}`;
    hazardBtn.style.opacity = hazardActive ? "0.8" : "1";
});

hazardBtn.onclick = () => {
    updateDB('hazard', hazardActive ? "OFF" : "ON");
};

// --- 5. ANTI-THEFT ---
const securityToggle = document.getElementById('securityToggle');
securityToggle.onchange = (e) => {
    const state = e.target.checked ? "LOCKED" : "UNLOCKED";
    updateDB('security', state);
    document.getElementById('securityStatus').innerText = `System: ${state}`;
};

// --- 6. STATUS MONITOR (ENGINE ON/OFF) ---
onValue(ref(db, 'ignition/engine'), (snapshot) => {
    const val = snapshot.val() || "OFF";
    const statusBox = document.getElementById('statusBox');
    statusBox.innerText = `ENGINE: ${val}`;
    
    if (val === "ON") {
        statusBox.className = "status on";
    } else {
        statusBox.className = "status off";
    }
});