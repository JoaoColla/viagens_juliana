// Component utility functions and interactive elements

// Animated counter for statistics
function animateCounter(element, start, end, duration) {
    let startTime = null;
    const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Intersection Observer for scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate counters if they exist
                const counters = entry.target.querySelectorAll('[data-counter]');
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.counter);
                    animateCounter(counter, 0, target, 2000);
                });
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.destination-card, .sidebar-section, .evaluations-header').forEach(el => {
        observer.observe(el);
    });
}

// Image lazy loading
function setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Enhanced card hover effects
function setupCardHoverEffects() {
    document.addEventListener('mouseover', (e) => {
        const card = e.target.closest('.destination-card');
        if (card) {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            
            // Add glow effect
            card.style.boxShadow = '0 20px 40px rgba(45, 106, 79, 0.15)';
            
            // Animate card content
            const content = card.querySelector('.destination-card-content');
            if (content) {
                content.style.transform = 'translateY(-4px)';
            }
        }
    });

    document.addEventListener('mouseout', (e) => {
        const card = e.target.closest('.destination-card');
        if (card) {
            card.style.transform = '';
            card.style.boxShadow = '';
            
            const content = card.querySelector('.destination-card-content');
            if (content) {
                content.style.transform = '';
            }
        }
    });
}

// Price animation
function animatePrice(element, newPrice, oldPrice = 0) {
    const duration = 1000;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const currentPrice = Math.round(oldPrice + (newPrice - oldPrice) * easeOut);
        element.textContent = `R$ ${currentPrice.toLocaleString()}`;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };
    
    requestAnimationFrame(animate);
}

// Smooth scroll to element
function smoothScrollTo(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const targetPosition = element.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start = null;
    
    const animation = (currentTime) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    };
    
    requestAnimationFrame(animation);
}

// Easing function for smooth scroll
function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

// Enhanced search with autocomplete
function setupSearchAutocomplete() {
    const searchInput = document.getElementById('destination');
    const suggestions = [];
    
    // Extract unique destinations from data
    destinations.forEach(dest => {
        if (!suggestions.includes(dest.location)) {
            suggestions.push(dest.location);
        }
        if (!suggestions.includes(dest.title)) {
            suggestions.push(dest.title);
        }
    });
    
    // Create suggestions dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'search-suggestions';
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #dee2e6;
        border-top: none;
        border-radius: 0 0 8px 8px;
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
    `;
    
    if (searchInput) {
        searchInput.parentElement.style.position = 'relative';
        searchInput.parentElement.appendChild(dropdown);
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length < 2) {
                dropdown.style.display = 'none';
                return;
            }
            
            const matches = suggestions.filter(item => 
                item.toLowerCase().includes(query)
            ).slice(0, 5);
            
            if (matches.length > 0) {
                dropdown.innerHTML = matches.map(match => 
                    `<div class="suggestion-item" style="padding: 12px; cursor: pointer; border-bottom: 1px solid #f8f9fa;" data-value="${match}">${match}</div>`
                ).join('');
                dropdown.style.display = 'block';
            } else {
                dropdown.style.display = 'none';
            }
        });
        
        dropdown.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-item')) {
                searchInput.value = e.target.dataset.value;
                dropdown.style.display = 'none';
            }
        });
        
        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }
}

// Progressive image loading with blur effect
function createProgressiveImage(src, placeholder) {
    const img = document.createElement('img');
    img.className = 'progressive-image';
    
    // Set placeholder first
    img.src = placeholder || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmOGY5ZmEiLz4KPC9zdmc+';
    img.style.filter = 'blur(5px)';
    img.style.transition = 'filter 0.3s ease';
    
    // Load actual image
    const actualImg = new Image();
    actualImg.onload = () => {
        img.src = src;
        img.style.filter = 'blur(0px)';
    };
    actualImg.src = src;
    
    return img;
}

// Copy to clipboard functionality
function copyToClipboard(text, successMessage = 'Copiado para a área de transferência!') {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMessage, 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text, successMessage);
        });
    } else {
        fallbackCopyToClipboard(text, successMessage);
    }
}

function fallbackCopyToClipboard(text, successMessage) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast(successMessage, 'success');
    } catch (err) {
        showToast('Erro ao copiar', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Keyboard navigation support
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // ESC key to close modals
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeReviewModal();
            }
        }
        
        // Enter key on cards to view details
        if (e.key === 'Enter' && e.target.classList.contains('destination-card')) {
            const destinationId = parseInt(e.target.dataset.id);
            showDestinationDetails(destinationId);
        }
        
        // Arrow keys for navigation
        if (e.key.startsWith('Arrow')) {
            const focusedCard = document.activeElement;
            if (focusedCard && focusedCard.classList.contains('destination-card')) {
                e.preventDefault();
                const cards = Array.from(document.querySelectorAll('.destination-card'));
                const currentIndex = cards.indexOf(focusedCard);
                let nextIndex;
                
                switch (e.key) {
                    case 'ArrowUp':
                    case 'ArrowLeft':
                        nextIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
                        break;
                    case 'ArrowDown':
                    case 'ArrowRight':
                        nextIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
                        break;
                }
                
                if (nextIndex !== undefined) {
                    cards[nextIndex].focus();
                }
            }
        }
    });
    
    // Make cards focusable
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.destination-card').forEach(card => {
            card.setAttribute('tabindex', '0');
        });
    });
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
            
            console.log(`Page loaded in ${loadTime}ms`);
            
            // Report slow loading
            if (loadTime > 3000) {
                console.warn('Page loading is slow:', loadTime);
            }
        }, 0);
    });
    
    // Monitor memory usage (if supported)
    if ('memory' in performance) {
        setInterval(() => {
            const memory = performance.memory;
            const memoryUsage = memory.usedJSHeapSize / memory.totalJSHeapSize;
            
            if (memoryUsage > 0.9) {
                console.warn('High memory usage detected:', memoryUsage);
            }
        }, 60000); // Check every minute
    }
}

// Initialize all component features
document.addEventListener('DOMContentLoaded', function() {
    setupScrollAnimations();
    setupLazyLoading();
    setupCardHoverEffects();
    setupSearchAutocomplete();
    setupKeyboardNavigation();
    initPerformanceMonitoring();
});

// Export functions for use in other scripts
window.ComponentUtils = {
    animateCounter,
    animatePrice,
    smoothScrollTo,
    copyToClipboard,
    createProgressiveImage
};