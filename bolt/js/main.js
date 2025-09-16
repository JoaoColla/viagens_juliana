// Global state
let destinations = [];
let filteredDestinations = [];
let userReviews = [];
let favorites = new Set();
let currentRating = 0;

// DOM Elements
const destinationsGrid = document.getElementById('destinationsGrid');
const priceRange = document.getElementById('priceRange');
const currentPrice = document.getElementById('currentPrice');
const searchBtn = document.querySelector('.search-btn');
const addReviewBtn = document.querySelector('.add-review-btn');
const reviewModal = document.getElementById('reviewModal');
const reviewForm = document.getElementById('reviewForm');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeDestinations();
    loadDestinations();
    setupEventListeners();
    setupRatingSystem();
    updatePriceDisplay();
});

// Sample destinations data
function initializeDestinations() {
    destinations = [
        {
            id: 1,
            title: "Rio de Janeiro",
            location: "Rio de Janeiro, RJ",
            image: "https://images.pexels.com/photos/351283/pexels-photo-351283.jpeg?auto=compress&cs=tinysrgb&w=400",
            description: "Cidade maravilhosa com praias deslumbrantes, Cristo Redentor e cultura vibrante.",
            price: 899,
            rating: 4.8,
            reviewCount: 247,
            type: "nacional",
            category: "stay",
            tags: ["Praia", "Cultura", "Premium"],
            date: "2024-01-15",
            hasGuide: true
        },
        {
            id: 2,
            title: "Fernando de Noronha",
            location: "Pernambuco, PE",
            image: "https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=400",
            description: "Paraíso natural com águas cristalinas e vida marinha exuberante.",
            price: 1899,
            rating: 4.9,
            reviewCount: 189,
            type: "nacional",
            category: "stay",
            tags: ["Praia", "Natureza", "Premium"],
            date: "2024-02-20",
            hasGuide: true
        },
        {
            id: 3,
            title: "Chapada Diamantina",
            location: "Bahia, BA",
            image: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=400",
            description: "Aventura em meio a cachoeiras, grutas e paisagens de tirar o fôlego.",
            price: 649,
            rating: 4.6,
            reviewCount: 156,
            type: "nacional",
            category: "offers",
            tags: ["Aventura", "Natureza"],
            date: "2024-03-10",
            hasGuide: true
        },
        {
            id: 4,
            title: "Paris",
            location: "França",
            image: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400",
            description: "Cidade luz com seus monumentos icônicos, museus e gastronomia refinada.",
            price: 3299,
            rating: 4.7,
            reviewCount: 523,
            type: "internacional",
            category: "stay",
            tags: ["Cultura", "Gastronomia", "Premium"],
            date: "2024-04-15",
            hasGuide: true
        },
        {
            id: 5,
            title: "Tóquio",
            location: "Japão",
            image: "https://images.pexels.com/photos/315191/pexels-photo-315191.jpeg?auto=compress&cs=tinysrgb&w=400",
            description: "Metrópole futurista que combina tradição milenar com tecnologia de ponta.",
            price: 4199,
            rating: 4.8,
            reviewCount: 412,
            type: "internacional",
            category: "trip",
            tags: ["Cultura", "Tecnologia", "Guia"],
            date: "2024-05-20",
            hasGuide: true
        },
        {
            id: 6,
            title: "Machu Picchu",
            location: "Peru",
            image: "https://images.pexels.com/photos/259967/pexels-photo-259967.jpeg?auto=compress&cs=tinysrgb&w=400",
            description: "Sítio arqueológico inca nas montanhas dos Andes peruanos.",
            price: 2299,
            rating: 4.9,
            reviewCount: 287,
            type: "internacional",
            category: "trip",
            tags: ["História", "Aventura", "Guia"],
            date: "2024-06-10",
            hasGuide: true
        },
        {
            id: 7,
            title: "Florianópolis",
            location: "Santa Catarina, SC",
            image: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=400",
            description: "Ilha da magia com 42 praias e vida noturna agitada.",
            price: 599,
            rating: 4.5,
            reviewCount: 198,
            type: "nacional",
            category: "offers",
            tags: ["Praia", "Vida Noturna"],
            date: "2024-07-15",
            hasGuide: false
        },
        {
            id: 8,
            title: "Santorini",
            location: "Grécia",
            image: "https://images.pexels.com/photos/161815/santorini-oia-sunset-greece-161815.jpeg?auto=compress&cs=tinysrgb&w=400",
            description: "Ilha grega com arquitetura única, pores do sol inesquecíveis e vinhos excepcionais.",
            price: 2899,
            rating: 4.8,
            reviewCount: 341,
            type: "internacional",
            category: "stay",
            tags: ["Romance", "Arquitetura", "Premium"],
            date: "2024-08-20",
            hasGuide: false
        }
    ];

    // Load user reviews from localStorage
    const savedReviews = localStorage.getItem('userReviews');
    if (savedReviews) {
        userReviews = JSON.parse(savedReviews);
    }

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favorites = new Set(JSON.parse(savedFavorites));
    }

    filteredDestinations = [...destinations];
}

// Load and display destinations
function loadDestinations() {
    showLoading();
    
    // Simulate loading delay
    setTimeout(() => {
        displayDestinations(filteredDestinations);
    }, 800);
}

function showLoading() {
    destinationsGrid.innerHTML = `
        <div class="destinations-loading">
            <div class="loading-spinner"></div>
            <div class="loading-text">Carregando destinos incríveis...</div>
        </div>
    `;
}

function displayDestinations(destinationsToShow) {
    if (destinationsToShow.length === 0) {
        destinationsGrid.innerHTML = `
            <div class="destinations-empty">
                <div class="empty-icon">🏖️</div>
                <div class="empty-title">Nenhum destino encontrado</div>
                <div class="empty-description">
                    Tente ajustar seus filtros ou fazer uma nova busca para encontrar o destino perfeito.
                </div>
            </div>
        `;
        return;
    }

    const destinationsHTML = destinationsToShow.map(destination => createDestinationCard(destination)).join('');
    destinationsGrid.innerHTML = destinationsHTML;
    destinationsGrid.classList.add('fade-in');
    
    // Setup card interactions
    setupCardInteractions();
}

function createDestinationCard(destination) {
    const isFavorite = favorites.has(destination.id);
    const tags = destination.tags.map(tag => {
        const tagClass = tag === 'Premium' ? 'premium' : tag === 'Guia' ? 'guide' : '';
        return `<span class="destination-tag ${tagClass}">${tag}</span>`;
    }).join('');

    return `
        <div class="destination-card slide-up" data-id="${destination.id}">
            <div class="destination-card-image" style="background-image: url('${destination.image}')">
                <button class="card-favorite ${isFavorite ? 'active' : ''}" data-id="${destination.id}">
                    ${isFavorite ? '❤️' : '🤍'}
                </button>
            </div>
            <div class="destination-card-content">
                <div class="destination-card-header">
                    <div>
                        <h3 class="destination-card-title">${destination.title}</h3>
                        <p class="destination-card-location">📍 ${destination.location}</p>
                    </div>
                </div>
                <div class="destination-tags">
                    ${tags}
                </div>
                <p class="destination-card-description">${destination.description}</p>
                <div class="destination-card-footer">
                    <div class="destination-rating">
                        <span class="rating-stars">${'⭐'.repeat(Math.floor(destination.rating))}</span>
                        <span class="rating-count">${destination.rating} (${destination.reviewCount})</span>
                    </div>
                    <div class="destination-price">
                        R$ ${destination.price.toLocaleString()}
                        <span class="destination-price-period">/pessoa</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function setupCardInteractions() {
    // Favorite buttons
    document.querySelectorAll('.card-favorite').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(parseInt(button.dataset.id));
        });
    });

    // Card clicks
    document.querySelectorAll('.destination-card').forEach(card => {
        card.addEventListener('click', () => {
            const destinationId = parseInt(card.dataset.id);
            showDestinationDetails(destinationId);
        });
    });
}

function toggleFavorite(destinationId) {
    const button = document.querySelector(`[data-id="${destinationId}"].card-favorite`);
    
    if (favorites.has(destinationId)) {
        favorites.delete(destinationId);
        button.innerHTML = '🤍';
        button.classList.remove('active');
        showToast('Removido dos favoritos', 'success');
    } else {
        favorites.add(destinationId);
        button.innerHTML = '❤️';
        button.classList.add('active');
        showToast('Adicionado aos favoritos', 'success');
    }
    
    // Save to localStorage
    localStorage.setItem('favorites', JSON.stringify([...favorites]));
}

function showDestinationDetails(destinationId) {
    const destination = destinations.find(d => d.id === destinationId);
    if (!destination) return;

    showToast(`Visualizando ${destination.title}`, 'success');
    // Here you could implement a detailed view modal or navigate to a details page
}

// Event listeners setup
function setupEventListeners() {
    // Search tabs
    document.querySelectorAll('.search-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabType = tab.dataset.tab;
            filterByCategory(tabType);
        });
    });

    // Trip type tabs
    document.querySelectorAll('.trip-type-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.trip-type-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const type = tab.dataset.type;
            filterByType(type);
        });
    });

    // Price range
    priceRange.addEventListener('input', updatePriceDisplay);
    priceRange.addEventListener('change', applyFilters);

    // Search button
    searchBtn.addEventListener('click', performSearch);

    // Sort dropdown
    document.getElementById('sort').addEventListener('change', applySorting);

    // Apply filters button
    document.querySelector('.apply-filters-btn').addEventListener('click', applyFilters);

    // Add review button
    addReviewBtn.addEventListener('click', openReviewModal);

    // Review form
    reviewForm.addEventListener('submit', handleReviewSubmission);

    // Filter checkboxes
    document.querySelectorAll('.checkbox-group input').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
}

function filterByCategory(category) {
    filteredDestinations = destinations.filter(d => d.category === category);
    displayDestinations(filteredDestinations);
}

function filterByType(type) {
    filteredDestinations = destinations.filter(d => d.type === type);
    displayDestinations(filteredDestinations);
}

function updatePriceDisplay() {
    const value = priceRange.value;
    currentPrice.textContent = `R$ ${parseInt(value).toLocaleString()}`;
}

function applyFilters() {
    const maxPrice = parseInt(priceRange.value);
    const activeTab = document.querySelector('.search-tab.active').dataset.tab;
    const activeType = document.querySelector('.trip-type-tab.active').dataset.type;
    const checkboxes = document.querySelectorAll('.checkbox-group input:checked');
    
    let filtered = destinations.filter(destination => {
        // Price filter
        if (destination.price > maxPrice) return false;
        
        // Category filter
        if (destination.category !== activeTab) return false;
        
        // Type filter
        if (destination.type !== activeType) return false;
        
        // Checkbox filters
        if (checkboxes.length > 0) {
            const selectedCategories = Array.from(checkboxes).map(cb => cb.parentElement.textContent.trim());
            // Add logic for checkbox filtering based on your requirements
        }
        
        return true;
    });
    
    filteredDestinations = filtered;
    displayDestinations(filteredDestinations);
    showToast('Filtros aplicados com sucesso', 'success');
}

function applySorting() {
    const sortValue = document.getElementById('sort').value;
    
    let sorted = [...filteredDestinations];
    
    switch (sortValue) {
        case '📊 Mais Avaliados':
            sorted.sort((a, b) => b.reviewCount - a.reviewCount);
            break;
        case '⭐ Melhor Nota':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case '📅 Mais Recentes':
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case '💰 Menor Preço':
            sorted.sort((a, b) => a.price - b.price);
            break;
    }
    
    filteredDestinations = sorted;
    displayDestinations(filteredDestinations);
}

function performSearch() {
    const destination = document.getElementById('destination').value;
    const users = document.getElementById('users').value;
    const date = document.getElementById('date').value;
    
    if (!destination || destination === '📍 Escolher destino') {
        showToast('Por favor, selecione um destino', 'error');
        return;
    }
    
    if (!date) {
        showToast('Por favor, selecione uma data', 'error');
        return;
    }
    
    showToast('Buscando as melhores opções...', 'success');
    loadDestinations();
}

// Review system
function setupRatingSystem() {
    document.querySelectorAll('#ratingInput span').forEach((star, index) => {
        star.addEventListener('click', () => {
            currentRating = index + 1;
            updateRatingDisplay();
        });
        
        star.addEventListener('mouseenter', () => {
            highlightStars(index + 1);
        });
    });
    
    document.getElementById('ratingInput').addEventListener('mouseleave', () => {
        updateRatingDisplay();
    });
}

function highlightStars(rating) {
    document.querySelectorAll('#ratingInput span').forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

function updateRatingDisplay() {
    highlightStars(currentRating);
}

function openReviewModal() {
    reviewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeReviewModal() {
    reviewModal.classList.remove('active');
    document.body.style.overflow = '';
    reviewForm.reset();
    currentRating = 0;
    updateRatingDisplay();
}

function handleReviewSubmission(e) {
    e.preventDefault();
    
    const destinationName = document.getElementById('reviewDestination').value;
    const comment = document.getElementById('reviewComment').value;
    const date = document.getElementById('reviewDate').value;
    
    if (!destinationName || !comment || !date || currentRating === 0) {
        showToast('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    const newReview = {
        id: Date.now(),
        destination: destinationName,
        rating: currentRating,
        comment: comment,
        date: date,
        createdAt: new Date().toISOString()
    };
    
    userReviews.unshift(newReview);
    localStorage.setItem('userReviews', JSON.stringify(userReviews));
    
    updateUserReviewsDisplay();
    closeReviewModal();
    showToast('Avaliação enviada com sucesso!', 'success');
}

function updateUserReviewsDisplay() {
    const reviewsContainer = document.querySelector('.user-reviews');
    
    if (userReviews.length === 0) {
        reviewsContainer.innerHTML = '<p>Você ainda não fez nenhuma avaliação.</p>';
        return;
    }
    
    const reviewsHTML = userReviews.slice(0, 3).map(review => `
        <div class="review-item">
            <div class="review-destination">${review.destination}</div>
            <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
            <div class="review-date">${formatDate(review.date)}</div>
        </div>
    `).join('');
    
    reviewsContainer.innerHTML = reviewsHTML;
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'long' 
    });
}

function showToast(message, type = 'success') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">${type === 'success' ? '✅' : '❌'}</div>
            <div class="toast-text">
                <div class="toast-title">${type === 'success' ? 'Sucesso!' : 'Erro!'}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Initialize user reviews display on load
document.addEventListener('DOMContentLoaded', function() {
    updateUserReviewsDisplay();
});