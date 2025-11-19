import { db } from "./firebase-config.js";
import {
  collection, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let menus = [];
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

const menusRef = collection(db, "menus");

onSnapshot(menusRef, snap => {
  menus = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  renderCategories();
  renderMenu();
});
