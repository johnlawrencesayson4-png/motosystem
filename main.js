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

const updateDB = (path, state) => {
    set(ref(db, `ignition/${path}`), state);
    console.log(`Sent to Firebase: ${path} -> ${state}`);
};

// --- MEMENTARY BUTTONS (Start & Horn) ---
const setupMomentary = (btnId, dbPath) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    const startAction = (e) => {
        e.preventDefault(); // Iwas zoom sa mobile
        updateDB(dbPath, "ON");
    };
    const stopAction = () => updateDB(dbPath, "OFF");

    // Mouse Events
    btn.onmousedown = startAction;
    btn.onmouseup = stopAction;
    btn.onmouseleave = stopAction;

    // Touch Events (Para sa Cellphone)
    btn.addEventListener('touchstart', startAction, { passive: false });
    btn.addEventListener('touchend', stopAction);
};

setupMomentary('btnStart', 'start');
setupMomentary('btnHorn', 'horn');

// --- TOGGLE BUTTONS (Hazard & Security) ---
const hazardBtn = document.getElementById('btnHazard');
let currentHazard = "OFF";

onValue(ref(db, 'ignition/hazard'), (snapshot) => {
    currentHazard = snapshot.val() || "OFF";
    hazardBtn.innerText = `HAZARD: ${currentHazard}`;
});

hazardBtn.onclick = () => {
    updateDB('hazard', currentHazard === "OFF" ? "ON" : "OFF");
};

const securityToggle = document.getElementById('securityToggle');
securityToggle.onchange = (e) => {
    updateDB('security', e.target.checked ? "LOCKED" : "UNLOCKED");
};

// --- ENGINE STATUS MONITOR ---
onValue(ref(db, 'ignition/engine'), (snapshot) => {
    const val = snapshot.val() || "OFF";
    const statusBox = document.getElementById('statusBox');
    statusBox.innerText = `ENGINE: ${val}`;
    statusBox.className = (val === "ON") ? "status on" : "status off";
});