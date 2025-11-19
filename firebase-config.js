import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyB8QWp9JnGOFPj3Qwv_98LZbT4Xla_V_Gs",
  authDomain: "sentralcoffe-afb85.firebaseapp.com",
  projectId: "sentralcoffe-afb85",
  storageBucket: "sentralcoffe-afb85.appspot.com",   // FIX WAJIB
  messagingSenderId: "743371589232",
  appId: "1:743371589232:web:75d35a0f1e6a7f5e9fd6b5"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
