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

// Helper function para sa Firebase updates
const updateDB = (path, state) => set(ref(db, `ignition/${path}`), state);

// --- 1. ENGINE CONTROL (START & STOP) ---
// Inalis na natin ang 'start' path, 'engine' status na lang ang gagamitin
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');

if (btnStart) {
    btnStart.onclick = () => updateDB('engine', "ON");
}

if (btnStop) {
    btnStop.onclick = () => updateDB('engine', "OFF");
}


// --- 2. HORN (Momentary Control) ---
const hornBtn = document.getElementById('btnHorn');

if (hornBtn) {
    const hornOn = (e) => {
        if (e.cancelable) e.preventDefault();
        updateDB('horn', "ON");
    };
    const hornOff = () => updateDB('horn', "OFF");

    // Mouse events
    hornBtn.onmousedown = hornOn;
    hornBtn.onmouseup = hornOff;
    hornBtn.onmouseleave = hornOff;

    // Touch events for Mobile
    hornBtn.addEventListener('touchstart', hornOn, { passive: false });
    hornBtn.addEventListener('touchend', hornOff);
}


// --- 3. HAZARD (Toggle Control) ---
const hazardBtn = document.getElementById('btnHazard');
let hazardActive = false;

onValue(ref(db, 'ignition/hazard'), (snapshot) => {
    hazardActive = (snapshot.val() === "ON");
    if (hazardBtn) {
        hazardBtn.innerText = `HAZARD: ${hazardActive ? "ON" : "OFF"}`;
    }
});

if (hazardBtn) {
    hazardBtn.onclick = () => {
        updateDB('hazard', hazardActive ? "OFF" : "ON");
    };
}


// --- 4. ANTI-THEFT / SECURITY (Toggle) ---
const securityToggle = document.getElementById('securityToggle');
const securityStatus = document.getElementById('securityStatus');

if (securityToggle) {
    securityToggle.onchange = (e) => {
        const state = e.target.checked ? "LOCKED" : "UNLOCKED";
        updateDB('security', state);
        if (securityStatus) {
            securityStatus.innerText = `System: ${state}`;
        }
    };
}


// --- 5. ENGINE STATUS MONITOR (Dashboard UI Update) ---
// Ito ang nagpapalit ng kulay ng ENGINE box sa Dashboard
onValue(ref(db, 'ignition/engine'), (snapshot) => {
    const val = snapshot.val() || "OFF";
    const statusBox = document.getElementById('statusBox');
    
    if (statusBox) {
        statusBox.innerText = `ENGINE: ${val}`;
        
        // CSS class switcher para sa kulay
        if (val === "ON") {
            statusBox.className = "status on"; // Magiging Green
        } else {
            statusBox.className = "status off"; // Magiging Red
        }
    }
});