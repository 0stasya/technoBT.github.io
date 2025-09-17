// === Глобальные переменные ===
const products = [
    { id: 1, name: "Смартфон XTech Pro", price: 29990, image: "images/product1-large.jpg" },
    { id: 2, name: "Ноутбук GameBook Ultra", price: 89990, image: "images/product2-large.jpg" },
    { id: 3, name: "Наушники AudioMax", price: 12990, image: "images/product3-large.jpg" },
    { id: 4, name: "Планшет TabPro", price: 45990, image: "images/product4-large.jpg" },
    { id: 5, name: "Умные часы WatchSmart", price: 19990, image: "images/product5-large.jpg" },
    { id: 6, name: "Экшн-камера ActionPro", price: 24990, image: "images/product6-large.jpg" }
];

let cartData = { items: [], total: 0, count: 0 };
let cartInstance = { items: [], total: 0, count: 0, isVisible: false, element: null };

// === Инициализация при загрузке ===
document.addEventListener("DOMContentLoaded", function () {
    initializeWebsite();
    setupEventListeners();
    initializeCart();
    initializeAnimations();
});

// === Основные функции ===
function initializeWebsite() {
    const header = document.querySelector(".header");
    const navigation = document.querySelector(".navigation");
    const heroSection = document.querySelector(".hero-banner");
    const productsSection = document.querySelector(".products-section");
    const footer = document.querySelector(".footer");

    if (header && navigation && heroSection && productsSection && footer) {
        header.style.opacity = "1";
        navigation.style.opacity = "1";
        heroSection.style.opacity = "1";
        productsSection.style.opacity = "1";
        footer.style.opacity = "1";
    }
}

function setupEventListeners() {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
        button.addEventListener("click", handleClick);
        button.addEventListener("mouseover", handleMouseOver);
        button.addEventListener("mouseout", handleMouseOut);
    });
}

function handleClick(e) {
    e.target.style.transform = "scale(0.95)";
    setTimeout(() => e.target.style.transform = "scale(1)", 150);
}

function handleMouseOver(e) {
    e.target.style.cursor = "pointer";
}

function handleMouseOut(e) {
    e.target.style.cursor = "default";
}

function handleScroll() {
    const scrollTop = window.pageYOffset;
    const header = document.querySelector(".header");
    if (header) {
        const opacity = Math.min(scrollTop / 100, 1);
        header.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
    }
}

function handleResize() {
    document.body.classList.toggle("mobile", window.innerWidth < 768);
}

function scrollToProducts() {
    const productsSection = document.getElementById("products");
    if (!productsSection) return;

    const start = window.pageYOffset;
    const target = productsSection.offsetTop - 100;
    const distance = target - start;
    const duration = 800;
    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        window.scrollTo(0, start + distance * easeOutCubic(progress));
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
    requestAnimationFrame(animation);
}

// === Корзина (cartData) ===
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cartData.items.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartData.items.push({ ...product, quantity: 1 });
    }

    updateCartDisplay();
    showNotification("Товар добавлен в корзину!");
    animateCartButton(productId);
}

function updateCartDisplay() {
    cartData.total = cartData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartData.count = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
}

function animateCartButton(productId) {
    const buttons = document.querySelectorAll(".add-to-cart");
    const targetButton = Array.from(buttons).find(btn => btn.getAttribute("onclick")?.includes(productId));
    if (!targetButton) return;

    targetButton.style.background = "#28a745";
    targetButton.textContent = "Добавлено!";
    setTimeout(() => {
        targetButton.style.background = "";
        targetButton.textContent = "Добавить в корзину";
    }, 2000);
}

// === Корзина (cartInstance) ===
function initializeCart() {
    createCartElement();
    loadCartFromStorage();
    setupCartEvents();
}

function createCartElement() {
    const cartHTML = `
        <div id="shopping-cart" class="cart-sidebar">
            <div class="cart-header">
                <h3>Корзина покупок</h3>
                <button class="close-cart" onclick="closeCart()">&times;</button>
            </div>
            <div class="cart-items-list"></div>
            <div class="cart-footer">
                <div class="cart-total">
                    <strong>Итого: <span id="cart-total-amount">0</span> ₽</strong>
                </div>
                <button class="checkout-btn" onclick="proceedToCheckout()">Оформить заказ</button>
            </div>
        </div>
        <div class="cart-overlay" onclick="closeCart()"></div>
    `;
    document.body.insertAdjacentHTML('beforeend', cartHTML);
    cartInstance.element = document.getElementById('shopping-cart');

    const style = document.createElement('style');
    style.textContent = `
        .cart-sidebar { position: fixed; right: -400px; top: 0; width: 400px; height: 100vh;
            background: white; box-shadow: -5px 0 15px rgba(0,0,0,0.1); z-index: 9999;
            transition: right 0.3s ease; display: flex; flex-direction: column; }
        .cart-sidebar.active { right: 0; }
        .cart-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.5); z-index: 9998; opacity: 0; visibility: hidden;
            transition: all 0.3s ease; }
        .cart-overlay.active { opacity: 1; visibility: visible; }
        .cart-header { padding: 20px; border-bottom: 1px solid #eee; display: flex;
            justify-content: space-between; align-items: center; }
        .close-cart { background: none; border: none; font-size: 24px; cursor: pointer; }
        .cart-items-list { flex: 1; overflow-y: auto; padding: 20px; }
        .cart-footer { padding: 20px; border-top: 1px solid #eee; }
        .checkout-btn { width: 100%; padding: 15px; background: #007bff; color: white;
            border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin-top: 10px; }
    `;
    document.head.appendChild(style);
}

function addItemToCart(productId) {
    const product = findProductById(productId);
    if (!product) return;

    const existingItem = findCartItem(productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartInstance.items.push({ ...product, quantity: 1 });
    }

    updateCartDisplay();
    saveCartToStorage();
    showCartNotification('Товар добавлен в корзину!');
    animateCartIcon();
}

function removeItemFromCart(productId) {
    const index = cartInstance.items.findIndex(item => item.id === productId);
    if (index > -1) {
        cartInstance.items.splice(index, 1);
        updateCartDisplay();
        saveCartToStorage();
        showCartNotification('Товар удален из корзины');
    }
}

function updateItemQuantity(productId, newQuantity) {
    const item = findCartItem(productId);
    if (!item) return;
    if (newQuantity <= 0) {
        removeItemFromCart(productId);
    } else {
        item.quantity = newQuantity;
        updateCartDisplay();
        saveCartToStorage();
    }
}

function findProductById(id) {
    return products.find(p => p.id === id);
}

function findCartItem(id) {
    return cartInstance.items.find(item => item.id === id);
}

function updateCartDisplay() {
    updateCartCounter();
    updateCartTotal();
    renderCartItems();
}

function updateCartCounter() {
    cartInstance.count = cartInstance.items.reduce((sum, item) => sum + item.quantity, 0);
    const counter = document.querySelector('.cart-counter');
    if (counter) {
        counter.textContent = cartInstance.count;
        counter.style.display = cartInstance.count > 0 ? 'block' : 'none';
    }
}

function updateCartTotal() {
    cartInstance.total = cartInstance.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const el = document.getElementById('cart-total-amount');
    if (el) el.textContent = formatPrice(cartInstance.total);
}

function renderCartItems() {
    const list = document.querySelector('.cart-items-list');
    if (!list) return;

    if (cartInstance.items.length === 0) {
        list.innerHTML = '<p>Корзина пуста</p>';
        return;
    }

    list.innerHTML = cartInstance.items.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-price">${formatPrice(item.price)} ₽</p>
                <div class="quantity-controls">
                    <button onclick="updateItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeItemFromCart(${item.id})">×</button>
        </div>
    `).join('');
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function showCart() {
    cartInstance.element.classList.add('active');
    document.querySelector('.cart-overlay').classList.add('active');
    cartInstance.isVisible = true;
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartInstance.element.classList.remove('active');
    document.querySelector('.cart-overlay').classList.remove('active');
    cartInstance.isVisible = false;
    document.body.style.overflow = '';
}

function clearCart() {
    cartInstance.items = [];
    updateCartDisplay();
    saveCartToStorage();
    showCartNotification('Корзина очищена');
}

function saveCartToStorage() {
    try {
        localStorage.setItem('shopping-cart', JSON.stringify(cartInstance.items));
    } catch (e) {
        console.error('Ошибка сохранения:', e);
    }
}

function loadCartFromStorage() {
    try {
        const saved = localStorage.getItem('shopping-cart');
        if (saved) {
            cartInstance.items = JSON.parse(saved);
            updateCartDisplay();
        }
    } catch (e) {
        console.error('Ошибка загрузки:', e);
    }
}

function setupCartEvents() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartInstance.isVisible) closeCart();
    });
}

function animateCartIcon() {
    const icon = document.querySelector('.cart-icon');
    if (!icon) return;
    icon.style.transform = 'scale(1.2)';
    icon.style.transition = 'transform 0.2s ease';
    setTimeout(() => icon.style.transform = 'scale(1)', 200);
}

function showCartNotification(message) {
    if (typeof showNotification === 'function') showNotification(message);
}

function proceedToCheckout() {
    if (cartInstance.items.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    alert(`Переход к оформлению заказа...\nТоваров: ${cartInstance.count}\nСумма: ${formatPrice(cartInstance.total)} ₽`);
}

// === Анимации ===
function initializeAnimations() {
    setupScrollAnimations();
    setupHoverAnimations();
    setupLoadAnimations();
    setupClickAnimations();
}

function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animation]');
    window.addEventListener('scroll', () => {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight - 50) {
                const type = element.getAttribute('data-animation');
                element.classList.add(type);
                switch (type) {
                    case 'fadeIn':
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                        break;
                    case 'slideUp':
                        element.style.transform = 'translateY(0)';
                        element.style.opacity = '1';
                        break;
                    case 'zoomIn':
                        element.style.transform = 'scale(1)';
                        element.style.opacity = '1';
                        break;
                }
            }
        });
    });
}

function setupHoverAnimations() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            e.target.style.transform = 'translateY(-10px) scale(1.02)';
            e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            e.target.style.transition = 'all 0.4s ease';
            const img = e.target.querySelector('.product-image');
            const btn = e.target.querySelector('.add-to-cart');
            if (img) img.style.transform = 'scale(1.1)';
            if (btn) btn.style.background = '#218838';
        });

        card.addEventListener('mouseleave', (e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            const img = e.target.querySelector('.product-image');
            const btn = e.target.querySelector('.add-to-cart');
            if (img) img.style.transform = 'scale(1)';
            if (btn) btn.style.background = '#28a745';
        });
    });
}

function setupLoadAnimations() {
    setTimeout(() => {
        const header = document.querySelector('.header');
        const hero = document.querySelector('.hero-content');
        if (header) {
            header.style.opacity = '0';
            header.style.transform = 'translateY(-50px)';
            header.style.transition = 'all 1s ease';
            setTimeout(() => {
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
            }, 500);
        }
        if (hero) {
            hero.style.opacity = '0';
            hero.style.transform = 'scale(0.8)';
            hero.style.transition = 'all 1.2s ease';
            setTimeout(() => {
                hero.style.opacity = '1';
                hero.style.transform = 'scale(1)';
            }, 800);
        }
    }, 100);
}

function setupClickAnimations() {
    const buttons = document.querySelectorAll('button, .cta-button, .add-to-cart');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = e.target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            // Безопасное присвоение стилей — НЕ ИСПОЛЬЗУЕМ cssText!
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.backgroundColor = 'rgba(255,255,255,0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple-animation 0.6s linear';
            ripple.style.pointerEvents = 'none';
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

            e.target.style.position = 'relative';
            e.target.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    const style = document.createElement('style');
    style.textContent = `@keyframes ripple-animation { to { transform: scale(2); opacity: 0; } }`;
    document.head.appendChild(style);
}

// === Уведомления ===
function showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;

    // Безопасное присвоение стилей — НЕ ИСПОЛЬЗУЕМ cssText!
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = '#28a745';
    notification.style.color = 'white';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '9999';
    notification.style.fontWeight = 'bold';
    notification.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease';

    document.body.appendChild(notification);
    setTimeout(() => notification.style.transform = "translateX(0)", 100);
    setTimeout(() => {
        notification.style.transform = "translateX(100%)";
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}