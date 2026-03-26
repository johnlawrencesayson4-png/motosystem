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

// Engine Start (Momentary)
const startBtn = document.getElementById('btnStart');
startBtn.onmousedown = () => updateDB('start', "ON");
startBtn.onmouseup = () => updateDB('start', "OFF");
startBtn.ontouchstart = () => updateDB('start', "ON");
startBtn.ontouchend = () => updateDB('start', "OFF");

// Engine Stop
document.getElementById('btnStop').onclick = () => updateDB('engine', "OFF");

// Horn (Momentary)
const hornBtn = document.getElementById('btnHorn');
hornBtn.onmousedown = () => updateDB('horn', "ON");
hornBtn.onmouseup = () => updateDB('horn', "OFF");
hornBtn.ontouchstart = () => updateDB('horn', "ON");
hornBtn.ontouchend = () => updateDB('horn', "OFF");

// Hazard (Toggle)
let hazardActive = false;
const hazardBtn = document.getElementById('btnHazard');
onValue(ref(db, 'ignition/hazard'), (snapshot) => {
    hazardActive = (snapshot.val() === "ON");
    hazardBtn.innerText = `HAZARD: ${hazardActive ? "ON" : "OFF"}`;
});
hazardBtn.onclick = () => updateDB('hazard', hazardActive ? "OFF" : "ON");

// Anti-Theft
document.getElementById('securityToggle').onchange = (e) => {
    const state = e.target.checked ? "LOCKED" : "UNLOCKED";
    updateDB('security', state);
    document.getElementById('securityStatus').innerText = `System: ${state}`;
};

// Status Monitor (ENGINE ON/OFF)
onValue(ref(db, 'ignition/engine'), (snapshot) => {
    const val = snapshot.val() || "OFF";
    const statusBox = document.getElementById('statusBox');
    statusBox.innerText = `ENGINE: ${val}`;
    statusBox.className = val === "ON" ? "status on" : "status off";
});