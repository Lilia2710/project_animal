// Регистрация пользователя
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('userRegistrationForm');
    if (registrationForm) {
        setupPasswordVisibility();
        setupPasswordStrength();
        registrationForm.addEventListener('submit', handleUserRegistration);
    }
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Настройка модальных окон
    setupModalHandlers();
});

function setupPasswordVisibility() {
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                passwordInput.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    }
    
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function() {
            const confirmPasswordInput = document.getElementById('confirmPassword');
            const icon = this.querySelector('i');
            
            if (confirmPasswordInput.type === 'password') {
                confirmPasswordInput.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                confirmPasswordInput.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    }
}

function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthBar || !strengthText) return;
        
        let strength = 0;
        let color = '';
        let text = '';
        
        if (password.length > 0) strength += 20;
        if (password.length >= 8) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^A-Za-z0-9]/.test(password)) strength += 20;
        
        strength = Math.min(strength, 100);
        
        if (strength < 40) {
            color = '#F44336';
            text = 'Слабый';
        } else if (strength < 70) {
            color = '#FF9800';
            text = 'Средний';
        } else if (strength < 90) {
            color = '#2196F3';
            text = 'Хороший';
        } else {
            color = '#4CAF50';
            text = 'Отличный';
        }
        
        strengthBar.style.setProperty('--strength-color', color);
        strengthBar.querySelector('::after').style.width = strength + '%';
        strengthBar.querySelector('::after').style.backgroundColor = color;
        strengthText.textContent = text + ' пароль';
        strengthText.style.color = color;
    });
}

async function handleUserRegistration(e) {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
    };
    
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAccepted = document.getElementById('terms').checked;
    
    // Валидация
    const errors = [];
    
    if (!formData.fullName) errors.push('Введите полное имя');
    if (!formData.phone) errors.push('Введите телефон');
    if (!formData.password) errors.push('Введите пароль');
    if (formData.password.length < 6) errors.push('Пароль должен содержать минимум 6 символов');
    if (formData.password !== confirmPassword) errors.push('Пароли не совпадают');
    if (!termsAccepted) errors.push('Примите условия использования');
    
    if (errors.length > 0) {
        showError(errors.join('<br>'));
        return;
    }
    
    // Проверка существующего пользователя (в реальном приложении - запрос к серверу)
    const users = JSON.parse(localStorage.getItem('animalTrackerUsers')) || [];
    if (users.some(user => user.phone === formData.phone)) {
        showError('Пользователь с таким телефоном уже зарегистрирован');
        return;
    }
    
    try {
        // В реальном приложении здесь будет запрос к серверу
        const newUser = {
            id: Date.now().toString(),
            ...formData,
            registrationDate: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('animalTrackerUsers', JSON.stringify(users));
        
        // Сохраняем текущего пользователя
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // Показываем успешное сообщение
        showSuccess('Регистрация прошла успешно!');
        
        // Перенаправляем на страницу добавления питомца
        document.getElementById('continueToPet')?.addEventListener('click', function() {
            window.location.href = 'add-pet.html';
        });
        
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        showError('Произошла ошибка при регистрации. Попробуйте еще раз.');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const phone = document.getElementById('loginPhone')?.value.trim() || 
                  document.getElementById('phone')?.value.trim();
    const password = document.getElementById('loginPassword')?.value || 
                     document.getElementById('password')?.value;
    
    if (!phone || !password) {
        showError('Введите телефон и пароль');
        return;
    }
    
    try {
        // В реальном приложении здесь будет запрос к серверу
        const users = JSON.parse(localStorage.getItem('animalTrackerUsers')) || [];
        const user = users.find(u => u.phone === phone && u.password === password);
        
        if (!user) {
            showError('Неверный телефон или пароль');
            return;
        }
        
        // Сохраняем текущего пользователя
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Показываем успешное сообщение
        showSuccess('Вход выполнен успешно!');
        
        // Перенаправляем в личный кабинет
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        console.error('Ошибка входа:', error);
        showError('Произошла ошибка при входе. Попробуйте еще раз.');
    }
}

function setupModalHandlers() {
    // Настройка модального окна успеха
    const successModal = document.getElementById('successModal');
    const errorModal = document.getElementById('errorModal');
    
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    }
    
    if (errorModal) {
        errorModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
        
        document.getElementById('errorOkBtn')?.addEventListener('click', function() {
            errorModal.style.display = 'none';
        });
    }
}

function showSuccess(message) {
    const modal = document.getElementById('successModal');
    if (modal) {
        document.getElementById('modalMessage').textContent = message;
        modal.style.display = 'flex';
    } else {
        alert(message);
    }
}

function showError(message) {
    const modal = document.getElementById('errorModal');
    if (modal) {
        document.getElementById('errorMessage').innerHTML = message;
        modal.style.display = 'flex';
    } else {
        alert(message);
    }
}