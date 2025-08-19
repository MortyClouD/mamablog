/**
 * МамаБлог - Основной JavaScript файл
 * Функциональность для аналога Babyblog.ru
 */

class MamaBlog {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeLazyLoading();
        this.setupSearch();
        this.setupMobileMenu();
        this.initializeAnalytics();
        this.setupScrollEffects();
    }

    /**
     * Настройка обработчиков событий
     */
    setupEventListeners() {
        // Плавная прокрутка для якорных ссылок
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Обработка форм
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        });

        // Обработка кнопок "Нравится"
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', this.handleLike.bind(this));
        });

        // Обработка комментариев
        document.querySelectorAll('.comment-form').forEach(form => {
            form.addEventListener('submit', this.handleComment.bind(this));
        });

        // Обработка подписки на рассылку
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleNewsletter.bind(this));
        }
    }

    /**
     * Инициализация ленивой загрузки изображений
     */
    initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Настройка поиска
     */
    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchResults = document.querySelector('.search-results');

        if (searchInput && searchResults) {
            let searchTimeout;

            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();

                if (query.length < 2) {
                    searchResults.style.display = 'none';
                    return;
                }

                searchTimeout = setTimeout(() => {
                    this.performSearch(query);
                }, 300);
            });

            // Закрытие результатов поиска при клике вне
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                    searchResults.style.display = 'none';
                }
            });
        }
    }

    /**
     * Выполнение поиска
     */
    async performSearch(query) {
        try {
            // Здесь должен быть реальный API запрос
            const results = await this.mockSearchAPI(query);
            this.displaySearchResults(results);
        } catch (error) {
            console.error('Ошибка поиска:', error);
        }
    }

    /**
     * Мок API для поиска (замените на реальный)
     */
    async mockSearchAPI(query) {
        // Имитация задержки API
        await new Promise(resolve => setTimeout(resolve, 200));

        const mockData = [
            { title: 'Питание во время беременности', url: '/article/nutrition-pregnancy', category: 'Беременность' },
            { title: 'Уход за новорожденным', url: '/article/newborn-care', category: 'Новорожденные' },
            { title: 'Рецепты для детей', url: '/article/healthy-recipes', category: 'Питание' },
            { title: 'Развитие ребенка по месяцам', url: '/article/child-development', category: 'Развитие' }
        ];

        return mockData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );
    }

    /**
     * Отображение результатов поиска
     */
    displaySearchResults(results) {
        const searchResults = document.querySelector('.search-results');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">Ничего не найдено</div>';
        } else {
            const resultsHTML = results.map(result => `
                <div class="search-result-item">
                    <a href="${result.url}">
                        <div class="result-title">${result.title}</div>
                        <div class="result-category">${result.category}</div>
                    </a>
                </div>
            `).join('');

            searchResults.innerHTML = resultsHTML;
        }

        searchResults.style.display = 'block';
    }

    /**
     * Настройка мобильного меню
     */
    setupMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');

        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
            });

            // Закрытие меню при клике на ссылку
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                });
            });
        }
    }

    /**
     * Инициализация аналитики
     */
    initializeAnalytics() {
        // Отслеживание событий
        this.trackEvent('page_view', {
            page: window.location.pathname,
            referrer: document.referrer
        });

        // Отслеживание времени на странице
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - startTime;
            this.trackEvent('time_on_page', {
                time_spent: timeSpent,
                page: window.location.pathname
            });
        });

        // Отслеживание кликов по статьям
        document.querySelectorAll('.article-card a').forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('article_click', {
                    article_url: link.href,
                    article_title: link.textContent.trim()
                });
            });
        });
    }

    /**
     * Отслеживание событий
     */
    trackEvent(eventName, parameters = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }

        // Yandex.Metrika
        if (typeof ym !== 'undefined') {
            ym(12345678, 'reachGoal', eventName, parameters);
        }

        // Локальное логирование
        console.log('Event tracked:', eventName, parameters);
    }

    /**
     * Настройка эффектов прокрутки
     */
    setupScrollEffects() {
        // Анимация появления элементов при прокрутке
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            document.querySelectorAll('.category-card, .article-card, .feature').forEach(el => {
                observer.observe(el);
            });
        }

        // Параллакс эффект для hero секции
        const hero = document.querySelector('.hero');
        if (hero) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            });
        }
    }

    /**
     * Обработка отправки форм
     */
    handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        // Валидация формы
        if (!this.validateForm(form)) {
            return;
        }

        // Отправка формы
        this.submitForm(form, formData);
    }

    /**
     * Валидация формы
     */
    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'Это поле обязательно для заполнения');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Валидация email
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                this.showFieldError(emailField, 'Введите корректный email');
                isValid = false;
            }
        }

        return isValid;
    }

    /**
     * Отображение ошибки поля
     */
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#e74c3c';
    }

    /**
     * Очистка ошибки поля
     */
    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }

    /**
     * Отправка формы
     */
    async submitForm(form, formData) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';

            // Здесь должен быть реальный API запрос
            await this.mockFormSubmission(formData);

            this.showSuccessMessage(form, 'Форма успешно отправлена!');
            form.reset();

        } catch (error) {
            this.showErrorMessage(form, 'Произошла ошибка при отправке формы');
            console.error('Form submission error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    /**
     * Мок отправки формы (замените на реальный API)
     */
    async mockFormSubmission(formData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Имитация случайной ошибки
        if (Math.random() < 0.1) {
            throw new Error('Network error');
        }
    }

    /**
     * Отображение сообщения об успехе
     */
    showSuccessMessage(form, message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.color = '#27ae60';
        successDiv.style.backgroundColor = '#d5f4e6';
        successDiv.style.padding = '1rem';
        successDiv.style.borderRadius = '8px';
        successDiv.style.marginTop = '1rem';
        successDiv.style.textAlign = 'center';

        form.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    /**
     * Отображение сообщения об ошибке
     */
    showErrorMessage(form, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.backgroundColor = '#fadbd8';
        errorDiv.style.padding = '1rem';
        errorDiv.style.borderRadius = '8px';
        errorDiv.style.marginTop = '1rem';
        errorDiv.style.textAlign = 'center';

        form.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    /**
     * Обработка лайков
     */
    handleLike(e) {
        e.preventDefault();
        const btn = e.currentTarget;
        const likeCount = btn.querySelector('.like-count');
        const isLiked = btn.classList.contains('liked');

        if (isLiked) {
            btn.classList.remove('liked');
            likeCount.textContent = parseInt(likeCount.textContent) - 1;
        } else {
            btn.classList.add('liked');
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
        }

        // Отслеживание события
        this.trackEvent('like_toggle', {
            action: isLiked ? 'unlike' : 'like',
            element: btn.dataset.elementType || 'unknown'
        });
    }

    /**
     * Обработка комментариев
     */
    handleComment(e) {
        e.preventDefault();
        const form = e.target;
        const commentText = form.querySelector('textarea').value.trim();

        if (!commentText) {
            this.showFieldError(form.querySelector('textarea'), 'Введите текст комментария');
            return;
        }

        // Добавление комментария (здесь должна быть интеграция с API)
        this.addComment(commentText, form);
        form.reset();
    }

    /**
     * Добавление комментария
     */
    addComment(text, form) {
        const commentsContainer = form.parentNode.querySelector('.comments-list');
        if (!commentsContainer) return;

        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">Вы</span>
                <span class="comment-date">Сейчас</span>
            </div>
            <div class="comment-text">${text}</div>
        `;

        commentsContainer.appendChild(commentDiv);

        // Отслеживание события
        this.trackEvent('comment_added', {
            comment_length: text.length
        });
    }

    /**
     * Обработка подписки на рассылку
     */
    handleNewsletter(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value.trim();

        if (!email) {
            this.showFieldError(form.querySelector('input[type="email"]'), 'Введите email');
            return;
        }

        // Здесь должна быть интеграция с сервисом рассылок
        this.showSuccessMessage(form, 'Вы успешно подписались на рассылку!');
        form.reset();

        // Отслеживание события
        this.trackEvent('newsletter_subscription', {
            email: email
        });
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new MamaBlog();
});

// Экспорт для использования в других модулях
window.MamaBlog = MamaBlog;
