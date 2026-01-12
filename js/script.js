// State management
const state = {
    currentGalleryImage: 0,
    selectedPurchase: 'double',
    selectedFragrance: 'original',
    selectedFragrance1: 'original',
    selectedFragrance2: 'original',
    hasAnimated: false
};

// Gallery images (8 total - 4 per row)
const galleryImages = [
    'assets/a.svg',
    'assets/b.svg',
    'assets/c.svg',
    'assets/d.svg',
    'assets/a.svg',
    'assets/b.svg',
    'assets/c.svg',
    'assets/d.svg'
];

// Fragrance data
const fragrances = {
    original: {
        name: 'Original',
        image: 'assets/1.png',
        bestSeller: true
    },
    lily: {
        name: 'Lily',
        image: 'assets/2.svg',
        bestSeller: false
    },
    rose: {
        name: 'Rose',
        image: 'assets/3.svg',
        bestSeller: false
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initGallery();
    initPurchaseOptions();
    initCollection();
    initStatsAnimation();
    initComparisonTable();
});

// Mobile Menu
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
}

// Gallery
function initGallery() {
    const mainImage = document.getElementById('mainImage');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('galleryDots');
    const row1 = document.getElementById('thumbnailRow1');
    const row2 = document.getElementById('thumbnailRow2');

    // Set initial main image
    mainImage.src = galleryImages[state.currentGalleryImage];

    // Create dots
    galleryImages.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `gallery-dot ${idx === state.currentGalleryImage ? 'active' : ''}`;
        dot.addEventListener('click', () => updateGallery(idx));
        dotsContainer.appendChild(dot);
    });

    // Create thumbnails - Row 1 (first 4 images)
    galleryImages.slice(0, 4).forEach((img, idx) => {
        const thumb = createThumbnail(img, idx);
        row1.appendChild(thumb);
    });

    // Create thumbnails - Row 2 (last 4 images)
    galleryImages.slice(4, 8).forEach((img, idx) => {
        const thumb = createThumbnail(img, idx + 4);
        row2.appendChild(thumb);
    });

    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        const newIdx = (state.currentGalleryImage - 1 + galleryImages.length) % galleryImages.length;
        updateGallery(newIdx);
    });

    nextBtn.addEventListener('click', () => {
        const newIdx = (state.currentGalleryImage + 1) % galleryImages.length;
        updateGallery(newIdx);
    });
}

function createThumbnail(imgSrc, idx) {
    const thumb = document.createElement('button');
    thumb.className = `thumbnail ${idx === state.currentGalleryImage ? 'active' : ''}`;
    thumb.innerHTML = `<img src="${imgSrc}" alt="Thumbnail ${idx + 1}">`;
    thumb.addEventListener('click', () => updateGallery(idx));
    return thumb;
}

function updateGallery(idx) {
    state.currentGalleryImage = idx;
    
    // Update main image
    document.getElementById('mainImage').src = galleryImages[idx];
    
    // Update dots
    document.querySelectorAll('.gallery-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === idx);
    });
    
    // Update thumbnails
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === idx);
    });
}

// Purchase Options
function initPurchaseOptions() {
    const singleOption = document.getElementById('singleOption');
    const doubleOption = document.getElementById('doubleOption');
    const singleContent = document.getElementById('singleContent');
    const doubleContent = document.getElementById('doubleContent');

    // Initialize fragrance grids
    initFragranceGrid('singleFragrances', 'single');
    initFragranceGrid('fragrance1Grid', 'fragrance1');
    initFragranceGrid('fragrance2Grid', 'fragrance2');

    // Single option click
    singleOption.querySelector('.option-header').addEventListener('click', () => {
        state.selectedPurchase = 'single';
        updatePurchaseUI();
    });

    // Double option click
    doubleOption.querySelector('.option-header').addEventListener('click', () => {
        state.selectedPurchase = 'double';
        updatePurchaseUI();
    });

    updatePurchaseUI();
    updateCartLink();
}

function initFragranceGrid(gridId, type) {
    const grid = document.getElementById(gridId);
    
    Object.keys(fragrances).forEach(key => {
        const frag = fragrances[key];
        const option = document.createElement('div');
        option.className = 'fragrance-option';
        
        if (type === 'single' && state.selectedFragrance === key) {
            option.classList.add('active');
        } else if (type === 'fragrance1' && state.selectedFragrance1 === key) {
            option.classList.add('active');
        } else if (type === 'fragrance2' && state.selectedFragrance2 === key) {
            option.classList.add('active');
        }
        
        option.innerHTML = `
            <img src="${frag.image}" alt="${frag.name}">
            <span>${frag.name}</span>
            ${frag.bestSeller ? '<span class="best-seller-badge">BEST SELLER</span>' : ''}
        `;
        
        option.addEventListener('click', () => {
            if (type === 'single') {
                state.selectedFragrance = key;
            } else if (type === 'fragrance1') {
                state.selectedFragrance1 = key;
            } else if (type === 'fragrance2') {
                state.selectedFragrance2 = key;
            }
            updateFragranceSelection(gridId, key);
            updateCartLink();
        });
        
        grid.appendChild(option);
    });
}

function updateFragranceSelection(gridId, selectedKey) {
    const grid = document.getElementById(gridId);
    grid.querySelectorAll('.fragrance-option').forEach((opt, idx) => {
        const keys = Object.keys(fragrances);
        opt.classList.toggle('active', keys[idx] === selectedKey);
    });
}

function updatePurchaseUI() {
    const singleOption = document.getElementById('singleOption');
    const doubleOption = document.getElementById('doubleOption');
    const singleContent = document.getElementById('singleContent');
    const doubleContent = document.getElementById('doubleContent');
    const singleButton = document.getElementById('radio-button1');
    const doubleButton = document.getElementById('radio-button2');

    if (state.selectedPurchase === 'single') {
        singleOption.classList.add('active');
        doubleOption.classList.remove('active');
        singleContent.classList.add('active');
        doubleContent.classList.remove('active');
        singleButton.classList.add('active');
        doubleButton.classList.remove('active');
    } else {
        doubleOption.classList.add('active');
        singleOption.classList.remove('active');
        doubleContent.classList.add('active');
        singleContent.classList.remove('active');
        doubleButton.classList.add('active');
        singleButton.classList.remove('active');
    }

    updateCartLink();
}

function updateCartLink() {
    const cartBtn = document.getElementById('addToCartBtn');
    let fragrancePart;
    
    if (state.selectedPurchase === 'double') {
        fragrancePart = `${state.selectedFragrance1}-${state.selectedFragrance2}`;
    } else {
        fragrancePart = state.selectedFragrance;
    }
    
    cartBtn.href = `/cart?purchase=${state.selectedPurchase}&fragrance=${fragrancePart}`;
}

// Collection Accordion
function initCollection() {
    const accordion = document.getElementById('collectionAccordion');
    const items = ['Signature Scents', 'Signature Scents', 'Signature Scents', 'Signature Scents'];

    items.forEach((item, idx) => {
        const accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item';
        
        accordionItem.innerHTML = `
            <button class="accordion-header">
                <span>${item}</span>
                <svg class="plus-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#032e15" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <svg class="minus-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#032e15" stroke-width="2" style="display: none;">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
            <div class="accordion-content">
                <p>Discover our curated line of signature perfumes, designed to become your daily companion.</p>
            </div>
        `;
        
        const header = accordionItem.querySelector('.accordion-header');
        const content = accordionItem.querySelector('.accordion-content');
        const plusIcon = accordionItem.querySelector('.plus-icon');
        const minusIcon = accordionItem.querySelector('.minus-icon');
        
        header.addEventListener('click', () => {
            const isActive = content.classList.contains('active');
            
            // Close all other items
            document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('.plus-icon').forEach(i => i.style.display = 'block');
            document.querySelectorAll('.minus-icon').forEach(i => i.style.display = 'none');
            
            // Toggle current item
            if (!isActive) {
                content.classList.add('active');
                plusIcon.style.display = 'none';
                minusIcon.style.display = 'block';
            }
        });
        
        accordion.appendChild(accordionItem);
    });
}

// Stats Animation
function initStatsAnimation() {
    const statsSection = document.getElementById('statsSection');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !state.hasAnimated) {
                state.hasAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + '%';
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + '%';
            }
        }, duration / steps);
    });
}

// Comparison Table
function initComparisonTable() {
    const tbody = document.getElementById('comparisonTableBody');
    const features = [
        'Scent',
        'Product Consistency',
        'Longevity',
        'Ingredients',
        'Ethical Sourcing',
        'Good And Delivery',
        'Free Consultancy',
        'Rewards',
        'Overall Quality'
    ];

    features.forEach(feature => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${feature}</td>
            <td>
                <div class="check-mark">
                    <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </td>
            <td><div class="empty-mark"></div></td>
            <td><div class="empty-mark"></div></td>
            <td><div class="empty-mark"></div></td>
        `;
        tbody.appendChild(row);
    });
}