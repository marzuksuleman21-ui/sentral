import { db } from "./firebase-config.js";
import {
  collection, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let menus = [];
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

const menusRef = collection(db, "menus");

// Ambil menu realtime dari Firebase
onSnapshot(menusRef, snap => {
  menus = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  renderCategories();
  renderMenu();
  updateCartCount();
});

let currentCategory = "Basic Coffee";

const categories = [
  "Basic Coffee",
  "Coffee",
  "Mojito",
  "Tea & Non-Coffee",
  "Bakery & Snacks"
];

// RENDER KATEGORI
function renderCategories() {
  const box = document.getElementById("categoryButtons");
  box.innerHTML = "";

  categories.forEach(cat => {
    let btn = document.createElement("button");
    btn.className = "cat-btn";
    btn.innerText = cat;
    btn.onclick = () => { currentCategory = cat; renderMenu(); };
    box.appendChild(btn);
  });
}

// ANIMASI ADD TO CART
function playAddAnimation(btn) {
  btn.classList.add("added");
  setTimeout(() => btn.classList.remove("added"), 300);
}

// RENDER MENU
function renderMenu() {
  const list = document.getElementById("menuList");
  list.innerHTML = "";

  menus.forEach(item => {
    if (item.category !== currentCategory) return;

    list.innerHTML += `
      <div class="menu-item">
        <img src="${item.photo}" class="menu-img"/>
        <h3>${item.name}</h3>
        <p>Rp ${item.price}</p>
        <button class="btnAdd" data-id="${item.id}">🛒 Tambah</button>
      </div>
    `;
  });

  document.querySelectorAll(".btnAdd").forEach(btn => {
    btn.onclick = () => {
      playAddAnimation(btn);
      let id = btn.dataset.id;
      let item = menus.find(m => m.id === id);
      addToCart(item);
    };
  });
}

// ADD CART
function addToCart(item) {
  let exist = cart.find(i => i.id === item.id);
  if (exist) exist.qty++;
  else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      photo: item.photo,
      qty: 1
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// UPDATE BADGE
function updateCartCount() {
  let totalQty = cart.reduce((a, b) => a + b.qty, 0);
  let unique = cart.length;
  document.getElementById("cartCount").innerText = `${unique} (${totalQty})`;
}

// GO TO CHECKOUT
window.goCheckout = () => {
  window.location.href = "checkout.html";
};
