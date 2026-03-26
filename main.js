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

// Function para mag-update ng data
const updateDB = (path, state) => set(ref(db, `ignition/${path}`), state);

// --- TOGGLE BUTTONS (Hazard & Security) ---
const hazardBtn = document.getElementById('btnHazard');
onValue(ref(db, 'ignition/hazard'), (snapshot) => {
    const isON = (snapshot.val() === "ON");
    hazardBtn.innerText = `HAZARD: ${isON ? "ON" : "OFF"}`;
});
hazardBtn.onclick = () => {
    const currentState = hazardBtn.innerText.includes("OFF") ? "ON" : "OFF";
    updateDB('hazard', currentState);
};

// --- MOMENTARY BUTTONS (Start & Horn) ---
const startBtn = document.getElementById('btnStart');
const hornBtn = document.getElementById('btnHorn');

const setStart = (s) => updateDB('start', s);
const setHorn = (s) => updateDB('horn', s);

startBtn.onmousedown = () => setStart("ON");
startBtn.onmouseup = () => setStart("OFF");
startBtn.ontouchstart = (e) => { e.preventDefault(); setStart("ON"); };
startBtn.ontouchend = (e) => { e.preventDefault(); setStart("OFF"); };

hornBtn.onmousedown = () => setHorn("ON");
hornBtn.onmouseup = () => setHorn("OFF");
hornBtn.ontouchstart = (e) => { e.preventDefault(); setHorn("ON"); };
hornBtn.ontouchend = (e) => { e.preventDefault(); setHorn("OFF"); };

// --- ENGINE STATUS UI (Dito ka may problema kanina) ---
onValue(ref(db, 'ignition/engine'), (snapshot) => {
    const val = snapshot.val() || "OFF";
    const statusBox = document.getElementById('statusBox');
    if (statusBox) {
        statusBox.innerText = `ENGINE: ${val}`;
        statusBox.className = (val === "ON") ? "status on" : "status off";
    }
});