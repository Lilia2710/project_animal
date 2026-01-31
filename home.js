// home.js - Анимации для главной страницы
document.addEventListener('DOMContentLoaded', function() {
    // Анимация появления элементов при скролле
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Наблюдаем за карточками особенностей
    document.querySelectorAll('.feature-card-detailed, .info-card').forEach(card => {
        observer.observe(card);
    });

    // FAQ функционал
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            faqItem.classList.toggle('active');
            
            // Закрываем другие открытые FAQ
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    otherQuestion.parentElement.classList.remove('active');
                }
            });
        });
    });

    // Плавный скролл для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#home') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Анимация статистики (счетчики)
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // Запускаем анимацию счетчиков при попадании в область видимости
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValue = entry.target.querySelector('.stat-value');
                if (statValue) {
                    const value = statValue.textContent;
                    const numValue = parseInt(value);
                    if (!isNaN(numValue)) {
                        statValue.textContent = '0';
                        setTimeout(() => {
                            animateCounter(statValue, numValue);
                        }, 300);
                    }
                }
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-item').forEach(stat => {
        statObserver.observe(stat);
    });

    // Анимация иконок в герое
    const heroIcons = document.querySelectorAll('.pet-icon');
    heroIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.5}s`;
    });
});
// FAQ функционал
function initFAQ() {
    // Вариант 1: Раскрывающиеся карточки
    const faqCards = document.querySelectorAll('.faq-card');
    
    faqCards.forEach(card => {
        card.addEventListener('click', function() {
            // Переключаем активное состояние
            this.classList.toggle('active');
            
            // Показываем/скрываем контент
            const content = this.querySelector('.faq-content');
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
            
            // Анимация иконки
            const icon = this.querySelector('.faq-icon i');
            if (this.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        });
        
        // Инициализируем высоту контента
        const content = card.querySelector('.faq-content');
        if (card.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
    
    // Вариант 2: Аккордеон (если используете)
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Закрываем все другие
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            // Открываем текущий, если был закрыт
            if (!isActive) {
                faqItem.classList.add('active');
                const answer = faqItem.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
    
    // Анимация появления при скролле
    const faqObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                faqObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Наблюдаем за всеми элементами FAQ
    document.querySelectorAll('.faq-card, .faq-item').forEach(item => {
        faqObserver.observe(item);
    });
    
    // Анимация иконок типов животных
    const animalTypes = document.querySelectorAll('.animal-type');
    animalTypes.forEach((type, index) => {
        type.style.animationDelay = `${index * 0.1}s`;
        type.classList.add('animate-pop');
    });
}

// Вызываем при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initFAQ();
    
    // Добавляем анимацию для карточек FAQ
    setTimeout(() => {
        document.querySelectorAll('.faq-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }, 500);
});
// Анимация для компактных элементов
function initCompactFeatures() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми элементами
    document.querySelectorAll('.feature-item, .how-it-works, .stats-compact, .features-cta-compact').forEach(element => {
        observer.observe(element);
    });

    // Анимация статистики
    const stats = document.querySelectorAll('.stat-number-compact');
    stats.forEach(stat => {
        const originalText = stat.textContent;
        const number = parseFloat(originalText.replace(/[^0-9.]/g, ''));
        
        if (!isNaN(number)) {
            stat.textContent = '0';
            
            // Запускаем анимацию при попадании в область видимости
            const statObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateNumber(stat, number, originalText);
                        statObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            statObserver.observe(stat.closest('.stat-compact'));
        }
    });
}

// Анимация чисел
function animateNumber(element, target, originalText) {
    const duration = 1500;
    const startTime = Date.now();
    
    // Проверяем, является ли значение числом или форматом типа "24/7"
    const isSpecialFormat = originalText.includes('/') || 
                           originalText.includes('+') || 
                           originalText.includes('%');
    
    if (isSpecialFormat) {
        // Для форматов типа "24/7", "99.9%", "10,000+" - показываем сразу
        setTimeout(() => {
            element.textContent = originalText;
            element.classList.add('animated');
        }, 500);
        return;
    }
    
    // Для обычных чисел - анимация
    const startValue = 0;
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Эффект easeOut
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);
        
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.classList.add('animated');
        }
    }
    
    requestAnimationFrame(update);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initCompactFeatures();
});