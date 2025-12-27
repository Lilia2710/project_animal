// Проверка авторизации и защита маршрутов
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentPage = window.location.pathname.split('/').pop();
    
    // Страницы, доступные только для авторизованных пользователей
    const protectedPages = ['dashboard.html', 'add-pet.html', 'pet-profile.html'];
    
    // Страницы, недоступные для авторизованных пользователей
    const publicOnlyPages = ['login.html', 'register.html'];
    
    // Если пользователь не авторизован и пытается попасть на защищенную страницу
    if (!currentUser && protectedPages.includes(currentPage)) {
        window.location.href = 'login.html';
        return;
    }
    
    // Если пользователь авторизован и пытается попасть на публичную страницу
    if (currentUser && publicOnlyPages.includes(currentPage)) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Обновление навигации в зависимости от статуса авторизации
    updateNavigation(currentUser);
    
    // Добавление функционала выхода
    setupLogoutButton();
});

function updateNavigation(user) {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    
    if (user) {
        // Для авторизованных пользователей
        navLinks.innerHTML = `
            <a href="dashboard.html" class="${isActive('dashboard.html')}">
                <i class="fas fa-tachometer-alt"></i> Личный кабинет
            </a>
            <a href="add-pet.html" class="${isActive('add-pet.html')}">
                <i class="fas fa-plus-circle"></i> Добавить питомца
            </a>
            <button class="btn-logout" id="logoutBtn">
                <i class="fas fa-sign-out-alt"></i> Выйти
            </button>
        `;
    } else {
        // Для неавторизованных пользователей
        navLinks.innerHTML = `
            <a href="index.html" class="${isActive('index.html')}">
                <i class="fas fa-home"></i> Главная
            </a>
            <a href="login.html" class="${isActive('login.html')}">
                <i class="fas fa-sign-in-alt"></i> Вход
            </a>
            <a href="register.html" class="${isActive('register.html')}">
                <i class="fas fa-user-plus"></i> Регистрация
            </a>
        `;
    }
}

function isActive(page) {
    const currentPage = window.location.pathname.split('/').pop();
    return currentPage === page ? 'active' : '';
}

function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Показываем подтверждение
            if (confirm('Вы уверены, что хотите выйти?')) {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            }
        });
    }
}

// Функция для перенаправления после успешной регистрации
function redirectToAddPet() {
    window.location.href = 'add-pet.html';
}

// Функция для перенаправления после добавления питомца
function redirectToDashboard() {
    window.location.href = 'dashboard.html';
}

// Функция для обновления приветствия пользователя
function updateUserGreeting() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;
    
    const greetingElement = document.getElementById('userGreeting');
    const emailElement = document.getElementById('userEmail');
    const phoneElement = document.getElementById('userPhone');
    
    if (greetingElement) {
        greetingElement.textContent = `Добро пожаловать, ${user.fullName}!`;
    }
    
    if (emailElement && user.email) {
        emailElement.innerHTML = `<i class="fas fa-envelope"></i> ${user.email}`;
    }
    
    if (phoneElement) {
        phoneElement.innerHTML = `<i class="fas fa-phone"></i> ${user.phone}`;
    }
}