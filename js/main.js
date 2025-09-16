// Основной JavaScript файл с неоптимизированным кодом

// Глобальные переменные без оптимизации
var cart = [];
var isLoading = false;
var currentUser = null;
var products = [
    {id: 1, name: "Смартфон XTech Pro", price: 29990, image: "images/product1-large.jpg"},
    {id: 2, name: "Ноутбук GameBook Ultra", price: 89990, image: "images/product2-large.jpg"},
    {id: 3, name: "Наушники AudioMax", price: 12990, image: "images/product3-large.jpg"},
    {id: 4, name: "Планшет TabPro", price: 45990, image: "images/product4-large.jpg"},
    {id: 5, name: "Умные часы WatchSmart", price: 19990, image: "images/product5-large.jpg"},
    {id: 6, name: "Экшн-камера ActionPro", price: 24990, image: "images/product6-large.jpg"}
];

// Неэффективная загрузка DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен');
    initializeWebsite();
    setupEventListeners();
    loadUserData();
    checkCartStatus();
    updateProductPrices();
    initializeAnimations();
    setupScrollEffects();
    loadExternalResources();
});

// Неоптимизированная инициализация
function initializeWebsite() {
    console.log('Инициализация сайта...');
    
    // Множественные DOM запросы
    var header = document.querySelector('.header');
    var navigation = document.querySelector('.navigation');
    var heroSection = document.querySelector('.hero-banner');
    var productsSection = document.querySelector('.products-section');
    var footer = document.querySelector('.footer');
    
    // Избыточная проверка элементов
    if (header && navigation && heroSection && productsSection && footer) {
        console.log('Все секции найдены');
        header.style.opacity = '1';
        navigation.style.opacity = '1';
        heroSection.style.opacity = '1';
        productsSection.style.opacity = '1';
        footer.style.opacity = '1';
    }
    
    // Ненужная задержка
    setTimeout(function() {
        console.log('Сайт готов к работе');
    }, 1000);
}

// Неэффективная настройка событий
function setupEventListeners() {
    // Множественные обработчики событий
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', handlePageLoad);
    
    // Неоптимизированные обработчики для кнопок
    var buttons = document.querySelectorAll('button');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function(e) {
            console.log('Кнопка нажата: ', e.target.textContent);
            // Избыточная анимация при каждом клике
            e.target.style.transform = 'scale(0.95)';
            setTimeout(function() {
                e.target.style.transform = 'scale(1)';
            }, 150);
        });
        
        buttons[i].addEventListener('mouseover', function(e) {
            e.target.style.cursor = 'pointer';
        });
        
        buttons[i].addEventListener('mouseout', function(e) {
            e.target.style.cursor = 'default';
        });
    }
}

// Функция прокрутки к товарам
function scrollToProducts() {
    console.log('Прокрутка к товарам');
    
    // Неэффективная прокрутка
    var productsSection = document.getElementById('products');
    if (productsSection) {
        // Медленная анимированная прокрутка
        var currentPosition = window.pageYOffset;
        var targetPosition = productsSection.offsetTop - 100;
        var distance = targetPosition - currentPosition;
        var duration = 1500; // Слишком медленно
        var startTime = null;
        
        function animateScroll(timestamp) {
            if (startTime === null) startTime = timestamp;
            var progress = timestamp - startTime;
            var percentage = Math.min(progress / duration, 1);
            
            // Сложная функция easing
            var easing = 1 - Math.pow(1 - percentage, 4);
            window.scrollTo(0, currentPosition + (distance * easing));
            
            if (progress < duration) {
                requestAnimationFrame(animateScroll);
            }
        }
        
        requestAnimationFrame(animateScroll);
    }
}

// Неэффективное управление корзиной
var cartData = {
    items: [],
    total: 0,
    count: 0
};

function addToCart(productId) {
    console.log('Добавление товара в корзину: ' + productId);
    
    // Неэффективный поиск товара
    var product = null;
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            product = products[i];
            break;
        }
    }
    
    if (product) {
        // Проверка наличия в корзине
        var existingItem = null;
        for (var j = 0; j < cartData.items.length; j++) {
            if (cartData.items[j].id === productId) {
                existingItem = cartData.items[j];
                break;
            }
        }
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartData.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image
            });
        }
        
        updateCartDisplay();
        showNotification('Товар добавлен в корзину!');
        
        // Избыточная анимация
        animateCartButton(productId);
    }
}

function updateCartDisplay() {
    // Пересчет общей суммы и количества
    cartData.total = 0;
    cartData.count = 0;
    
    for (var i = 0; i < cartData.items.length; i++) {
        cartData.total += cartData.items[i].price * cartData.items[i].quantity;
        cartData.count += cartData.items[i].quantity;
    }
    
    console.log('Обновление отображения корзины. Товаров: ' + cartData.count + ', Сумма: ' + cartData.total);
}

function animateCartButton(productId) {
    var buttons = document.querySelectorAll('.add-to-cart');
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].getAttribute('onclick').includes(productId)) {
            buttons[i].style.background = '#28a745';
            buttons[i].textContent = 'Добавлено!';
            
            setTimeout(function() {
                buttons[i].style.background = '';
                buttons[i].textContent = 'Добавить в корзину';
            }, 2000);
            
            break;
        }
    }
}

// Избыточные функции для обработки событий
function handleScroll() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Неэффективное изменение прозрачности хедера
    var header = document.querySelector('.header');
    if (header) {
        var opacity = Math.min(scrollTop / 100, 1);
        header.style.backgroundColor = 'rgba(255, 255, 255, ' + opacity + ')';
    }
    
    // Параллакс эффект для героя (ресурсозатратный)
    var hero = document.querySelector('.hero-image');
    if (hero) {
        hero.style.transform = 'translateY(' + (scrollTop * 0.5) + 'px)';
    }
}

function handleResize() {
    console.log('Изменение размера окна');
    // Неэффективная проверка размера
    var width = window.innerWidth;
    var height = window.innerHeight;
    
    if (width < 768) {
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
}

function handlePageLoad() {
    console.log('Страница полностью загружена');
    // Ненужные проверки после загрузки
    setTimeout(function() {
        checkAllImages();
        validateAllForms();
        preloadResources();
    }, 500);
}

function checkAllImages() {
    var images = document.querySelectorAll('img');
    for (var i = 0; i < images.length; i++) {
        if (!images[i].complete) {
            console.log('Изображение не загружено: ' + images[i].src);
        }
    }
}

function validateAllForms() {
    var forms = document.querySelectorAll('form');
    for (var i = 0; i < forms.length; i++) {
        console.log('Валидация формы: ' + i);
    }
}

function preloadResources() {
    // Избыточная предзагрузка
    var imagesToPreload = [
        'images/hero-banner-large.jpg',
        'images/product1-large.jpg',
        'images/product2-large.jpg',
        'images/product3-large.jpg'
    ];
    
    for (var i = 0; i < imagesToPreload.length; i++) {
        var img = new Image();
        img.src = imagesToPreload[i];
    }
}

// Показ уведомлений
function showNotification(message) {
    // Создание элемента уведомления
    var notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 9999;
        font-weight: bold;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(function() {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматическое скрытие
    setTimeout(function() {
        notification.style.transform = 'translateX(100%)';
        setTimeout(function() {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Неиспользуемые функции
function unusedFunction1() {
    console.log('Эта функция не используется');
}

function oldFeatureToggle() {
    var elements = document.querySelectorAll('.old-feature');
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
    }
}

function deprecatedAnimation() {
    var element = document.querySelector('.deprecated');
    if (element) {
        element.style.animation = 'bounce 2s infinite';
    }
}