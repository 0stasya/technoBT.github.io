// Неиспользуемые функции и старый код

// Старая система слайдшоу
var oldSlideshow = {
    currentSlide: 0,
    slides: [],
    autoplayInterval: null,
    
    init: function() {
        console.log('Инициализация старого слайдшоу');
        this.slides = document.querySelectorAll('.old-slide');
        this.setupControls();
        this.startAutoplay();
    },
    
    setupControls: function() {
        var prevBtn = document.getElementById('prev-slide');
        var nextBtn = document.getElementById('next-slide');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', this.prevSlide.bind(this));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', this.nextSlide.bind(this));
        }
    },
    
    nextSlide: function() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlides();
    },
    
    prevSlide: function() {
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.updateSlides();
    },
    
    updateSlides: function() {
        for (var i = 0; i < this.slides.length; i++) {
            this.slides[i].style.display = i === this.currentSlide ? 'block' : 'none';
        }
    },
    
    startAutoplay: function() {
        this.autoplayInterval = setInterval(this.nextSlide.bind(this), 5000);
    }
};

// Устаревшая система фильтрации
function oldFilterSystem() {
    var filterButtons = document.querySelectorAll('.filter-btn');
    var items = document.querySelectorAll('.filterable-item');
    
    for (var i = 0; i < filterButtons.length; i++) {
        filterButtons[i].addEventListener('click', function(e) {
            var filter = e.target.dataset.filter;
            
            // Неэффективная фильтрация
            for (var j = 0; j < items.length; j++) {
                var item = items[j];
                var categories = item.dataset.category.split(',');
                var shouldShow = filter === 'all' || categories.indexOf(filter) > -1;
                
                item.style.display = shouldShow ? 'block' : 'none';
            }
            
            // Обновление активной кнопки
            for (var k = 0; k < filterButtons.length; k++) {
                filterButtons[k].classList.remove('active');
            }
            e.target.classList.add('active');
        });
    }
}

// Старая система модальных окон
var oldModalSystem = {
    currentModal: null,
    
    open: function(modalId) {
        var modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.3s ease';
            
            setTimeout(function() {
                modal.style.opacity = '1';
            }, 10);
            
            this.currentModal = modal;
            document.body.style.overflow = 'hidden';
        }
    },
    
    close: function() {
        if (this.currentModal) {
            this.currentModal.style.opacity = '0';
            
            setTimeout(function() {
                this.currentModal.style.display = 'none';
                this.currentModal = null;
                document.body.style.overflow = '';
            }.bind(this), 300);
        }
    }
};

// Неиспользуемые вспомогательные функции
function oldUtilityFunctions() {
    
    function debounce(func, wait) {
        var timeout;
        return function executedFunction() {
            var context = this;
            var args = arguments;
            
            var later = function() {
                timeout = null;
                func.apply(context, args);
            };
            
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    function throttle(func, limit) {
        var inThrottle;
        return function() {
            var args = arguments;
            var context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }
    
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    function formatDate(date) {
        var months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн',
                     'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        
        return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    }
}

// Устаревшие обработчики событий
function setupOldEventHandlers() {
    // Старый обработчик прокрутки
    window.addEventListener('scroll', function() {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        console.log('Прокрутка (старый обработчик): ' + scrollTop);
    });
    
    // Старый обработчик изменения размера
    window.addEventListener('resize', function() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        console.log('Размер окна (старый): ' + width + 'x' + height);
    });
    
    // Неиспользуемые обработчики клавиатуры
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            console.log('Попытка сохранения (заблокировано)');
        }
        
        if (e.key === 'F12') {
            console.log('Открытие инструментов разработчика');
        }
    });
}

// Старая система аналитики
var oldAnalytics = {
    events: [],
    
    track: function(eventName, properties) {
        var event = {
            name: eventName,
            properties: properties || {},
            timestamp: new Date(),
            url: window.location.href
        };
        
        this.events.push(event);
        console.log('Отслеживание события (старое): ' + eventName, properties);
        
        // Имитация отправки данных
        setTimeout(function() {
            console.log('Данные отправлены (имитация)');
        }, 1000);
    },
    
    getEvents: function() {
        return this.events;
    },
    
    clearEvents: function() {
        this.events = [];
    }
};

// Инициализация старых систем (не вызывается)
function initializeOldSystems() {
    oldSlideshow.init();
    oldFilterSystem();
    setupOldEventHandlers();
}