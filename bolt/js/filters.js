// Advanced filtering and search functionality

class FilterManager {
    constructor() {
        this.activeFilters = {
            type: 'nacional',
            category: 'stay',
            priceRange: [0, 5000],
            rating: 0,
            tags: [],
            hasGuide: null,
            dateRange: null
        };
        
        this.searchHistory = this.loadSearchHistory();
        this.filterPresets = this.initializeFilterPresets();
    }

    // Initialize filter presets
    initializeFilterPresets() {
        return {
            'budget': {
                name: 'Viagens Econômicas',
                priceRange: [0, 1000],
                tags: ['Ofertas'],
                description: 'Destinos com ótimo custo-benefício'
            },
            'luxury': {
                name: 'Viagens Premium',
                priceRange: [2000, 5000],
                tags: ['Premium'],
                rating: 4.5,
                description: 'Experiências exclusivas e de alto padrão'
            },
            'adventure': {
                name: 'Aventura',
                tags: ['Aventura', 'Natureza'],
                hasGuide: true,
                description: 'Para os amantes da natureza e aventura'
            },
            'culture': {
                name: 'Cultural',
                tags: ['Cultura', 'História'],
                description: 'Destinos ricos em cultura e história'
            },
            'beach': {
                name: 'Praia',
                tags: ['Praia'],
                description: 'Paraísos tropicais e praias deslumbrantes'
            }
        };
    }

    // Apply comprehensive filtering
    applyFilters(destinations) {
        return destinations.filter(destination => {
            // Type filter (nacional/internacional)
            if (this.activeFilters.type && destination.type !== this.activeFilters.type) {
                return false;
            }

            // Category filter (stay/offers/trip)
            if (this.activeFilters.category && destination.category !== this.activeFilters.category) {
                return false;
            }

            // Price range filter
            if (destination.price < this.activeFilters.priceRange[0] || 
                destination.price > this.activeFilters.priceRange[1]) {
                return false;
            }

            // Rating filter
            if (this.activeFilters.rating > 0 && destination.rating < this.activeFilters.rating) {
                return false;
            }

            // Tags filter
            if (this.activeFilters.tags.length > 0) {
                const hasRequiredTags = this.activeFilters.tags.some(tag => 
                    destination.tags.includes(tag)
                );
                if (!hasRequiredTags) return false;
            }

            // Guide filter
            if (this.activeFilters.hasGuide !== null && 
                destination.hasGuide !== this.activeFilters.hasGuide) {
                return false;
            }

            // Date range filter
            if (this.activeFilters.dateRange) {
                const destDate = new Date(destination.date);
                const [startDate, endDate] = this.activeFilters.dateRange;
                if (destDate < startDate || destDate > endDate) {
                    return false;
                }
            }

            return true;
        });
    }

    // Smart search with fuzzy matching
    performSmartSearch(destinations, query) {
        if (!query || query.trim().length < 2) {
            return destinations;
        }

        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
        
        return destinations.filter(destination => {
            const searchableText = `
                ${destination.title} 
                ${destination.location} 
                ${destination.description} 
                ${destination.tags.join(' ')}
            `.toLowerCase();

            // Calculate relevance score
            let score = 0;
            
            searchTerms.forEach(term => {
                if (destination.title.toLowerCase().includes(term)) {
                    score += 10; // Title match is most important
                }
                if (destination.location.toLowerCase().includes(term)) {
                    score += 8; // Location match is very important
                }
                if (destination.description.toLowerCase().includes(term)) {
                    score += 3; // Description match
                }
                if (destination.tags.some(tag => tag.toLowerCase().includes(term))) {
                    score += 5; // Tag match
                }
                
                // Fuzzy matching for typos
                if (this.fuzzyMatch(term, destination.title.toLowerCase())) {
                    score += 6;
                }
                if (this.fuzzyMatch(term, destination.location.toLowerCase())) {
                    score += 4;
                }
            });

            destination.searchScore = score;
            return score > 0;
        }).sort((a, b) => b.searchScore - a.searchScore);
    }

    // Simple fuzzy matching algorithm
    fuzzyMatch(pattern, text) {
        if (pattern.length > text.length) return false;
        if (pattern === text) return true;

        let patternIdx = 0;
        let textIdx = 0;
        const patternLength = pattern.length;
        const textLength = text.length;

        while (patternIdx < patternLength && textIdx < textLength) {
            if (pattern[patternIdx] === text[textIdx]) {
                patternIdx++;
            }
            textIdx++;
        }

        return patternIdx === patternLength;
    }

    // Advanced sorting options
    applySorting(destinations, sortType) {
        const sorted = [...destinations];

        switch (sortType) {
            case 'relevance':
                return sorted.sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));
            
            case 'price_asc':
                return sorted.sort((a, b) => a.price - b.price);
            
            case 'price_desc':
                return sorted.sort((a, b) => b.price - a.price);
            
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            
            case 'reviews':
                return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
            
            case 'date':
                return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            case 'popularity':
                return sorted.sort((a, b) => {
                    const scoreA = a.rating * a.reviewCount;
                    const scoreB = b.rating * b.reviewCount;
                    return scoreB - scoreA;
                });
            
            default:
                return sorted;
        }
    }

    // Get filter suggestions based on current selection
    getFilterSuggestions(destinations) {
        const suggestions = {
            tags: {},
            priceRanges: {},
            locations: {}
        };

        destinations.forEach(dest => {
            // Count tags
            dest.tags.forEach(tag => {
                suggestions.tags[tag] = (suggestions.tags[tag] || 0) + 1;
            });

            // Group by price ranges
            const priceGroup = this.getPriceGroup(dest.price);
            suggestions.priceRanges[priceGroup] = (suggestions.priceRanges[priceGroup] || 0) + 1;

            // Count locations
            const location = dest.location.split(',')[1]?.trim() || dest.location;
            suggestions.locations[location] = (suggestions.locations[location] || 0) + 1;
        });

        return suggestions;
    }

    getPriceGroup(price) {
        if (price < 500) return 'Até R$ 500';
        if (price < 1000) return 'R$ 500 - R$ 1.000';
        if (price < 2000) return 'R$ 1.000 - R$ 2.000';
        if (price < 3000) return 'R$ 2.000 - R$ 3.000';
        return 'Acima de R$ 3.000';
    }

    // Save and load search history
    saveSearchHistory(query, filters) {
        const searchItem = {
            query,
            filters: { ...filters },
            timestamp: new Date().toISOString(),
            id: Date.now()
        };

        this.searchHistory.unshift(searchItem);
        this.searchHistory = this.searchHistory.slice(0, 10); // Keep only last 10 searches
        
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    loadSearchHistory() {
        try {
            const history = localStorage.getItem('searchHistory');
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Error loading search history:', error);
            return [];
        }
    }

    // Filter presets management
    applyFilterPreset(presetName) {
        const preset = this.filterPresets[presetName];
        if (!preset) return;

        // Apply preset filters
        Object.keys(preset).forEach(key => {
            if (key !== 'name' && key !== 'description') {
                this.activeFilters[key] = preset[key];
            }
        });

        this.updateFilterUI();
        return preset;
    }

    // Update filter UI elements
    updateFilterUI() {
        // Update price range slider
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.value = this.activeFilters.priceRange[1];
            updatePriceDisplay();
        }

        // Update checkboxes
        document.querySelectorAll('.checkbox-group input').forEach(checkbox => {
            const label = checkbox.parentElement.textContent.trim();
            const isChecked = this.shouldCheckboxBeChecked(label);
            checkbox.checked = isChecked;
        });

        // Update rating filter
        const ratingFilter = document.querySelector('.rating-filter .stars');
        if (ratingFilter) {
            ratingFilter.dataset.rating = this.activeFilters.rating;
            this.updateRatingStars(ratingFilter, this.activeFilters.rating);
        }
    }

    shouldCheckboxBeChecked(label) {
        if (label.includes('Viagem + Estadia')) {
            return this.activeFilters.category === 'stay';
        }
        if (label.includes('Viagem sem Estadia')) {
            return this.activeFilters.category === 'offers';
        }
        if (label.includes('Com Guia Turístico')) {
            return this.activeFilters.hasGuide === true;
        }
        return false;
    }

    updateRatingStars(container, rating) {
        const stars = '⭐'.repeat(Math.floor(rating));
        container.innerHTML = `<span>${stars}</span>`;
    }

    // Export current filters for sharing
    exportFilters() {
        const filterParams = new URLSearchParams();
        
        Object.keys(this.activeFilters).forEach(key => {
            const value = this.activeFilters[key];
            if (value !== null && value !== undefined) {
                if (Array.isArray(value)) {
                    filterParams.set(key, JSON.stringify(value));
                } else {
                    filterParams.set(key, value.toString());
                }
            }
        });

        return filterParams.toString();
    }

    // Import filters from URL or share link
    importFilters(filterString) {
        try {
            const params = new URLSearchParams(filterString);
            
            params.forEach((value, key) => {
                if (key in this.activeFilters) {
                    try {
                        // Try to parse as JSON first (for arrays)
                        this.activeFilters[key] = JSON.parse(value);
                    } catch {
                        // If not JSON, use as string/number
                        this.activeFilters[key] = isNaN(value) ? value : Number(value);
                    }
                }
            });

            this.updateFilterUI();
            return true;
        } catch (error) {
            console.error('Error importing filters:', error);
            return false;
        }
    }

    // Reset all filters to default
    resetFilters() {
        this.activeFilters = {
            type: 'nacional',
            category: 'stay',
            priceRange: [0, 5000],
            rating: 0,
            tags: [],
            hasGuide: null,
            dateRange: null
        };
        
        this.updateFilterUI();
        showToast('Filtros redefinidos', 'success');
    }

    // Get active filter count for UI indicator
    getActiveFilterCount() {
        let count = 0;
        
        if (this.activeFilters.priceRange[1] < 5000) count++;
        if (this.activeFilters.rating > 0) count++;
        if (this.activeFilters.tags.length > 0) count++;
        if (this.activeFilters.hasGuide !== null) count++;
        if (this.activeFilters.dateRange !== null) count++;
        
        return count;
    }
}

// Create global filter manager instance
window.filterManager = new FilterManager();

// Enhanced filter application function
function applyAdvancedFilters() {
    const query = document.getElementById('destination')?.value || '';
    
    // Update active filters from UI
    window.filterManager.activeFilters.priceRange[1] = parseInt(document.getElementById('priceRange').value);
    window.filterManager.activeFilters.type = document.querySelector('.trip-type-tab.active').dataset.type;
    window.filterManager.activeFilters.category = document.querySelector('.search-tab.active').dataset.tab;
    
    // Apply search and filters
    let filtered = destinations;
    
    if (query) {
        filtered = window.filterManager.performSmartSearch(filtered, query);
        window.filterManager.saveSearchHistory(query, window.filterManager.activeFilters);
    }
    
    filtered = window.filterManager.applyFilters(filtered);
    
    // Apply sorting
    const sortType = document.getElementById('sort')?.value || 'relevance';
    filtered = window.filterManager.applySorting(filtered, sortType);
    
    // Update global variable and display
    filteredDestinations = filtered;
    displayDestinations(filtered);
    
    // Update filter count indicator
    updateFilterIndicator();
    
    // Show filter suggestions
    showFilterSuggestions(filtered);
}

// Update filter indicator in UI
function updateFilterIndicator() {
    const count = window.filterManager.getActiveFilterCount();
    const indicator = document.querySelector('.filter-indicator') || createFilterIndicator();
    
    if (count > 0) {
        indicator.textContent = count;
        indicator.classList.add('active');
    } else {
        indicator.classList.remove('active');
    }
}

function createFilterIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'filter-indicator';
    indicator.style.cssText = `
        position: absolute;
        top: -8px;
        right: -8px;
        background: var(--orange-accent);
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    `;
    
    const filtersButton = document.querySelector('.apply-filters-btn');
    if (filtersButton) {
        filtersButton.style.position = 'relative';
        filtersButton.appendChild(indicator);
    }
    
    return indicator;
}

// Show dynamic filter suggestions
function showFilterSuggestions(destinations) {
    const suggestions = window.filterManager.getFilterSuggestions(destinations);
    const suggestionsContainer = document.querySelector('.filter-suggestions') || createSuggestionsContainer();
    
    // Create suggestion chips
    const tagsHTML = Object.entries(suggestions.tags)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([tag, count]) => 
            `<span class="suggestion-chip" data-filter="tag" data-value="${tag}">
                ${tag} (${count})
            </span>`
        ).join('');
    
    suggestionsContainer.innerHTML = `
        <h4>Sugestões de Filtros:</h4>
        <div class="suggestion-chips">${tagsHTML}</div>
    `;
    
    // Add click handlers
    suggestionsContainer.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const filterType = chip.dataset.filter;
            const value = chip.dataset.value;
            
            if (filterType === 'tag') {
                if (!window.filterManager.activeFilters.tags.includes(value)) {
                    window.filterManager.activeFilters.tags.push(value);
                    applyAdvancedFilters();
                }
            }
        });
    });
}

function createSuggestionsContainer() {
    const container = document.createElement('div');
    container.className = 'filter-suggestions';
    container.style.cssText = `
        margin-top: var(--space-4);
        padding: var(--space-4);
        background: white;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
    `;
    
    const sidebar = document.querySelector('.right-sidebar');
    if (sidebar) {
        sidebar.appendChild(container);
    }
    
    return container;
}

// Initialize advanced filtering
document.addEventListener('DOMContentLoaded', function() {
    // Replace original applyFilters function
    window.applyFilters = applyAdvancedFilters;
    
    // Add preset buttons
    addFilterPresetButtons();
    
    // Add search history
    addSearchHistorySection();
});

function addFilterPresetButtons() {
    const presetContainer = document.createElement('div');
    presetContainer.className = 'filter-presets';
    presetContainer.innerHTML = `
        <h4>Filtros Rápidos:</h4>
        <div class="preset-buttons">
            ${Object.entries(window.filterManager.filterPresets)
                .map(([key, preset]) => 
                    `<button class="preset-btn" data-preset="${key}">${preset.name}</button>`
                ).join('')}
        </div>
    `;
    
    const sidebar = document.querySelector('.right-sidebar');
    const firstSection = sidebar.querySelector('.sidebar-section');
    
    if (firstSection) {
        sidebar.insertBefore(presetContainer, firstSection);
    }
    
    // Add click handlers
    presetContainer.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const presetName = btn.dataset.preset;
            const preset = window.filterManager.applyFilterPreset(presetName);
            applyAdvancedFilters();
            showToast(`Filtro "${preset.name}" aplicado`, 'success');
        });
    });
}

function addSearchHistorySection() {
    if (window.filterManager.searchHistory.length === 0) return;
    
    const historyContainer = document.createElement('div');
    historyContainer.className = 'search-history';
    historyContainer.innerHTML = `
        <h4>Buscas Recentes:</h4>
        <div class="history-items">
            ${window.filterManager.searchHistory.slice(0, 3)
                .map(item => 
                    `<div class="history-item" data-search='${JSON.stringify(item)}'>
                        <span class="history-query">${item.query}</span>
                        <span class="history-date">${new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>`
                ).join('')}
        </div>
    `;
    
    const sidebar = document.querySelector('.right-sidebar');
    sidebar.appendChild(historyContainer);
    
    // Add click handlers
    historyContainer.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            const searchData = JSON.parse(item.dataset.search);
            document.getElementById('destination').value = searchData.query;
            window.filterManager.activeFilters = { ...searchData.filters };
            window.filterManager.updateFilterUI();
            applyAdvancedFilters();
        });
    });
}

// Export for use in other modules
window.FilterManager = FilterManager;