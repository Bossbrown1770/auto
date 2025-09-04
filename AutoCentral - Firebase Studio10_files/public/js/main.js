// Main JavaScript file for Car Dealership Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeComponents();
    
    // Auto-hide alerts after 5 seconds
    autoHideAlerts();
    
    // Initialize form validations
    initializeFormValidation();
    
    // Initialize image gallery
    initializeImageGallery();
    
    // Initialize admin features
    if (document.querySelector('.admin-panel')) {
        initializeAdminFeatures();
    }
});

/**
 * Initialize all components
 */
function initializeComponents() {
    console.log('Car Dealership Website loaded successfully');
    
    // Add loading states to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn && form.checkValidity()) {
                submitBtn.classList.add('btn-loading');
                submitBtn.disabled = true;
            }
        });
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Auto-hide alerts after 5 seconds
 */
function autoHideAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        // Don't auto-hide permanent alerts (those without dismiss button)
        if (!alert.querySelector('.btn-close')) {
            return;
        }
        
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
}

/**
 * Initialize form validation
 */
function initializeFormValidation() {
    // Bootstrap form validation
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
    
    // Custom validation for specific fields
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            const phoneRegex = /^\+?[\d\s-()]+$/;
            if (this.value && !phoneRegex.test(this.value)) {
                this.setCustomValidity('Please enter a valid phone number');
            } else {
                this.setCustomValidity('');
            }
        });
    });
    
    // Price validation for car forms
    const priceInputs = document.querySelectorAll('input[name="price"]');
    priceInputs.forEach(input => {
        input.addEventListener('input', function() {
            const price = parseFloat(this.value);
            if (price > 3000) {
                this.setCustomValidity('Price must be under $3000');
            } else {
                this.setCustomValidity('');
            }
        });
    });
}

/**
 * Initialize image gallery
 */
function initializeImageGallery() {
    const galleryThumbs = document.querySelectorAll('.gallery-thumb');
    const mainImage = document.querySelector('.main-gallery-image');
    
    if (galleryThumbs.length && mainImage) {
        galleryThumbs.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const newSrc = this.src;
                const newAlt = this.alt;
                
                // Fade out
                mainImage.style.opacity = '0.5';
                
                setTimeout(() => {
                    mainImage.src = newSrc;
                    mainImage.alt = newAlt;
                    mainImage.style.opacity = '1';
                }, 150);
                
                // Update active thumbnail
                galleryThumbs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
}

/**
 * Initialize admin-specific features
 */
function initializeAdminFeatures() {
    // Car availability toggle
    const availabilityToggles = document.querySelectorAll('.availability-toggle');
    availabilityToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const carId = this.dataset.carId;
            const isAvailable = this.checked;
            
            fetch(`/admin/cars/${carId}/toggle`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isAvailable })
            })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    // Revert the toggle if failed
                    this.checked = !isAvailable;
                    showAlert('Error updating car availability', 'danger');
                } else {
                    showAlert('Car availability updated successfully', 'success');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                this.checked = !isAvailable;
                showAlert('Error updating car availability', 'danger');
            });
        });
    });
    
    // Order status update
    const statusSelects = document.querySelectorAll('.order-status-select');
    statusSelects.forEach(select => {
        select.addEventListener('change', function() {
            const orderId = this.dataset.orderId;
            const newStatus = this.value;
            
            fetch(`/admin/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert('Order status updated successfully', 'success');
                } else {
                    showAlert('Error updating order status', 'danger');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('Error updating order status', 'danger');
            });
        });
    });
    
    // Delete confirmations
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const itemType = this.dataset.itemType || 'item';
            const itemName = this.dataset.itemName || 'this item';
            
            if (!confirm(`Are you sure you want to delete ${itemName}? This action cannot be undone.`)) {
                e.preventDefault();
                return false;
            }
        });
    });
}

/**
 * Show alert message
 */
function showAlert(message, type = 'info') {
    const alertsContainer = document.querySelector('.alerts-container') || document.querySelector('.container');
    
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertsContainer.insertBefore(alertElement, alertsContainer.firstChild);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertElement);
        bsAlert.close();
    }, 5000);
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Format date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Debounce function for search
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchInput = document.querySelector('#search-input');
    const searchResults = document.querySelector('#search-results');
    
    if (searchInput && searchResults) {
        const debouncedSearch = debounce(performSearch, 300);
        
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length >= 2) {
                debouncedSearch(query);
            } else {
                searchResults.innerHTML = '';
            }
        });
    }
}

/**
 * Perform search
 */
function performSearch(query) {
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data.cars || []);
        })
        .catch(error => {
            console.error('Search error:', error);
        });
}

/**
 * Display search results
 */
function displaySearchResults(cars) {
    const searchResults = document.querySelector('#search-results');
    
    if (!cars.length) {
        searchResults.innerHTML = '<p class="text-muted">No cars found</p>';
        return;
    }
    
    const resultsHTML = cars.map(car => `
        <div class="search-result-item">
            <a href="/cars/${car._id}" class="text-decoration-none">
                <div class="d-flex align-items-center p-2 border-bottom">
                    <img src="/uploads/${car.images[0] || 'placeholder.jpg'}" 
                         alt="${car.year} ${car.make} ${car.model}" 
                         class="rounded me-3" 
                         style="width: 60px; height: 60px; object-fit: cover;">
                    <div>
                        <h6 class="mb-1">${car.year} ${car.make} ${car.model}</h6>
                        <p class="mb-0 text-primary fw-bold">${formatCurrency(car.price)}</p>
                    </div>
                </div>
            </a>
        </div>
    `).join('');
    
    searchResults.innerHTML = resultsHTML;
}

/**
 * Initialize tooltips and popovers
 */
function initializeBootstrapComponents() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

/**
 * Lazy load images
 */
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Initialize additional components when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeBootstrapComponents();
    initializeLazyLoading();
    initializeSearch();
});

// Export utilities for global use
window.CarDealership = {
    showAlert,
    formatCurrency,
    formatDate,
    debounce
};