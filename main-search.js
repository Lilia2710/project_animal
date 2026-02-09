// main-search.js - Поиск животного на главной странице
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('mainChipSearch');
    const searchButton = document.getElementById('mainSearchBtn');
    const resultsContainer = document.getElementById('mainSearchResults');
    
    if (!searchInput || !searchButton || !resultsContainer) return;
    
    // Обработчик клика по кнопке поиска
    searchButton.addEventListener('click', handleSearch);
    
    // Обработчик нажатия Enter в поле ввода
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Функция поиска
    async function handleSearch() {
        const chipNumber = searchInput.value.trim();
        
        if (!chipNumber) {
            showError('Введите номер чипа для поиска');
            return;
        }
        
        // Показываем индикатор загрузки
        showLoading();
        
        try {
            const response = await api.searchByChip(chipNumber);
            
            if (response.success) {
                showSearchResult(response.animal);
            } else {
                throw new Error(response.error || 'Животное не найдено');
            }
            
        } catch (error) {
            showError(error.message || 'Произошла ошибка при поиске');
        }
    }
    
    // Показать результаты поиска
    function showSearchResult(animal) {
        const html = `
            <div class="animal-search-result">
                <div class="result-header">
                    <h3 class="result-pet-name">${escapeHtml(animal.petName)}</h3>
                    <div class="result-chip-number">
                        <i class="fas fa-microchip"></i>
                        ${escapeHtml(animal.chipNumber)}
                    </div>
                </div>
                
                <div class="result-details">
                    <div class="detail-item">
                        <span class="detail-label">Вид</span>
                        <span class="detail-value">${escapeHtml(animal.species)}</span>
                    </div>
                    
                    ${animal.breed ? `
                    <div class="detail-item">
                        <span class="detail-label">Порода</span>
                        <span class="detail-value">${escapeHtml(animal.breed)}</span>
                    </div>` : ''}
                    
                    ${animal.color ? `
                    <div class="detail-item">
                        <span class="detail-label">Окрас</span>
                        <span class="detail-value">${escapeHtml(animal.color)}</span>
                    </div>` : ''}
                    
                    <div class="detail-item">
                        <span class="detail-label">Владелец</span>
                        <span class="detail-value">${escapeHtml(animal.ownerName)}</span>
                    </div>
                    
                    <div class="detail-item">
                        <span class="detail-label">Контакты</span>
                        <span class="detail-value">${escapeHtml(animal.ownerPhone)}</span>
                    </div>
                </div>
                
                ${animal.vaccinations || animal.diseases ? `
                <div class="medical-info-section">
                    <h4><i class="fas fa-file-medical"></i> Медицинская информация</h4>
                    
                    ${animal.vaccinations ? `
                    <div class="medical-content" style="margin-bottom: 20px;">
                        <h5 style="color: var(--lavender); margin-bottom: 10px;">
                            <i class="fas fa-syringe"></i> Прививки
                        </h5>
                        <div class="medical-text">${formatMedicalText(animal.vaccinations)}</div>
                    </div>` : ''}
                    
                    ${animal.diseases ? `
                    <div class="medical-content">
                        <h5 style="color: var(--lavender); margin-bottom: 10px;">
                            <i class="fas fa-stethoscope"></i> Заболевания и аллергии
                        </h5>
                        <div class="medical-text">${formatMedicalText(animal.diseases)}</div>
                    </div>` : ''}
                </div>` : ''}
                
                ${!animal.vaccinations && !animal.diseases ? `
                <div class="medical-info-section">
                    <h4><i class="fas fa-file-medical"></i> Медицинская информация</h4>
                    <div class="no-medical-data">
                        <i class="fas fa-info-circle" style="font-size: 2rem; color: var(--text-muted); margin-bottom: 10px;"></i>
                        <p>Медицинская информация не указана владельцем</p>
                    </div>
                </div>` : ''}
            </div>
        `;
        
        resultsContainer.innerHTML = html;
    }
    
    // Показать ошибку
    function showError(message) {
        const html = `
            <div class="search-error">
                <div class="search-error-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <h4>Ошибка поиска</h4>
                <p>${escapeHtml(message)}</p>
                <button class="btn btn-secondary" onclick="clearSearch()">
                    <i class="fas fa-redo"></i> Попробовать снова
                </button>
            </div>
        `;
        
        resultsContainer.innerHTML = html;
    }
    
    // Показать индикатор загрузки
    function showLoading() {
        const html = `
            <div class="loading-search">
                <div class="loading-spinner"></div>
                <p>Идет поиск животного...</p>
            </div>
        `;
        
        resultsContainer.innerHTML = html;
    }
    
    // Очистить поиск
    window.clearSearch = function() {
        searchInput.value = '';
        resultsContainer.innerHTML = '';
        searchInput.focus();
    }
    
    // Форматирование медицинского текста
    function formatMedicalText(text) {
        if (!text) return '';
        return escapeHtml(text).replace(/\n/g, '<br>');
    }
    
    // Экранирование HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});