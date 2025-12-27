// Управление животными
document.addEventListener('DOMContentLoaded', function() {
    const animalForm = document.getElementById('animalRegistrationForm');
    if (animalForm) {
        animalForm.addEventListener('submit', handleAnimalRegistration);
    }
    
    // Настройка модальных окон для животных
    setupAnimalModals();
    
    // Загрузка животных на dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        loadUserAnimals();
    }
});

async function handleAnimalRegistration(e) {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        showError('Пожалуйста, войдите в систему');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    const formData = {
        chipNumber: document.getElementById('chipNumber').value.trim(),
        petName: document.getElementById('petName').value.trim(),
        species: document.getElementById('species').value,
        breed: document.getElementById('breed')?.value.trim() || '',
        birthDate: document.getElementById('birthDate')?.value || '',
        color: document.getElementById('color')?.value.trim() || '',
        gender: document.getElementById('gender')?.value || '',
        vaccinations: document.getElementById('vaccinations')?.value.trim() || '',
        diseases: document.getElementById('diseases')?.value.trim() || '',
        vetInfo: document.getElementById('vetInfo')?.value.trim() || '',
        diet: document.getElementById('diet')?.value.trim() || '',
        behavior: document.getElementById('behavior')?.value.trim() || '',
        additionalInfo: document.getElementById('additionalInfo')?.value.trim() || ''
    };
    
    // Валидация
    const errors = [];
    
    if (!formData.chipNumber) errors.push('Введите номер чипа');
    if (!formData.petName) errors.push('Введите кличку животного');
    if (!formData.species) errors.push('Выберите вид животного');
    
    if (errors.length > 0) {
        showError(errors.join('<br>'));
        return;
    }
    
    try {
        // В реальном приложении здесь будет запрос к серверу
        const animals = JSON.parse(localStorage.getItem('animalTrackerAnimals')) || [];
        
        // Проверка уникальности номера чипа
        if (animals.some(animal => animal.chipNumber === formData.chipNumber)) {
            showError('Животное с таким номером чипа уже зарегистрировано');
            return;
        }
        
        const newAnimal = {
            id: Date.now().toString(),
            ...formData,
            ownerId: user.id,
            ownerName: user.fullName,
            ownerPhone: user.phone,
            registrationDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
        
        animals.push(newAnimal);
        localStorage.setItem('animalTrackerAnimals', JSON.stringify(animals));
        
        // Добавляем активность
        addActivity(`Добавлен питомец: ${formData.petName}`);
        
        // Показываем успешное сообщение
        showSuccess(`Питомец "${formData.petName}" успешно зарегистрирован!`);
        
        // Настройка кнопок в модальном окне
        document.getElementById('goToDashboard')?.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
        
        document.getElementById('addAnotherPet')?.addEventListener('click', function() {
            window.location.href = 'add-pet.html';
        });
        
    } catch (error) {
        console.error('Ошибка регистрации животного:', error);
        showError('Произошла ошибка при регистрации питомца. Попробуйте еще раз.');
    }
}

function loadUserAnimals() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;
    
    const animals = JSON.parse(localStorage.getItem('animalTrackerAnimals')) || [];
    const userAnimals = animals.filter(animal => animal.ownerId === user.id);
    
    updateStats(userAnimals);
    renderAnimalsGrid(userAnimals);
}

function updateStats(animals) {
    const totalPets = document.getElementById('totalPets');
    const vaccinatedPets = document.getElementById('vaccinatedPets');
    const recentPets = document.getElementById('recentPets');
    const chippedPets = document.getElementById('chippedPets');
    
    if (totalPets) totalPets.textContent = animals.length;
    
    if (vaccinatedPets) {
        const vaccinated = animals.filter(animal => animal.vaccinations && animal.vaccinations.trim() !== '').length;
        vaccinatedPets.textContent = vaccinated;
    }
    
    if (recentPets) {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const recent = animals.filter(animal => new Date(animal.registrationDate) > monthAgo).length;
        recentPets.textContent = recent;
    }
    
    if (chippedPets) {
        const chipped = animals.filter(animal => animal.chipNumber && animal.chipNumber.trim() !== '').length;
        chippedPets.textContent = chipped;
    }
}

function renderAnimalsGrid(animals) {
    const petsGrid = document.getElementById('petsGrid');
    if (!petsGrid) return;
    
    if (animals.length === 0) {
        petsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-dog"></i>
                </div>
                <h3>Пока нет питомцев</h3>
                <p>Добавьте первого питомца, чтобы начать использование системы</p>
                <a href="add-pet.html" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Добавить первого питомца
                </a>
            </div>
        `;
        return;
    }
    
    petsGrid.innerHTML = animals.map(animal => `
        <div class="animal-card" data-id="${animal.id}">
            <div class="animal-card-header">
                <h3 class="animal-name">${escapeHtml(animal.petName)}</h3>
                <span class="chip-number">
                    <i class="fas fa-microchip"></i> ${escapeHtml(animal.chipNumber)}
                </span>
            </div>
            
            <div class="animal-card-body">
                <div class="animal-info">
                    <div class="info-row">
                        <span class="info-label">Вид:</span>
                        <span class="info-value">${escapeHtml(animal.species)}</span>
                    </div>
                    ${animal.breed ? `
                    <div class="info-row">
                        <span class="info-label">Порода:</span>
                        <span class="info-value">${escapeHtml(animal.breed)}</span>
                    </div>` : ''}
                    ${animal.gender ? `
                    <div class="info-row">
                        <span class="info-label">Пол:</span>
                        <span class="info-value">${escapeHtml(animal.gender)}</span>
                    </div>` : ''}
                    ${animal.birthDate ? `
                    <div class="info-row">
                        <span class="info-label">Дата рождения:</span>
                        <span class="info-value">${formatDate(animal.birthDate)}</span>
                    </div>` : ''}
                </div>
                
                <div class="animal-actions">
                    <button class="btn-view-pet" data-id="${animal.id}">
                        <i class="fas fa-eye"></i> Просмотреть
                    </button>
                    <button class="btn-edit-pet" data-id="${animal.id}">
                        <i class="fas fa-edit"></i> Редактировать
                    </button>
                </div>
            </div>
            
            <div class="animal-card-footer">
                <span class="registration-date">
                    <i class="fas fa-calendar-alt"></i> 
                    Зарегистрирован: ${formatDate(animal.registrationDate)}
                </span>
            </div>
        </div>
    `).join('');
    
    // Добавляем обработчики событий для кнопок
    addAnimalCardEventListeners();
}

function addAnimalCardEventListeners() {
    // Просмотр профиля питомца
    document.querySelectorAll('.btn-view-pet').forEach(btn => {
        btn.addEventListener('click', function() {
            const animalId = this.getAttribute('data-id');
            viewPetProfile(animalId);
        });
    });
    
    // Редактирование питомца
    document.querySelectorAll('.btn-edit-pet').forEach(btn => {
        btn.addEventListener('click', function() {
            const animalId = this.getAttribute('data-id');
            editPetProfile(animalId);
        });
    });
}

function viewPetProfile(animalId) {
    // В реальном приложении здесь будет переход на страницу профиля
    alert('Просмотр профиля питомца (ID: ' + animalId + ')');
    // window.location.href = `pet-profile.html?id=${animalId}`;
}

function editPetProfile(animalId) {
    // В реальном приложении здесь будет переход на страницу редактирования
    alert('Редактирование профиля питомца (ID: ' + animalId + ')');
    // window.location.href = `edit-pet.html?id=${animalId}`;
}

function addActivity(message) {
    const activities = JSON.parse(localStorage.getItem('userActivities')) || [];
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user) return;
    
    const activity = {
        id: Date.now().toString(),
        userId: user.id,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    activities.unshift(activity);
    // Сохраняем только последние 10 активностей
    localStorage.setItem('userActivities', JSON.stringify(activities.slice(0, 10)));
}

function setupAnimalModals() {
    // Настройка модального окна успеха
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    }
}

function formatDate(dateString) {
    if (!dateString) return 'Не указана';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
// Обновленная функция renderAnimalsGrid в animals.js
function renderAnimalsGrid(animals) {
    const petsGrid = document.getElementById('petsGrid');
    if (!petsGrid) return;
    
    if (animals.length === 0) {
        petsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-dog"></i>
                </div>
                <h3>Пока нет питомцев</h3>
                <p>Добавьте первого питомца, чтобы начать использование системы</p>
                <a href="add-pet.html" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Добавить первого питомца
                </a>
            </div>
        `;
        return;
    }
    
    petsGrid.innerHTML = animals.map(animal => `
        <div class="animal-card" data-id="${animal.id}">
            <div class="animal-card-header">
                <div class="animal-header-info">
                    <h3 class="animal-name">${escapeHtml(animal.petName)}</h3>
                    <div class="animal-badges">
                        ${animal.vaccinations ? 
                            '<span class="badge badge-success"><i class="fas fa-syringe"></i> Привит</span>' : ''}
                        ${animal.chipNumber ? 
                            '<span class="badge badge-info"><i class="fas fa-microchip"></i> Чипирован</span>' : ''}
                    </div>
                </div>
                <span class="chip-number">
                    <i class="fas fa-microchip"></i> ${escapeHtml(animal.chipNumber || 'Без чипа')}
                </span>
            </div>
            
            <div class="animal-card-body">
                <div class="animal-info">
                    <div class="info-row">
                        <span class="info-label">Вид:</span>
                        <span class="info-value">${escapeHtml(animal.species)}</span>
                    </div>
                    ${animal.breed ? `
                    <div class="info-row">
                        <span class="info-label">Порода:</span>
                        <span class="info-value">${escapeHtml(animal.breed)}</span>
                    </div>` : ''}
                    ${animal.gender ? `
                    <div class="info-row">
                        <span class="info-label">Пол:</span>
                        <span class="info-value">${escapeHtml(animal.gender)}</span>
                    </div>` : ''}
                    ${animal.birthDate ? `
                    <div class="info-row">
                        <span class="info-label">Дата рождения:</span>
                        <span class="info-value">${formatDate(animal.birthDate)}</span>
                    </div>` : ''}
                    ${animal.color ? `
                    <div class="info-row">
                        <span class="info-label">Окрас:</span>
                        <span class="info-value">${escapeHtml(animal.color)}</span>
                    </div>` : ''}
                </div>
                
                <div class="animal-medical-summary">
                    ${animal.vaccinations ? `
                    <div class="medical-item">
                        <i class="fas fa-syringe"></i>
                        <span>${getVaccineCount(animal.vaccinations)} прививок</span>
                    </div>` : ''}
                    ${animal.diseases ? `
                    <div class="medical-item">
                        <i class="fas fa-stethoscope"></i>
                        <span>Мед. информация</span>
                    </div>` : ''}
                </div>
            </div>
            
            <div class="animal-card-footer">
                <div class="footer-actions">
                    <button class="btn-action btn-view" data-id="${animal.id}" title="Просмотр">
                        <i class="fas fa-eye"></i>
                        <span>Просмотр</span>
                    </button>
                    <button class="btn-action btn-edit" data-id="${animal.id}" title="Редактировать">
                        <i class="fas fa-edit"></i>
                        <span>Редактировать</span>
                    </button>
                    <button class="btn-action btn-delete" data-id="${animal.id}" title="Удалить">
                        <i class="fas fa-trash"></i>
                        <span>Удалить</span>
                    </button>
                </div>
                <span class="registration-date">
                    <i class="fas fa-calendar-alt"></i> 
                    Обновлен: ${animal.lastUpdated ? formatDate(animal.lastUpdated) : formatDate(animal.registrationDate)}
                </span>
            </div>
        </div>
    `).join('');
    
    // Добавляем обработчики событий для кнопок
    addAnimalCardEventListeners();
}

// Новая функция для подсчета прививок
function getVaccineCount(vaccinations) {
    if (!vaccinations) return 0;
    // Простой подсчет строк в тексте прививок
    return vaccinations.split('\n').filter(line => line.trim().length > 0).length;
}

// Обновленная функция addAnimalCardEventListeners
function addAnimalCardEventListeners() {
    // Просмотр профиля питомца
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const animalId = this.getAttribute('data-id');
            viewPetProfile(animalId);
        });
    });
    
    // Редактирование питомца
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const animalId = this.getAttribute('data-id');
            editPetProfile(animalId);
        });
    });
    
    // Удаление питомца
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const animalId = this.getAttribute('data-id');
            deletePetFromList(animalId);
        });
    });
}

// Функция для перехода на страницу редактирования
function editPetProfile(animalId) {
    window.location.href = `edit-pet.html?id=${animalId}`;
}

// Функция для удаления питомца из списка
function deletePetFromList(animalId) {
    // Получаем информацию о питомце для сообщения
    const animals = JSON.parse(localStorage.getItem('animalTrackerAnimals')) || [];
    const animal = animals.find(a => a.id === animalId);
    
    if (!animal) return;
    
    // Показываем модальное окно подтверждения
    showDeleteConfirmation(animalId, animal.petName);
}

// Функция для показа модального окна подтверждения удаления
function showDeleteConfirmation(animalId, petName) {
    // Создаем модальное окно, если его нет
    if (!document.getElementById('deleteConfirmModal')) {
        const modalHTML = `
            <div id="deleteConfirmModal" class="modal">
                <div class="modal-content">
                    <div class="modal-icon danger">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>Подтверждение удаления</h3>
                    <p id="deleteConfirmMessage">Вы уверены, что хотите удалить питомца "${petName}"? Это действие нельзя отменить.</p>
                    <div class="modal-actions">
                        <button class="btn btn-secondary" id="cancelDelete">
                            <i class="fas fa-times"></i> Отмена
                        </button>
                        <button class="btn btn-danger" id="confirmDelete">
                            <i class="fas fa-trash"></i> Удалить
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Настраиваем обработчики событий
        setupDeleteModalHandlers(animalId);
    }
    
    document.getElementById('deleteConfirmMessage').textContent = 
        `Вы уверены, что хотите удалить питомца "${petName}"? Это действие нельзя отменить.`;
    
    document.getElementById('deleteConfirmModal').style.display = 'flex';
}

function setupDeleteModalHandlers(animalId) {
    const deleteModal = document.getElementById('deleteConfirmModal');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    
    if (!deleteModal || !cancelDeleteBtn || !confirmDeleteBtn) return;
    
    // Удаляем старые обработчики
    const newCancelBtn = cancelDeleteBtn.cloneNode(true);
    const newConfirmBtn = confirmDeleteBtn.cloneNode(true);
    cancelDeleteBtn.parentNode.replaceChild(newCancelBtn, cancelDeleteBtn);
    confirmDeleteBtn.parentNode.replaceChild(newConfirmBtn, confirmDeleteBtn);
    
    // Отмена удаления
    newCancelBtn.addEventListener('click', function() {
        deleteModal.style.display = 'none';
    });
    
    // Подтверждение удаления
    newConfirmBtn.addEventListener('click', async function() {
        await performDeleteAnimal(animalId);
        deleteModal.style.display = 'none';
    });
    
    // Закрытие по клику вне модального окна
    deleteModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
}

async function performDeleteAnimal(animalId) {
    try {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            showError('Пожалуйста, войдите в систему');
            return;
        }
        
        // В реальном приложении здесь будет запрос к серверу
        const animals = JSON.parse(localStorage.getItem('animalTrackerAnimals')) || [];
        const animalIndex = animals.findIndex(a => a.id === animalId && a.ownerId === user.id);
        
        if (animalIndex === -1) {
            showError('Питомец не найден');
            return;
        }
        
        const deletedAnimal = animals[animalIndex];
        
        // Удаляем питомца
        animals.splice(animalIndex, 1);
        localStorage.setItem('animalTrackerAnimals', JSON.stringify(animals));
        
        // Добавляем активность
        addActivity(`Удален питомец: ${deletedAnimal.petName}`);
        
        // Обновляем список на dashboard
        loadUserAnimals();
        
        // Показываем уведомление об успешном удалении
        showSuccessNotification(`Питомец "${deletedAnimal.petName}" успешно удален`);
        
    } catch (error) {
        console.error('Ошибка удаления:', error);
        showError('Произошла ошибка при удалении питомца');
    }
}

function showSuccessNotification(message) {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}