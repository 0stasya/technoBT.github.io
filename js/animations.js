// Файл анимаций с избыточным кодом

// Неэффективная инициализация анимаций
function initializeAnimations() {
    console.log('Инициализация анимаций...');
    
    // Множественные обработчики для анимаций
    setupScrollAnimations();
    setupHoverAnimations();
    setupLoadAnimations();
    setupClickAnimations();
}

function setupScrollAnimations() {
    var animatedElements = document.querySelectorAll('[data-animation]');
    
    // Неоптимизированный скролл листенер
    window.addEventListener('scroll', function() {
        for (var i = 0; i < animatedElements.length; i++) {
            var element = animatedElements[i];
            var elementTop = element.getBoundingClientRect().top;
            var windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 50) {
                var animationType = element.getAttribute('data-animation');
                element.classList.add(animationType);
                
                // Дополнительные эффекты
                switch(animationType) {
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
        }
    });
}

function setupHoverAnimations() {
    // Избыточные hover эффекты для карточек
    var productCards = document.querySelectorAll('.product-card');
    
    for (var i = 0; i < productCards.length; i++) {
        productCards[i].addEventListener('mouseenter', function(e) {
            // Множественные DOM манипуляции
            e.target.style.transform = 'translateY(-10px) scale(1.02)';
            e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            e.target.style.transition = 'all 0.4s ease';
            
            // Анимация для дочерних элементов
            var image = e.target.querySelector('.product-image');
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
            
            var button = e.target.querySelector('.add-to-cart');
            if (button) {
                button.style.background = '#218838';
            }
        });
        
        productCards[i].addEventListener('mouseleave', function(e) {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            
            var image = e.target.querySelector('.product-image');
            if (image) {
                image.style.transform = 'scale(1)';
            }
            
            var button = e.target.querySelector('.add-to-cart');
            if (button) {
                button.style.background = '#28a745';
            }
        });
    }
}

function setupLoadAnimations() {
    // Анимации при загрузке страницы
    setTimeout(function() {
        var header = document.querySelector('.header');
        if (header) {
            header.style.opacity = '0';
            header.style.transform = 'translateY(-50px)';
            header.style.transition = 'all 1s ease';
            
            setTimeout(function() {
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
            }, 500);
        }
        
        var heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'scale(0.8)';
            heroContent.style.transition = 'all 1.2s ease';
            
            setTimeout(function() {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'scale(1)';
            }, 800);
        }
    }, 100);
}

function setupClickAnimations() {
    // Анимации кликов для всех кнопок
    var allButtons = document.querySelectorAll('button, .cta-button, .add-to-cart');
    
    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].addEventListener('click', function(e) {
            // Создание эффекта пульсации
            var ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background-color: rgba(255,255,255,0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            `;
            
            var rect = e.target.getBoundingClientRect();
            var size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            
            e.target.style.position = 'relative';
            e.target.appendChild(ripple);
            
            setTimeout(function() {
                ripple.remove();
            }, 600);
        });
    }
    
    // Добавляем CSS для анимации пульсации
    var style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Дополнительные анимационные функции
function animateCounter(element, start, end, duration) {
    var startTimestamp = null;
    var step = function(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        var progress = Math.min((timestamp - startTimestamp) / duration, 1);
        var current = Math.floor(progress * (end - start) + start);
        element.textContent = current;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function createFloatingElements() {
    // Создание декоративных плавающих элементов
    for (var i = 0; i < 10; i++) {
        var floatingElement = document.createElement('div');
        floatingElement.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: rgba(0, 123, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            animation: float-animation ${Math.random() * 10 + 5}s infinite linear;
        `;
        document.body.appendChild(floatingElement);
    }
    
    // CSS для плавающих элементов
    var floatStyle = document.createElement('style');
    floatStyle.textContent = `
        @keyframes float-animation {
            0% {
                transform: translateY(0px) rotate(0deg);
                opacity: 1;
            }
            50% {
                transform: translateY(-100px) rotate(180deg);
                opacity: 0.5;
            }
            100% {
                transform: translateY(-200px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(floatStyle);
}

// Неиспользуемые анимационные функции
function oldSlideShow() {
    var images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
    var current = 0;
    
    setInterval(function() {
        current = (current + 1) % images.length;
        console.log('Переключение на изображение: ' + images[current]);
    }, 3000);
}

function deprecatedParallax() {
    window.addEventListener('scroll', function() {
        var scrolled = window.pageYOffset;
        var parallaxElements = document.querySelectorAll('.parallax');
        
        for (var i = 0; i < parallaxElements.length; i++) {
            var speed = parallaxElements[i].dataset.speed || 0.5;
            parallaxElements[i].style.transform = 'translateY(' + (scrolled * speed) + 'px)';
        }
    });
}