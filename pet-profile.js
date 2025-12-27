// Функционал просмотра профиля питомца
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const animalId = urlParams.get('id');
    
    if (!animalId) {
        showError('ID питомца не указан');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        return;
    }
    
    loadAnimalProfile(animalId);
    setupProfileActions(animalId);
});

async function loadAnimalProfile(animalId) {
    try {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            showError('Пожалуйста, войдите в систему');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }
        
        // В реальном приложении здесь будет запрос к серверу
        const animals = JSON.parse(localStorage.getItem('animalTrackerAnimals')) || [];
        const animal = animals.find(a => a.id === animalId && a.ownerId === user.id);
        
        if (!animal) {
            showError('Питомец не найден или у вас нет доступа');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
            return;
        }
        
        // Заполняем профиль данными
        populateProfile(animal);
        
    } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
        showError('Произошла ошибка при загрузке профиля питомца');
    }
}

function populateProfile(animal) {
    // Заголовок
    document.getElementById('petName').textContent = animal.petName;
    document.getElementById('petChipNumber').textContent = 
        animal.chipNumber ? `Чип: ${animal.chipNumber}` : 'Без микрочипа';
    
    // Основная информация
    document.getElementById('petSpecies').textContent = animal.species || '—';
    document.getElementById('petBreed').textContent = animal.breed || '—';
    document.getElementById('petGender').textContent = animal.gender || '—';
    document.getElementById('petBirthDate').textContent = 
        animal.birthDate ? formatDate(animal.birthDate) : '—';
    document.getElementById('petColor').textContent = animal.color || '—';
    document.getElementById('petAge').textContent = 
        animal.birthDate ? calculateAge(animal.birthDate) : '—';
    
    // Медицинская информация
    populateTextContent('petVaccinations', animal.vaccinations);
    populateTextContent('petDiseases', animal.diseases);
    populateTextContent('petVetInfo', animal.vetInfo);
    
    // Дополнительная информация
    populateTextContent('petDiet', animal.diet);
    populateTextContent('petBehavior', animal.behavior);
    populateTextContent('petAdditionalInfo', animal.additionalInfo);
    
    // Информация о владельце
    document.getElementById('ownerName').textContent = animal.ownerName || '—';
    document.getElementById('ownerPhone').textContent = animal.ownerPhone || '—';
    document.getElementById('registrationDate').textContent = 
        animal.registrationDate ? formatDate(animal.registrationDate) : '—';
    document.getElementById('lastUpdated').textContent = 
        animal.lastUpdated ? formatDate(animal.lastUpdated) : 
        (animal.registrationDate ? formatDate(animal.registrationDate) : '—');
}

function populateTextContent(elementId, text) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (text && text.trim()) {
        // Заменяем переносы строк на HTML
        const formattedText = text.split('\n')
            .map(line => `<p>${escapeHtml(line)}</p>`)
            .join('');
        element.innerHTML = formattedText;
        element.classList.remove('no-data');
    } else {
        element.innerHTML = '<p class="no-data">Информация не указана</p>';
        element.classList.add('no-data');
    }
}

function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    if (years === 0) {
        return `${months} мес.`;
    } else if (months === 0) {
        return `${years} г.`;
    } else {
        return `${years} г. ${months} мес.`;
    }
}

function setupProfileActions(animalId) {
    // Кнопка редактирования
    const editBtn = document.getElementById('editProfileBtn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            window.location.href = `edit-pet.html?id=${animalId}`;
        });
    }
    
    // Кнопка печати
    const printBtn = document.getElementById('printProfileBtn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            printProfile();
        });
    }
    
    // Кнопка удаления
    const deleteBtn = document.getElementById('deleteProfileBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            showDeleteConfirmation(animalId);
        });
    }
}

function printProfile() {
    // Создаем стили для печати
    const printStyles = `
        <style>
            @media print {
                body * {
                    visibility: hidden;
                }
                .section, .section * {
                    visibility: visible;
                }
                .section {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                }
                .navbar, .footer, .profile-actions, .profile-footer-actions {
                    display: none !important;
                }
                .profile-card {
                    break-inside: avoid;
                    margin-bottom: 20px;
                }
                .no-data {
                    color: #999 !important;
                }
            }
        </style>
    `;
    
    // Добавляем стили и печатаем
    document.head.insertAdjacentHTML('beforeend', printStyles);
    window.print();
    
    // Удаляем стили после печати
    setTimeout(() => {
        const styles = document.querySelectorAll('style[media="print"]');
        styles.forEach(style => style.remove());
    }, 100);
}

function showDeleteConfirmation(animalId) {
    // Получаем информацию о питомце для сообщения
    const animals = JSON.parse(localStorage.getItem('animalTrackerAnimals')) || [];
    const animal = animals.find(a => a.id === animalId);
    
    if (!animal) return;
    
    // Используем ту же функцию, что и в edit-pet.js
    if (typeof showDeleteConfirmation === 'function') {
        showDeleteConfirmation(animalId, animal.petName);
    } else {
        // Альтернативная реализация
        if (confirm(`Вы уверены, что хотите удалить питомца "${animal.petName}"?`)) {
            deleteAnimal(animalId);
        }
    }
}

// Вспомогательные функции
function formatDate(dateString) {
    if (!dateString) return '—';
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

function showError(message) {
    alert(message);
}