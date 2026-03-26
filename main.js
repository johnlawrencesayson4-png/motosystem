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

const updateDB = (path, state) => set(ref(db, `ignition/${path}`), state);

// --- 1. ENGINE START (Momentary) ---
const startBtn = document.getElementById('btnStart');
const handleStart = (s) => updateDB('start', s);
startBtn.onmousedown = () => handleStart("ON");
startBtn.onmouseup = () => handleStart("OFF");
startBtn.ontouchstart = (e) => { e.preventDefault(); handleStart("ON"); };
startBtn.ontouchend = (e) => { e.preventDefault(); handleStart("OFF"); };

// --- 2. ENGINE STOP ---
document.getElementById('btnStop').onclick = () => updateDB('engine', "OFF");

// --- 3. HORN (Momentary) ---
const hornBtn = document.getElementById('btnHorn');
const handleHorn = (s) => updateDB('horn', s);
hornBtn.onmousedown = () => handleHorn("ON");
hornBtn.onmouseup = () => handleHorn("OFF");
hornBtn.ontouchstart = (e) => { e.preventDefault(); handleHorn("ON"); };
hornBtn.ontouchend = (e) => { e.preventDefault(); handleHorn("OFF"); };

// --- 4. HAZARD (Toggle) ---
let hazardActive = false;
const hazardBtn = document.getElementById('btnHazard');
onValue(ref(db, 'ignition/hazard'), (snapshot) => {
    hazardActive = (snapshot.val() === "ON");
    hazardBtn.innerText = `HAZARD: ${hazardActive ? "ON" : "OFF"}`;
});
hazardBtn.onclick = () => updateDB('hazard', hazardActive ? "OFF" : "ON");

// --- 5. ANTI-THEFT ---
const securityToggle = document.getElementById('securityToggle');
securityToggle.onchange = (e) => {
    const state = e.target.checked ? "LOCKED" : "UNLOCKED";
    updateDB('security', state);
    document.getElementById('securityStatus').innerText = `System: ${state}`;
};

// --- 6. REAL-TIME ENGINE STATUS ---
onValue(ref(db, 'ignition/engine'), (snapshot) => {
    const val = snapshot.val() || "OFF";
    const statusBox = document.getElementById('statusBox');
    statusBox.innerText = `ENGINE: ${val}`;
    statusBox.className = val === "ON" ? "status on" : "status off";
});