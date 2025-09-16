// Управление корзиной с избыточным кодом

var cartInstance = {
    items: [],
    total: 0,
    count: 0,
    isVisible: false,
    element: null
};

function initializeCart() {
    console.log('Инициализация корзины...');
    createCartElement();
    loadCartFromStorage();
    updateCartCounter();
    setupCartEvents();
}

function createCartElement() {
    // Создание элемента корзины в DOM
    var cartHTML = `
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
    
    // CSS для корзины
    var cartStyles = document.createElement('style');
    cartStyles.textContent = `
        .cart-sidebar {
            position: fixed;
            right: -400px;
            top: 0;
            width: 400px;
            height: 100vh;
            background: white;
            box-shadow: -5px 0 15px rgba(0,0,0,0.1);
            z-index: 9999;
            transition: right 0.3s ease;
            display: flex;
            flex-direction: column;
        }
        
        .cart-sidebar.active {
            right: 0;
        }
        
        .cart-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.5);
            z-index: 9998;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .cart-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        
        .cart-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .close-cart {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
        }
        
        .cart-items-list {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }
        
        .cart-footer {
            padding: 20px;
            border-top: 1px solid #eee;
        }
        
        .checkout-btn {
            width: 100%;
            padding: 15px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 10px;
        }
    `;
    document.head.appendChild(cartStyles);
}

function addItemToCart(productId) {
    console.log('Добавление товара в корзину: ' + productId);
    
    // Поиск товара
    var product = findProductById(productId);
    if (!product) {
        console.error('Товар не найден');
        return;
    }
    
    // Проверка существования в корзине
    var existingItem = findCartItem(productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        console.log('Увеличено количество товара: ' + product.name);
    } else {
        cartInstance.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
        console.log('Новый товар добавлен: ' + product.name);
    }
    
    updateCartDisplay();
    saveCartToStorage();
    showCartNotification('Товар добавлен в корзину!');
    animateCartIcon();
}

function removeItemFromCart(productId) {
    var itemIndex = -1;
    
    for (var i = 0; i < cartInstance.items.length; i++) {
        if (cartInstance.items[i].id === productId) {
            itemIndex = i;
            break;
        }
    }
    
    if (itemIndex > -1) {
        var removedItem = cartInstance.items.splice(itemIndex, 1)[0];
        console.log('Товар удален из корзины: ' + removedItem.name);
        updateCartDisplay();
        saveCartToStorage();
        showCartNotification('Товар удален из корзины');
    }
}

function updateItemQuantity(productId, newQuantity) {
    var item = findCartItem(productId);
    
    if (item) {
        if (newQuantity <= 0) {
            removeItemFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartDisplay();
            saveCartToStorage();
        }
    }
}

function findProductById(productId) {
    // Неэффективный поиск в глобальном массиве
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            return products[i];
        }
    }
    return null;
}

function findCartItem(productId) {
    for (var i = 0; i < cartInstance.items.length; i++) {
        if (cartInstance.items[i].id === productId) {
            return cartInstance.items[i];
        }
    }
    return null;
}

function updateCartDisplay() {
    updateCartCounter();
    updateCartTotal();
    renderCartItems();
}

function updateCartCounter() {
    cartInstance.count = 0;
    for (var i = 0; i < cartInstance.items.length; i++) {
        cartInstance.count += cartInstance.items[i].quantity;
    }
    
    // Обновление счетчика в UI (если есть)
    var counter = document.querySelector('.cart-counter');
    if (counter) {
        counter.textContent = cartInstance.count;
        counter.style.display = cartInstance.count > 0 ? 'block' : 'none';
    }
}

function updateCartTotal() {
    cartInstance.total = 0;
    for (var i = 0; i < cartInstance.items.length; i++) {
        cartInstance.total += cartInstance.items[i].price * cartInstance.items[i].quantity;
    }
    
    var totalElement = document.getElementById('cart-total-amount');
    if (totalElement) {
        totalElement.textContent = formatPrice(cartInstance.total);
    }
}

function renderCartItems() {
    var itemsList = document.querySelector('.cart-items-list');
    if (!itemsList) return;
    
    if (cartInstance.items.length === 0) {
        itemsList.innerHTML = '<p>Корзина пуста</p>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < cartInstance.items.length; i++) {
        var item = cartInstance.items[i];
        html += `
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
        `;
    }
    
    itemsList.innerHTML = html;
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
    cartInstance.total = 0;
    cartInstance.count = 0;
    updateCartDisplay();
    saveCartToStorage();
    showCartNotification('Корзина очищена');
}

function saveCartToStorage() {
    try {
        localStorage.setItem('shopping-cart', JSON.stringify(cartInstance.items));
    } catch (e) {
        console.error('Ошибка сохранения корзины:', e);
    }
}

function loadCartFromStorage() {
    try {
        var savedCart = localStorage.getItem('shopping-cart');
        if (savedCart) {
            cartInstance.items = JSON.parse(savedCart);
            updateCartDisplay();
        }
    } catch (e) {
        console.error('Ошибка загрузки корзины:', e);
    }
}

function setupCartEvents() {
    // Обработчики событий для корзины
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartInstance.isVisible) {
            closeCart();
        }
    });
}

function animateCartIcon() {
    var cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.2)';
        cartIcon.style.transition = 'transform 0.2s ease';
        
        setTimeout(function() {
            cartIcon.style.transform = 'scale(1)';
        }, 200);
    }
}

function showCartNotification(message) {
    // Переиспользуем функцию из main.js
    if (typeof showNotification === 'function') {
        showNotification(message);
    }
}

function proceedToCheckout() {
    if (cartInstance.items.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    alert('Переход к оформлению заказа...

' + 
          'Товаров в корзине: ' + cartInstance.count + '
' +
          'Общая сумма: ' + formatPrice(cartInstance.total) + ' ₽');
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeCart, 1000);
});