import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAcm1CkxsM_UnbiGYirI_AG6dBzt6Yk5Vc",
    authDomain: "motorsystem-7b532.firebaseapp.com",
    // IMPORTANTE: Siguraduhin na may .asia-southeast1 sa link
    databaseURL: "https://motorsystem-7b532-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "motorsystem-7b532",
    storageBucket: "motorsystem-7b532.appspot.com",
    messagingSenderId: "1028712392437",
    appId: "1:1028712392437:web:8e3649520b299e50401d89"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// I-setup ang buttons
document.getElementById('btnStart').onclick = () => {
    console.log("Starting...");
    set(ref(db, 'ignition/engine'), "ON");
};

document.getElementById('btnStop').onclick = () => {
    console.log("Stopping...");
    set(ref(db, 'ignition/engine'), "OFF");
};

document.getElementById('securityToggle').onchange = (e) => {
    const state = e.target.checked ? "LOCKED" : "UNLOCKED";
    set(ref(db, 'ignition/security'), state);
};