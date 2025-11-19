let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateTotal();
});

// ========================
// TAMPILKAN ISI KERANJANG
// ========================
function renderCart() {
  let box = document.getElementById("cartItems");

  if (cart.length === 0) {
    box.innerHTML = "<p>Keranjang kosong.</p>";
    return;
  }

  box.innerHTML = "";

  cart.forEach((item, index) => {
    box.innerHTML += `
      <div class="cart-item">
        <img src="${item.photo}" class="cart-img">

        <div class="cart-info">
          <h3>${item.name}</h3>
          <p>Rp ${item.price}</p>

          <div class="qty-box">
            <button onclick="changeQty(${index}, -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${index}, 1)">+</button>
          </div>
        </div>
      </div>
    `;
  });
}

// ========================
// UBAH QTY (+ / -)
// ========================
function changeQty(index, value) {
  cart[index].qty += value;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateTotal();
}

// ========================
// HITUNG TOTAL
// ========================
function updateTotal() {
  let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  document.getElementById("total").innerText =
    "Total Pembayaran: Rp " + total;
}

// ========================
// BAYAR SEKARANG
// ========================
function payNow() {
  if (cart.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  alert("Pembayaran berhasil! Terima kasih 😊");

  localStorage.removeItem("cart");
  window.location.href = "menu.html";
}
