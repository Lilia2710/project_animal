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