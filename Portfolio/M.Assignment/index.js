// ✅ Theme Toggle
const toggleBtn = document.getElementById('theme-toggle');
const homeSection = document.getElementById('home');

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');

  if (document.body.classList.contains('light-mode')) {
    toggleBtn.textContent = '🌙';
    homeSection.style.background = "url('luxury2.jpg') center/cover no-repeat";
  } else {
    toggleBtn.textContent = '☀️';
    homeSection.style.background = "url('luxury.jpg') center/cover no-repeat";
  }
});

// ✅ Current Year
document.getElementById('year').textContent = new Date().getFullYear();

// ✅ Fade-in Animation
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.2 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


// ✅ Quick View Modal
const modal = document.getElementById("quick-view-modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalColor = document.getElementById("modal-color");
const closeBtn = document.querySelector(".close-btn");

document.querySelectorAll(".view-details").forEach(button => {
  button.addEventListener("click", e => {
    const card = e.target.closest(".product-card, .collection-item");
    const imgSrc = card.querySelector("img").src;
    const name = card.querySelector("h4").textContent;
    const price = card.querySelector("p") ? card.querySelector("p").textContent : "Price not listed";

    const productColors = {
      "Classic Elegance": "Classic Dark Brown and Silver",
      "Sport Edition": "Leather Brown and Black",
      "Minimal Silver": "Elegant Black and Brown",
      "Luxury Gold": "Royal Gold",
      "Rolex Prestige 2025": "Vintage Brown and Silver",
      "Omega Seamaster 2025": "Classic Brown",
      "Rado HyperChrome": "Ceramic Black and Brown"
    };

    const color = productColors[name] || "Not specified";

    modalImg.src = imgSrc;
    modalTitle.textContent = name;
    modalPrice.textContent = `Price: ${price}`;
    modalColor.textContent = `Color: ${color}`;

    modal.style.display = "flex";
  });
});

closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => {
  if (e.target === modal) modal.style.display = "none";
});


// ✅ Cart Functionality
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartClose = document.querySelector(".cart-close");
const orderBtn = document.getElementById("order-btn");

const cart = []; // store items

function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-info">
        <h4>${item.name}</h4>
        <p>${item.price}</p>
        <p>Color: ${item.color}</p>
      </div>
      <div class="cart-actions">
        <input type="number" class="cart-qty" min="1" value="${item.qty}" data-index="${index}">
        <i class="fas fa-trash remove-item" data-index="${index}" style="cursor:pointer;color:#C5A572;"></i>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  // Remove Item Handler
  document.querySelectorAll(".remove-item").forEach(icon => {
    icon.addEventListener("click", e => {
      const i = e.target.dataset.index;
      cart.splice(i, 1);
      renderCart();
    });
  });

  // Quantity Update
  document.querySelectorAll(".cart-qty").forEach(input => {
    input.addEventListener("change", e => {
      const i = e.target.dataset.index;
      cart[i].qty = parseInt(e.target.value);
    });
  });
}

// Add to Cart Buttons
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", e => {
    const card = e.target.closest(".product-card, .collection-item");
    const img = card.querySelector("img").src;
    const name = card.querySelector("h4").textContent;
    const price = card.querySelector("p") ? card.querySelector("p").textContent : "Price not listed";

    const productColors = {
      "Classic Elegance": "Classic Dark Brown and Silver",
      "Sport Edition": "Leather Brown and Black",
      "Minimal Silver": "Elegant Black and Brown",
      "Luxury Gold": "Royal Gold",
      "Rolex Prestige 2025": "Vintage Brown and Silver",
      "Omega Seamaster 2025": "Classic Brown",
      "Rado HyperChrome": "Ceramic Black and Brown"
    };

    const color = productColors[name] || "Not specified";

    // Check if item already in cart
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ img, name, price, color, qty: 1 });
    }

    renderCart();
    cartModal.style.display = "flex";
  });
});

cartClose.addEventListener("click", () => cartModal.style.display = "none");
window.addEventListener("click", e => {
  if (e.target === cartModal) cartModal.style.display = "none";
});

orderBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Thank you for your order ✅! We'll contact you soon.");
  cart.length = 0;
  renderCart();
  cartModal.style.display = "none";
});


// ✅ Product Data for Search
const products = [
  { name: "Classic Elegance", price: "$250", color: "Classic Dark Brown and Silver", image: "watch1.jpg" },
  { name: "Sport Edition", price: "$320", color: "Leather Brown and Black", image: "watch2.jpg" },
  { name: "Minimal Silver", price: "$280", color: "Elegant Black and Brown", image: "watch3.jpg" },
  { name: "Luxury Gold", price: "$540", color: "Royal Gold", image: "watch4.jpg" },
  { name: "Rolex Prestige 2025", price: "$1,200", color: "Vintage Brown and Silver", image: "rolex.jpg" },
  { name: "Omega Seamaster 2025", price: "$1,050", color: "Classic Brown", image: "omega.jpg" },
  { name: "Rado HyperChrome", price: "$890", color: "Ceramic Black and Brown", image: "rado.jpg" }
];

// ✅ Search Modal
const searchBar = document.querySelector(".search-bar");
const searchModal = document.getElementById("search-modal");
const closeSearch = document.querySelector(".search-close");
const addCartBtn = document.getElementById("add-cart-btn");

function showProduct(product) {
  document.getElementById("search-img").src = product.image;
  document.getElementById("search-name").textContent = product.name;
  document.getElementById("search-price").textContent = `Price: ${product.price}`;
  document.getElementById("search-color").textContent = `Color: ${product.color}`;
  searchModal.style.display = "flex";

  addCartBtn.onclick = () => {
    const existing = cart.find(i => i.name === product.name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ img: product.image, name: product.name, price: product.price, color: product.color, qty: 1 });
    }
    renderCart();
    searchModal.style.display = "none";
    cartModal.style.display = "flex";
  };
}

searchBar.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    const query = searchBar.value.trim().toLowerCase();
    const found = products.find(p => p.name.toLowerCase().includes(query));
    if (found) showProduct(found);
    else alert("No product found ❌. Try searching another watch.");
  }
});

closeSearch.addEventListener("click", () => searchModal.style.display = "none");
window.addEventListener("click", e => {
  if (e.target === searchModal) searchModal.style.display = "none";
});
// ✅ Contact Form Submission Alert
const contactForm = document.querySelector("form");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault(); // stop actual form submission
  const name = contactForm.querySelector('input[type="text"]').value.trim();
  const email = contactForm.querySelector('input[type="email"]').value.trim();
  const message = contactForm.querySelector('textarea').value.trim();

  if (name && email && message) {
    alert(`Thank you, ${name}! Your message has been sent successfully.`);
    contactForm.reset(); // clear form after submission
  } else {
    alert("Please fill out all fields before submitting.");
  }
});
