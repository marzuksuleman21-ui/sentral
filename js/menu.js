let menus = [];
let currentCategory = "Basic Coffee";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
  loadMenus();
  updateCartCount();
});

// =========================
// LOAD DATA DARI menus.json
// =========================
async function loadMenus() {
  const res = await fetch("menus.json");
  menus = await res.json();

  renderCategories();
  renderMenu();
}

// =========================
// BUAT TOMBOL KATEGORI
// =========================
function renderCategories() {
  const categories = [...new Set(menus.map(m => m.category))];

  let box = document.getElementById("categoryButtons");
  box.innerHTML = "";

  categories.forEach(cat => {
    let btn = document.createElement("button");
    btn.className = "cat-btn";
    btn.innerText = cat;

    btn.onclick = () => {
      currentCategory = cat;
      renderMenu();
    };

    box.appendChild(btn);
  });
}

// =========================
// TAMPILKAN MENU BERDASARKAN KATEGORI
// =========================
function renderMenu() {
  let list = document.getElementById("menuList");
  list.innerHTML = "";

  menus
    .filter(item => item.category === currentCategory)
    .forEach(item => {
      list.innerHTML += `
        <div class="menu-item">
          <img src="${item.photo}" class="menu-img">
          <h3>${item.name}</h3>
          <p>Rp ${item.price}</p>
          <button class="add-btn" onclick="addToCart('${item.name}')">
            Tambah 🛒
          </button>
        </div>
      `;
    });
}

// =========================
// TAMBAH KE KERANJANG
// =========================
function addToCart(name) {
  const product = menus.find(m => m.name === name);

  let exist = cart.find(i => i.name === name);

  if (exist) {
    exist.qty++;
  } else {
    cart.push({
      name: product.name,
      price: product.price,
      photo: product.photo,
      qty: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// =========================
// UPDATE BADGE KERANJANG
// =========================
function updateCartCount() {
  document.getElementById("cartCount").innerText = cart.length;
}

// =========================
// BUKA HALAMAN CHECKOUT
// =========================
function goCheckout() {
  window.location.href = "checkout.html";
}
