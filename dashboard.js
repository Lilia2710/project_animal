// Функционал личного кабинета
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем данные пользователя
    loadDashboardData();
    
    // Настройка кнопок и действий
    setupDashboardActions();
    
    // Загружаем активности
    loadActivities();
});

function loadDashboardData() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;
    
    // Обновляем приветствие
    updateUserGreeting();
    
    // Загружаем животных пользователя
    loadUserAnimals();
}

function setupDashboardActions() {
    // Кнопка обновления
    const refreshBtn = document.getElementById('refreshPets');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadUserAnimals();
            showToast('Данные обновлены');
        });
    }
    
    // Поиск по чипу
    const searchChipBtn = document.getElementById('searchChip');
    if (searchChipBtn) {
        searchChipBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showSearchModal();
        });
    }
    
    // Настройки профиля
    const profileSettingsBtn = document.getElementById('profileSettings');
    if (profileSettingsBtn) {
        profileSettingsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showProfileSettings();
        });
    }
}

function showSearchModal() {
    const modal = document.getElementById('searchModal');
    if (!modal) return;
    
    modal.style.display = 'flex';
    
    // Настройка кнопок модального окна
    document.getElementById('cancelSearch')?.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    document.getElementById('performSearch')?.addEventListener('click', function() {
        const chipNumber = document.getElementById('searchChipInput').value.trim();
        if (!chipNumber) {
            showError('Введите номер чипа для поиска');
            return;
        }
        
        performChipSearch(chipNumber);
        modal.style.display = 'none';
    });
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
}

function performChipSearch(chipNumber) {
    const animals = JSON.parse(localStorage.getItem('animalTrackerAnimals')) || [];
    const animal = animals.find(a => a.chipNumber === chipNumber);
    
    if (animal) {
        // В реальном приложении здесь будет переход на страницу профиля
        alert(`Найдено животное: ${animal.petName}\nВладелец: ${animal.ownerName}\nТелефон: ${animal.ownerPhone}`);
    } else {
        showError('Животное с таким номером чипа не найдено');
    }
}

function showProfileSettings() {
    // В реальном приложении здесь будет модальное окно или страница настроек
    alert('Настройки профиля');
    // window.location.href = 'profile-settings.html';
}

function loadActivities() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;
    
    const activities = JSON.parse(localStorage.getItem('userActivities')) || [];
    const userActivities = activities.filter(activity => activity.userId === user.id);
    
    renderActivities(userActivities);
}

function renderActivities(activities) {
    const activitiesList = document.getElementById('activitiesList');
    if (!activitiesList) return;
    
    if (activities.length === 0) {
        activitiesList.innerHTML = `
            <div class="empty-state small">
                <p>Активности не найдены</p>
            </div>
        `;
        return;
    }
    
    activitiesList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas fa-history"></i>
            </div>
            <div class="activity-content">
                <h4>${escapeHtml(activity.message)}</h4>
                <span class="activity-time">${formatTimeAgo(activity.timestamp)}</span>
            </div>
        </div>
    `).join('');
}

function formatTimeAgo(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Только что';
    if (diffMins < 60) return `${diffMins} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays < 7) return `${diffDays} дн. назад`;
    
    return date.toLocaleDateString('ru-RU');
}

function showToast(message) {
    // Создаем элемент тоста
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Добавляем стили
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = 'var(--success)';
    toast.style.color = 'white';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '10000';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    
    document.body.appendChild(toast);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}
// В dashboard.js обновляем функцию viewPetProfile
function viewPetProfile(animalId) {
    window.location.href = `pet-profile.html?id=${animalId}`;
}