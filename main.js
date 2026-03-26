import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

// Tinitiyak na tama ang database URL base sa console mo
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

// Helper function para sa mabilisang update sa ignition folder
const updateDB = (path, state) => set(ref(db, `ignition/${path}`), state);

// --- 1. START ENGINE (Momentary Control) ---
const startBtn = document.getElementById('btnStart');
const handleStart = (state) => updateDB('start', state);

// Mouse (Laptop)
startBtn.addEventListener('mousedown', () => handleStart("ON"));
startBtn.addEventListener('mouseup', () => handleStart("OFF"));
startBtn.addEventListener('mouseleave', () => handleStart("OFF")); // Safety: OFF pag lumabas ang mouse

// Touch (Cellphone)
startBtn.addEventListener('touchstart', (e) => { e.preventDefault(); handleStart("ON"); });
startBtn.addEventListener('touchend', (e) => { e.preventDefault(); handleStart("OFF"); });

// --- 2. STOP ENGINE (Toggle to OFF) ---
document.getElementById('btnStop').onclick = () => {
    updateDB('engine', "OFF");
    console.log("ENGINE: OFF Command Sent");
};

// --- 3. HORN (Momentary Control) ---
const hornBtn = document.getElementById('btnHorn');
const handleHorn = (state) => updateDB('horn', state);

hornBtn.addEventListener('mousedown', () => handleHorn("ON"));
hornBtn.addEventListener('mouseup', () => handleHorn("OFF"));
hornBtn.addEventListener('mouseleave', () => handleHorn("OFF"));

hornBtn.addEventListener('touchstart', (e) => { e.preventDefault(); handleHorn("ON"); });
hornBtn.addEventListener('touchend', (e) => { e.preventDefault(); handleHorn("OFF"); });

// --- 4. HAZARD (Toggle Control) ---
let hazardActive = false;
const hazardBtn = document.getElementById('btnHazard');

onValue(ref(db, 'ignition/hazard'), (snapshot) => {
    hazardActive = (snapshot.val() === "ON");
    hazardBtn.innerText = `HAZARD: ${hazardActive ? "ON" : "OFF"}`;
    hazardBtn.style.opacity = hazardActive ? "0.8" : "1";
});

hazardBtn.onclick = () => {
    updateDB('hazard', hazardActive ? "OFF" : "ON");
};

// --- 5. ANTI-THEFT (Toggle) ---
const securityToggle = document.getElementById('securityToggle');
securityToggle.onchange = (e) => {
    const state = e.target.checked ? "LOCKED" : "UNLOCKED";
    updateDB('security', state);
    document.getElementById('securityStatus').innerText = `System: ${state}`;
};

// --- 6. REAL-TIME ENGINE STATUS MONITOR ---
// Ito ang nag-uupdate ng kulay ng box sa dashboard
onValue(ref(db, 'ignition/engine'), (snapshot) => {
    const val = snapshot.val() || "OFF";
    const statusBox = document.getElementById('statusBox');
    statusBox.innerText = `ENGINE: ${val}`;
    
    // Automatic switch ng CSS classes
    if (val === "ON") {
        statusBox.className = "status on";
    } else {
        statusBox.className = "status off";
    }
});