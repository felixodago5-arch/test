// ========== FIREBASE SETUP ==========
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  authDomain: "felix-portfolio-8b3a8.firebaseapp.com",
  projectId: "felix-portfolio-8b3a8",
  storageBucket: "felix-portfolio-8b3a8.firebasestorage.app",
  messagingSenderId: "439075265698",
  appId: "1:439075265698:web:058c014a4f4c32a9444bfb"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ========== THEME ==========
const savedTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    document.documentElement.setAttribute('data-theme', e.matches ? 'light' : 'dark');
});

// ========== PRICING MODAL ==========
const pricingBackdrop = document.getElementById('pricingBackdrop');
const pricingClose    = document.getElementById('pricingClose');
const navPricingBtn   = document.getElementById('navPricingBtn');
const arcPricingBtn   = document.getElementById('arcPricingBtn');

function openPricing(e) {
    if (e) e.preventDefault();
    pricingBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closePricing() {
    pricingBackdrop.classList.remove('open');
    document.body.style.overflow = '';
}

navPricingBtn?.addEventListener('click', openPricing);
arcPricingBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (arcOpen) toggleArc(e);
    setTimeout(openPricing, 150);
});
pricingClose?.addEventListener('click', closePricing);
pricingBackdrop?.addEventListener('click', (e) => {
    if (e.target === pricingBackdrop) closePricing();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pricingBackdrop.classList.contains('open')) closePricing();
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    });
});

// ========== CONTACT FORM ==========
document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();
    emailjs.send("service_p7ghusi", "template_5vusssu", {
        name:    document.getElementById("name").value,
        email:   document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value
    }).then(() => { alert("Message sent successfully!"); this.reset(); })
      .catch(() => alert("Failed to send. Try again."));
});

// ========== TESTIMONIAL SLIDER ==========
const trackEl        = document.getElementById('testimonialTrack');
const prevSlideBtn   = document.getElementById('prevBtn');
const nextSlideBtn   = document.getElementById('nextBtn');
const dotsContainerEl = document.getElementById('sliderDots');
let testimonials = [], currentSlide = 0, autoSlideInterval = null;

function getAvatarIcon(name) {
    const icons = ["fa-user-astronaut","fa-user-ninja","fa-user-secret","fa-user-tie","fa-user-circle","fa-user-graduate","fa-user-edit","fa-user-check","fa-brush","fa-palette"];
    if (!name) return "fa-user-astronaut";
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i);
    return icons[Math.abs(hash) % icons.length];
}

function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/[&<>]/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;' }[m]));
}

function buildSlides() {
    if (!testimonials.length) {
        trackEl.innerHTML = '<div class="testimonial-slide"><div class="testimonial-card"><p>No testimonials yet.</p></div></div>';
        dotsContainerEl.innerHTML = '';
        return;
    }
    trackEl.innerHTML = '';
    testimonials.forEach(t => {
        const stars = '★'.repeat(t.rating || 0) + '☆'.repeat(5 - (t.rating || 0));
        const icon  = `fas ${getAvatarIcon(t.name)}`;
        trackEl.innerHTML += `<div class="testimonial-slide"><div class="testimonial-card"><div class="testimonial-rating">${stars}</div><p class="testimonial-content">${escapeHtml(t.text || 'Amazing work!')}</p><div class="testimonial-author"><div class="author-avatar"><i class="${icon} avatar-icon"></i></div><div class="author-info"><h4>${escapeHtml(t.name || 'Client')}</h4><p>${escapeHtml(t.company || 'Happy Client')}</p></div></div></div></div>`;
    });
    updateSliderPosition();
    createDots();
}

function updateSliderPosition() {
    if (testimonials.length) trackEl.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateDotsActive();
}
function createDots() {
    dotsContainerEl.innerHTML = '';
    testimonials.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === currentSlide ? ' active' : '');
        dot.addEventListener('click', () => { goToSlide(i); resetAutoPlay(); });
        dotsContainerEl.appendChild(dot);
    });
}
function updateDotsActive() {
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}
function goToSlide(i)  { if (!testimonials.length) return; currentSlide = (i + testimonials.length) % testimonials.length; updateSliderPosition(); }
function nextSlide()   { goToSlide(currentSlide + 1); resetAutoPlay(); }
function prevSlide()   { goToSlide(currentSlide - 1); resetAutoPlay(); }
function startAutoPlay() { if (autoSlideInterval) clearInterval(autoSlideInterval); if (testimonials.length > 1) autoSlideInterval = setInterval(nextSlide, 5500); }
function resetAutoPlay() { if (autoSlideInterval) clearInterval(autoSlideInterval); startAutoPlay(); }

prevSlideBtn?.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
nextSlideBtn?.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });

async function loadTestimonials() {
    try {
        const snapshot = await getDocs(collection(db, 'testimonials'));
        testimonials = snapshot.docs.map(doc => doc.data()).filter(t => t.text?.trim());
        if (!testimonials.length) throw new Error();
    } catch(e) {
        testimonials = [
            { name: "Jecinter", company: "house essentials ✨️", text: "I'm really happy with the project delivered...", rating: 5 },
            { name: "George",   company: "Nyakwere furnitures",  text: "timely delivery 👏 with mockups...", rating: 5 }
        ];
    }
    buildSlides();
    startAutoPlay();
}

// ========== FLOATING ARC MENU ==========
const arcFab     = document.getElementById('arcFab');
const arcMainBtn = document.getElementById('arcMainBtn');
const arcIconEl  = document.getElementById('arcIcon');
let arcOpen = false;
const ARC_RADIUS = 92;
const arcItemEls = document.querySelectorAll('.arc-item');

function getArcAngles() {
    const rect = arcFab.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const vw = window.innerWidth, vh = window.innerHeight;
    const onRight  = cx > vw / 2;
    const onBottom = cy > vh / 2;
    if (onBottom && onRight)  return { start: -180, end: -90 };
    if (onBottom && !onRight) return { start: -90,  end: 0   };
    if (!onBottom && onRight) return { start: 90,   end: 180 };
    return                           { start: 0,    end: 90  };
}

function positionArcItems() {
    const { start, end } = getArcAngles();
    arcItemEls.forEach((item, idx) => {
        const t     = idx / (arcItemEls.length - 1);
        const angle = start + t * (end - start);
        const rad   = angle * Math.PI / 180;
        const dx    = Math.cos(rad) * ARC_RADIUS;
        const dy    = Math.sin(rad) * ARC_RADIUS;
        item.setAttribute('data-dx', dx);
        item.setAttribute('data-dy', dy);
        const scale = arcOpen ? 1 : 0.5;
        item.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${scale})`;
    });
}

function toggleArc(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    arcOpen = !arcOpen;
    arcFab.classList.toggle('expanded', arcOpen);
    arcIconEl.className = arcOpen ? 'fas fa-times' : 'fas fa-plus';
    positionArcItems();
}

arcItemEls.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const targetId = item.getAttribute('href');
        if (targetId && targetId !== '#') {
            const targetEl = document.querySelector(targetId);
            if (targetEl) window.scrollTo({ top: targetEl.offsetTop - 70, behavior: 'smooth' });
        }
        if (arcOpen) toggleArc(e);
    });
});

document.addEventListener('pointerdown', (e) => {
    if (arcOpen && !arcFab.contains(e.target)) {
        arcOpen = false;
        arcFab.classList.remove('expanded');
        arcIconEl.className = 'fas fa-plus';
        positionArcItems();
    }
});

let dragActive = false, dragMoved = false;
let dragStartX, dragStartY, dragStartLeft, dragStartTop;

function setArcPos(left, top) {
    arcFab.style.left = left + 'px'; arcFab.style.top = top + 'px';
    arcFab.style.right = 'auto'; arcFab.style.bottom = 'auto';
}

function snapToEdges(left, top, vw, vh, w, h) {
    let newLeft = (left + w / 2 < vw / 2) ? 12 : vw - w - 12;
    let newTop  = (top  + h / 2 < vh / 2) ? 12 : vh - h - 12;
    return {
        left: Math.min(Math.max(newLeft, 8), vw - w - 8),
        top:  Math.min(Math.max(newTop,  8), vh - h - 8)
    };
}

function onDragStart(e) {
    if (e.target.closest('.arc-item') && arcOpen) return;
    e.preventDefault();
    dragActive = true; dragMoved = false;
    const clientX = e.clientX ?? e.touches?.[0].clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0].clientY ?? 0;
    dragStartX = clientX; dragStartY = clientY;
    const rect = arcFab.getBoundingClientRect();
    dragStartLeft = rect.left; dragStartTop = rect.top;
    setArcPos(dragStartLeft, dragStartTop);
}

function onDragMove(e) {
    if (!dragActive) return;
    const clientX = e.clientX ?? e.touches?.[0].clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0].clientY ?? 0;
    if (Math.abs(clientX - dragStartX) > 8 || Math.abs(clientY - dragStartY) > 8) {
        dragMoved = true;
        e.preventDefault();
        const vw = window.innerWidth, vh = window.innerHeight;
        const w  = arcFab.offsetWidth,  h = arcFab.offsetHeight;
        setArcPos(
            Math.min(Math.max(dragStartLeft + (clientX - dragStartX), 5), vw - w - 5),
            Math.min(Math.max(dragStartTop  + (clientY - dragStartY), 5), vh - h - 5)
        );
    }
}

function onDragEnd(e) {
    if (!dragActive) return;
    dragActive = false;
    if (!dragMoved) { toggleArc(e); return; }
    const rect = arcFab.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const snapped = snapToEdges(rect.left, rect.top, vw, vh, arcFab.offsetWidth, arcFab.offsetHeight);
    setArcPos(snapped.left, snapped.top);
    if (arcOpen) positionArcItems();
}

arcMainBtn.addEventListener('mousedown', onDragStart);
window.addEventListener('mousemove', onDragMove);
window.addEventListener('mouseup', onDragEnd);
arcMainBtn.addEventListener('touchstart', onDragStart, { passive: false });
window.addEventListener('touchmove', onDragMove, { passive: false });
window.addEventListener('touchend', onDragEnd);
window.addEventListener('resize', () => {
    const rect = arcFab.getBoundingClientRect();
    const snapped = snapToEdges(rect.left, rect.top, window.innerWidth, window.innerHeight, arcFab.offsetWidth, arcFab.offsetHeight);
    setArcPos(snapped.left, snapped.top);
    positionArcItems();
});
positionArcItems();

// ========== SIMPLE LIGHTBOX ==========
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    background:rgba(0,0,0,0.92);
    display:flex;align-items:center;justify-content:center;
    opacity:0;pointer-events:none;
    transition:opacity 0.25s ease;
    padding:20px;cursor:zoom-out;
`;
lightbox.innerHTML = `<img id="lightboxImg" style="max-width:100%;max-height:90vh;border-radius:10px;object-fit:contain;display:block;">`;
document.body.appendChild(lightbox);
lightbox.addEventListener('click', closeLightbox);

function openLightbox(src) {
    document.getElementById('lightboxImg').src = src;
    lightbox.style.opacity = '1';
    lightbox.style.pointerEvents = 'all';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.style.opacity = '0';
    lightbox.style.pointerEvents = 'none';
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// ========== PINTEREST GALLERY ==========
let DESIGNS = [];

async function loadDesigns() {
    try {
        const snapshot = await getDocs(collection(db, 'designs'));
        DESIGNS = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderGallery();
    } catch (err) {
        console.error('Error loading designs:', err);
    }
}
loadDesigns();

let currentFilter = 'all';
const pinGrid      = document.getElementById('pinGrid');
const galleryCount = document.getElementById('galleryCount');
const filterBtns   = document.querySelectorAll('.filter-btn');

function getFiltered() {
    return currentFilter === 'all' ? DESIGNS : DESIGNS.filter(d => d.category === currentFilter);
}

function buildPin(d) {
    const item = document.createElement('div');
    item.className = 'pin-item';
    item.dataset.id = d.id;
    item.dataset.category = d.category || '';
    const imgSrc = d.image || '';
    item.innerHTML = imgSrc
        ? `<img class="pin-img" src="${imgSrc}" alt="${d.title || ''}" style="height:${d.height || 200}px;">
           <div class="pin-overlay"><div class="pin-overlay-title">${d.title || ''}</div><div class="pin-overlay-tag">${d.category || ''}</div></div>`
        : `<div class="pin-placeholder" style="height:${d.height || 200}px;"><i class="fas ${d.icon || 'fa-image'}"></i></div>`;
    if (imgSrc) item.addEventListener('click', () => openLightbox(imgSrc));
    return item;
}

function renderGallery() {
    pinGrid.innerHTML = '';
    const filtered = getFiltered();
    if (!filtered.length) {
        pinGrid.innerHTML = '<div class="pin-empty"><i class="fas fa-search"></i><p>No projects in this category yet.</p></div>';
        galleryCount.textContent = '0 projects';
        return;
    }
    filtered.slice(0, 6).forEach((d, i) => {
        const pin = buildPin(d);
        pin.style.opacity = '0';
        pinGrid.appendChild(pin);
        setTimeout(() => { pin.style.opacity = '1'; pin.classList.add('fade-in'); }, i * 40);
    });
    galleryCount.textContent = `${filtered.length} project${filtered.length !== 1 ? 's' : ''}`;
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderGallery();
    });
});

// ========== TOOLS BAR ANIMATION ==========
const toolCards = document.querySelectorAll('.tool-card[data-pct]');
toolCards.forEach(card => {
    const fill = card.querySelector('.tool-bar-fill');
    if (fill) fill.style.width = '0%';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease, box-shadow 0.3s';
});

const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const card = entry.target;
            const pct  = card.getAttribute('data-pct');
            const fill = card.querySelector('.tool-bar-fill');
            const idx  = Array.from(card.parentElement.querySelectorAll('.tool-card')).indexOf(card);
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                setTimeout(() => { if (fill) fill.style.width = pct + '%'; }, 200);
            }, idx * 100);
            barObserver.unobserve(card);
        }
    });
}, { threshold: 0.15 });
toolCards.forEach(card => barObserver.observe(card));

// ========== 3 PAGE STRUCTURE ==========
const galleryView       = document.getElementById('galleryView');
const searchView        = document.getElementById('searchView');
const galleryBack       = document.getElementById('galleryBack');
const searchBack        = document.getElementById('searchBack');
const openSearch        = document.getElementById('openSearch');
const arcGalleryBtn     = document.getElementById('arcGalleryBtn');
const searchInput       = document.getElementById('searchInput');
const searchClear       = document.getElementById('searchClear');
const searchSuggestions = document.getElementById('searchSuggestions');
const galleryPinGrid    = document.getElementById('galleryPinGrid');
const loadMoreBtn       = document.getElementById('loadMoreBtn');
const loadMoreWrap      = document.getElementById('loadMoreWrap');

const PAGE_SIZE = 8;
let galleryFilter = 'all';
let galleryPage   = 0;

function openView(view) { view.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeView(view) { view.classList.remove('active'); document.body.style.overflow = ''; }

arcGalleryBtn?.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    if (arcOpen) toggleArc(e);
    setTimeout(() => { openView(galleryView); renderGalleryView(); }, 150);
});

galleryBack?.addEventListener('click', () => closeView(galleryView));
searchBack?.addEventListener('click', () => {
    closeView(searchView);
    searchInput.value = '';
    searchClear.classList.remove('visible');
    renderSuggestions('');
});
openSearch?.addEventListener('click', () => {
    openView(searchView);
    setTimeout(() => searchInput.focus(), 300);
    renderSuggestions('');
});

function getGalleryFiltered() {
    return galleryFilter === 'all' ? DESIGNS : DESIGNS.filter(d => d.category === galleryFilter);
}

function renderGalleryView() {
    galleryPage = 0;
    galleryPinGrid.innerHTML = '';
    loadMoreWrap.style.display = 'flex';
    renderGalleryPage();
}

function renderGalleryPage() {
    const filtered = getGalleryFiltered();
    const slice = filtered.slice(galleryPage * PAGE_SIZE, (galleryPage + 1) * PAGE_SIZE);
    slice.forEach((d, i) => {
        const pin = buildGalleryPin(d);
        pin.style.opacity = '0';
        galleryPinGrid.appendChild(pin);
        setTimeout(() => { pin.style.opacity = '1'; pin.classList.add('fade-in'); }, i * 40);
    });
    galleryPage++;
    if (galleryPage * PAGE_SIZE >= filtered.length) loadMoreWrap.style.display = 'none';
}

function buildGalleryPin(d) {
    const item = document.createElement('div');
    item.className = 'pin-item';
    item.dataset.id = d.id;
    const imgSrc = d.image || '';
    item.innerHTML = imgSrc
        ? `<img class="pin-img" src="${imgSrc}" alt="${d.title || ''}" style="height:${d.height || 200}px;">
           <div class="pin-overlay"><div class="pin-overlay-title">${d.title || ''}</div><div class="pin-overlay-tag">${d.category || ''}</div></div>`
        : `<div class="pin-placeholder" style="height:${d.height || 200}px;"><i class="fas ${d.icon || 'fa-image'}"></i></div>`;
    if (imgSrc) item.addEventListener('click', () => openLightbox(imgSrc));
    return item;
}

loadMoreBtn?.addEventListener('click', renderGalleryPage);

document.querySelectorAll('.gallery-filter-bar .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.gallery-filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        galleryFilter = btn.dataset.filter;
        renderGalleryView();
    });
});

searchInput?.addEventListener('input', () => {
    const val = searchInput.value.trim();
    searchClear.classList.toggle('visible', val.length > 0);
    renderSuggestions(val);
});

searchClear?.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.classList.remove('visible');
    renderSuggestions('');
    searchInput.focus();
});

function renderSuggestions(query) {
    const q = query.toLowerCase().trim();

    if (!q.length) {
    searchSuggestions.innerHTML = '';
    return;
}

    // Score each design
    const scored = DESIGNS.map(d => {
        const title    = (d.title    || '').toLowerCase();
        const category = (d.category || '').toLowerCase();
        const desc     = (d.description || '').toLowerCase();
        let score = 0;

        // Exact match scores highest
        if (title.startsWith(q))    score += 10;
        if (title.includes(q))      score += 6;
        if (category.includes(q))   score += 4;
        if (desc.includes(q))       score += 2;

        // Fuzzy — check if all characters appear in order
        if (score === 0 && fuzzyMatch(q, title))    score += 3;
        if (score === 0 && fuzzyMatch(q, category)) score += 1;

        return { d, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);

    if (!scored.length) {
        searchSuggestions.innerHTML = `
            <div class="search-empty">
                <i class="fas fa-search"></i>
                <p>No designs found for "<strong>${q}</strong>"</p>
            </div>`;
        return;
    }

    searchSuggestions.innerHTML = scored.map(({ d }) => suggestionHTML(d, q)).join('');
    attachSuggestionClicks();
}

function fuzzyMatch(query, str) {
    let qi = 0;
    for (let i = 0; i < str.length && qi < query.length; i++) {
        if (str[i] === query[qi]) qi++;
    }
    return qi === query.length;
}

function highlight(text, query) {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return text.slice(0, idx)
        + `<mark style="background:rgba(0,128,128,0.25);color:var(--primary);border-radius:3px;padding:0 2px;">${text.slice(idx, idx + query.length)}</mark>`
        + text.slice(idx + query.length);
}

function suggestionHTML(d, query) {
    return `
        <div class="suggestion-item" data-id="${d.id}">
            <div class="suggestion-thumb">
                ${d.image
                    ? `<img src="${d.image}" alt="${d.title || ''}">`
                    : `<i class="fas ${d.icon || 'fa-image'}"></i>`}
            </div>
            <div class="suggestion-info">
                <div class="suggestion-title">${highlight(d.title || '', query)}</div>
                <div class="suggestion-category">${highlight(d.category || '', query)}</div>
            </div>
        </div>`;
}

function attachSuggestionClicks() {
    searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const design = DESIGNS.find(d => d.id === item.dataset.id);
            if (!design) return;
            closeView(searchView);
            searchInput.value = '';
            searchClear.classList.remove('visible');
            if (design.image) openLightbox(design.image);
        });
    });
}

document.getElementById('viewAllBtn')?.addEventListener('click', () => {
    openView(galleryView);
    renderGalleryView();
});

document.getElementById('viewToolsBtn')?.addEventListener('click', () => {
    openView(document.getElementById('toolsView'));
});

document.getElementById('toolsBack')?.addEventListener('click', () => {
    closeView(document.getElementById('toolsView'));
});

// ========== SEASONAL CARDS ==========
async function loadSeasonalCards() {
    const grid = document.getElementById('seasonalGrid');
    if (!grid) return;
    try {
        const snapshot = await getDocs(collection(db, 'seasonCards'));
        const cards = snapshot.docs
            .map(doc => doc.data())
            .filter(c => c.image)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
        if (!cards.length) { document.getElementById('seasonal-cards').style.display = 'none'; return; }
        grid.innerHTML = cards.map(c => `
            <div class="seasonal-card">
                <img src="${c.image}" alt="featured">
                ${c.text ? `<div class="seasonal-card-text">${c.text}</div>` : ''}
            </div>`).join('');
    } catch(e) {
        const sec = document.getElementById('seasonal-cards');
        if (sec) sec.style.display = 'none';
    }
}
loadSeasonalCards();

// ========== ABOUT ME CARD ==========
const aboutBackdrop = document.getElementById('aboutBackdrop');
const aboutMeBtn    = document.getElementById('aboutMeBtn');
const aboutClose    = document.getElementById('aboutClose');

aboutMeBtn?.addEventListener('click', () => {
    aboutBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
});
aboutClose?.addEventListener('click', () => {
    aboutBackdrop.classList.remove('open');
    document.body.style.overflow = '';
});
aboutBackdrop?.addEventListener('click', (e) => {
    if (e.target === aboutBackdrop) {
        aboutBackdrop.classList.remove('open');
        document.body.style.overflow = '';
    }
});

// ========== SERVICE WORKER ==========
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('SW registered'))
        .catch(err => console.log('SW failed:', err));
}

// ========== INIT ==========
loadTestimonials();
