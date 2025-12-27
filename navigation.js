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
// Обновляем массив защищенных страниц в navigation.js
const protectedPages = ['dashboard.html', 'add-pet.html', 'pet-profile.html', 'edit-pet.html'];

// Добавляем функцию для проверки доступа к редактированию
function checkEditAccess() {
    if (window.location.pathname.includes('edit-pet.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const animalId = urlParams.get('id');
        
        if (!animalId) {
            window.location.href = 'dashboard.html';
            return;
        }
        
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const animals = JSON.parse(localStorage.getItem('animalTrackerAnimals')) || [];
        const animal = animals.find(a => a.id === animalId);
        
        // Проверяем, что питомец существует и принадлежит пользователю
        if (!animal || animal.ownerId !== user?.id) {
            showAccessError();
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 3000);
        }
    }
}

function showAccessError() {
    // Показываем сообщение об ошибке доступа
    const errorHTML = `
        <div class="access-error">
            <div class="access-error-content">
                <i class="fas fa-lock"></i>
                <h3>Доступ запрещен</h3>
                <p>У вас нет прав для редактирования этого питомца</p>
                <p>Перенаправление на главную страницу...</p>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', errorHTML);
    
    // Добавляем стили
    const style = document.createElement('style');
    style.textContent = `
        .access-error {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--bg-modal);
            backdrop-filter: blur(20px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        
        .access-error-content {
            background: var(--gradient-card);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 50px;
            text-align: center;
            max-width: 500px;
            width: 90%;
        }
        
        .access-error-content i {
            font-size: 4rem;
            color: var(--error);
            margin-bottom: 20px;
        }
        
        .access-error-content h3 {
            color: var(--error);
            margin-bottom: 15px;
        }
        
        .access-error-content p {
            color: var(--text-muted);
            margin-bottom: 10px;
        }
    `;
    document.head.appendChild(style);
}

// Вызываем проверку при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // ... существующий код ...
    checkEditAccess();
});