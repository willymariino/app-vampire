// Inizializza Firebase con gli script caricati in index.html
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyB_wnFB2AWBt_IoYla54MW78nWiJ89-rwI",
    authDomain: "vtm-scheduled-interattiva.firebaseapp.com",
    projectId: "vtm-scheduled-interattiva",
    storageBucket: "vtm-scheduled-interattiva.firebasestorage.app",
    messagingSenderId: "910187466655",
    appId: "1:910187466655:web:b6c58f9c958bda8c4937aa",
    measurementId: "G-TFGYXWJ2SQ"
};
// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }





