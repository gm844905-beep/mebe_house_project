let cart = JSON.parse(localStorage.getItem('mebelhome_cart')) || [];

function saveCart() {
    localStorage.setItem('mebelhome_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(el => {
        if (el) el.textContent = count;
    });
}

function addToCart(id, name, price, image) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    saveCart();
    alert(`"${name}" добавлен в корзину`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    if (typeof renderCart === 'function') renderCart();
}

function changeQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            if (typeof renderCart === 'function') renderCart();
        }
    }
}

function renderCart() {
    const container = document.getElementById('cartItemsList');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="cart-empty">Корзина пуста. Перейдите в каталог, чтобы добавить товары.</div>';
        updateSummary();
        return;
    }
    
    let html = '';
    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">${item.price.toLocaleString()} ₽</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                </div>
                <div class="cart-item-total">
                    <span>${(item.price * item.quantity).toLocaleString()} ₽</span>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">🗑️</button>
            </div>
        `;
    });
    container.innerHTML = html;
    updateSummary();
}

function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = subtotal >= 50000 ? 0 : 1500;
    const total = subtotal + delivery;
    
    const subtotalEl = document.getElementById('cartSubtotal');
    const deliveryEl = document.getElementById('cartDelivery');
    const totalEl = document.getElementById('cartTotal');
    
    if (subtotalEl) subtotalEl.textContent = subtotal.toLocaleString() + ' ₽';
    if (deliveryEl) deliveryEl.textContent = delivery === 0 ? 'Бесплатно' : delivery.toLocaleString() + ' ₽';
    if (totalEl) totalEl.textContent = total.toLocaleString() + ' ₽';
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (typeof renderCart === 'function') renderCart();
});
// Бургер-меню
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const overlay = document.getElementById('overlay');

if (burger && nav && overlay) {
    burger.addEventListener('click', function() {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
    
    overlay.addEventListener('click', function() {
        burger.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Закрытие меню при клике на ссылку
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            burger.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}