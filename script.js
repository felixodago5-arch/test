
// THEME TOGGLE
      // THEME — follows system preference
const savedTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// Listen for system theme changes in real time
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    document.documentElement.setAttribute('data-theme', e.matches ? 'light' : 'dark');
});

        // PRICING MODAL
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


        // SMOOTH SCROLL
        document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if(targetId === '#') return;
                const target = document.querySelector(targetId);
                if(target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            });
        });

        // CONTACT FORM
        document.getElementById("contactForm").addEventListener("submit", function(e) {
            e.preventDefault();
            emailjs.send("service_p7ghusi", "template_5vusssu", {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                subject: document.getElementById("subject").value,
                message: document.getElementById("message").value
            }).then(() => { alert("Message sent successfully!"); this.reset(); }).catch(() => alert("Failed to send. Try again."));
        });

        // TESTIMONIAL SLIDER
        const sheetURL = "https://script.google.com/macros/s/AKfycbwTAaZmkE4-OrSm-r7LDN1D8YQ1EVeBjZ7eHFJfDjITLuUOJhcSlKxsgD8BPZIyFQ2S/exec";
        const trackEl = document.getElementById('testimonialTrack');
        const prevSlideBtn = document.getElementById('prevBtn');
        const nextSlideBtn = document.getElementById('nextBtn');
        const dotsContainerEl = document.getElementById('sliderDots');
        let testimonials = [], currentSlide = 0, autoSlideInterval = null;

        function getAvatarIcon(name) {
            const icons = ["fa-user-astronaut","fa-user-ninja","fa-user-secret","fa-user-tie","fa-user-circle","fa-user-graduate","fa-user-edit","fa-user-check","fa-brush","fa-palette"];
            if(!name) return "fa-user-astronaut";
            let hash = 0;
            for(let i=0;i<name.length;i++) hash = ((hash<<5)-hash)+name.charCodeAt(i);
            return icons[Math.abs(hash)%icons.length];
        }

        function buildSlides() {
            if(!testimonials.length) { trackEl.innerHTML='<div class="testimonial-slide"><div class="testimonial-card"><p>No testimonials yet.</p></div></div>'; dotsContainerEl.innerHTML=''; return; }
            trackEl.innerHTML='';
            testimonials.forEach(t=>{
                const stars='★'.repeat(t.rating||0)+'☆'.repeat(5-(t.rating||0));
                const icon=`fas ${getAvatarIcon(t.name)}`;
                trackEl.innerHTML+=`<div class="testimonial-slide"><div class="testimonial-card"><div class="testimonial-rating">${stars}</div><p class="testimonial-content">${escapeHtml(t.text||'Amazing work!')}</p><div class="testimonial-author"><div class="author-avatar"><i class="${icon} avatar-icon"></i></div><div class="author-info"><h4>${escapeHtml(t.name||'Client')}</h4><p>${escapeHtml(t.company||'Happy Client')}</p></div></div></div></div>`;
            });
            updateSliderPosition(); createDots();
        }

        function escapeHtml(s){ if(!s) return ''; return s.replace(/[&<>]/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;' }[m])); }
        function updateSliderPosition(){ if(testimonials.length) trackEl.style.transform=`translateX(-${currentSlide*100}%)`; updateDotsActive(); }
        function createDots(){ dotsContainerEl.innerHTML=''; testimonials.forEach((_,i)=>{ const dot=document.createElement('div'); dot.className='dot'+(i===currentSlide?' active':''); dot.addEventListener('click',()=>{ goToSlide(i); resetAutoPlay(); }); dotsContainerEl.appendChild(dot); }); }
        function updateDotsActive(){ document.querySelectorAll('.dot').forEach((d,i)=>{ d.classList.toggle('active',i===currentSlide); }); }
        function goToSlide(i){ if(!testimonials.length) return; currentSlide=(i+testimonials.length)%testimonials.length; updateSliderPosition(); }
        function nextSlide(){ goToSlide(currentSlide+1); resetAutoPlay(); }
        function prevSlide(){ goToSlide(currentSlide-1); resetAutoPlay(); }
        function startAutoPlay(){ if(autoSlideInterval) clearInterval(autoSlideInterval); if(testimonials.length>1) autoSlideInterval=setInterval(nextSlide,5500); }
        function resetAutoPlay(){ if(autoSlideInterval) clearInterval(autoSlideInterval); startAutoPlay(); }
        function stopAutoPlay(){ if(autoSlideInterval) clearInterval(autoSlideInterval); autoSlideInterval=null; }

        prevSlideBtn?.addEventListener('click',()=>{ prevSlide(); resetAutoPlay(); });
        nextSlideBtn?.addEventListener('click',()=>{ nextSlide(); resetAutoPlay(); });

        async function loadTestimonials(){ try{ const resp=await fetch(sheetURL); const data=await resp.json(); if(Array.isArray(data)&&data.length) testimonials=data.filter(t=>t.text?.trim()); if(!testimonials.length) throw new Error(); }catch(e){ testimonials=[{name:"Sarah Johnson",company:"Creative Mints",text:"Felix designed a stunning logo!",rating:5},{name:"Michael Ochieng",company:"TechHub KE",text:"Exceeded expectations!",rating:5}]; } buildSlides(); startAutoPlay(); }

        const sliderContainerDiv = document.querySelector('.testimonial-slider-container');
        if(sliderContainerDiv){ sliderContainerDiv.addEventListener('mouseenter',stopAutoPlay); sliderContainerDiv.addEventListener('mouseleave',startAutoPlay); }
        document.addEventListener('DOMContentLoaded',loadTestimonials);

        // ========== FLOATING ARC MENU ==========
        const arcFab = document.getElementById('arcFab');
        const arcMainBtn = document.getElementById('arcMainBtn');
        const arcIconEl = document.getElementById('arcIcon');
        let arcOpen = false;
        const ARC_RADIUS = 92;
        const arcItemEls = document.querySelectorAll('.arc-item');

        function getArcAngles() {
            const rect = arcFab.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const onRight  = cx > vw / 2;
            const onBottom = cy > vh / 2;
            if (onBottom && onRight)  return { start: -180, end: -90  };
            if (onBottom && !onRight) return { start: -90,  end: 0    };
            if (!onBottom && onRight) return { start: 90,   end: 180  };
            return                           { start: 0,    end: 90   };
        }

        function positionArcItems() {
            const { start, end } = getArcAngles();
            arcItemEls.forEach((item, idx) => {
                const t = idx / (arcItemEls.length - 1);
                const angle = start + t * (end - start);
                const rad = angle * Math.PI / 180;
                const dx = Math.cos(rad) * ARC_RADIUS;
                const dy = Math.sin(rad) * ARC_RADIUS;
                item.setAttribute('data-dx', dx);
                item.setAttribute('data-dy', dy);
                const scale = arcOpen ? 1 : 0.5;
                item.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${scale})`;
            });
        }

        function updateArcTransforms() {
            positionArcItems();
        }

        function toggleArc(e) {
            if (e && e.stopPropagation) e.stopPropagation();
            arcOpen = !arcOpen;
            if (arcOpen) {
                arcFab.classList.add('expanded');
                arcIconEl.className = 'fas fa-times';
            } else {
                arcFab.classList.remove('expanded');
                arcIconEl.className = 'fas fa-plus';
            }
            updateArcTransforms();
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
                updateArcTransforms();
            }
        });

        let dragActive = false, dragMoved = false;
        let dragStartX, dragStartY, dragStartLeft, dragStartTop;

        function setArcPos(left, top) {
            arcFab.style.left   = left + 'px';
            arcFab.style.top    = top  + 'px';
            arcFab.style.right  = 'auto';
            arcFab.style.bottom = 'auto';
        }

        function snapToEdges(left, top, vw, vh, w, h) {
            let newLeft = (left + w / 2 < vw / 2) ? 12 : vw - w - 12;
            let newTop  = (top  + h / 2 < vh / 2) ? 12 : vh - h - 12;
            newLeft = Math.min(Math.max(newLeft, 8), vw - w - 8);
            newTop  = Math.min(Math.max(newTop,  8), vh - h - 8);
            return { left: newLeft, top: newTop };
        }

        function onDragStart(e) {
            if (e.target.closest('.arc-item') && arcOpen) return;
            e.preventDefault();
            dragActive = true;
            dragMoved  = false;
            const clientX = e.clientX ?? e.touches?.[0].clientX ?? 0;
            const clientY = e.clientY ?? e.touches?.[0].clientY ?? 0;
            dragStartX = clientX;
            dragStartY = clientY;
            const rect = arcFab.getBoundingClientRect();
            dragStartLeft = rect.left;
            dragStartTop  = rect.top;
            setArcPos(dragStartLeft, dragStartTop);
        }

        function onDragMove(e) {
            if (!dragActive) return;
            const clientX = e.clientX ?? e.touches?.[0].clientX ?? 0;
            const clientY = e.clientY ?? e.touches?.[0].clientY ?? 0;
            const dx = Math.abs(clientX - dragStartX);
            const dy = Math.abs(clientY - dragStartY);
            if (dx > 8 || dy > 8) {
                dragMoved = true;
                e.preventDefault();
                let newLeft = dragStartLeft + (clientX - dragStartX);
                let newTop  = dragStartTop  + (clientY - dragStartY);
                const vw = window.innerWidth, vh = window.innerHeight;
                const w  = arcFab.offsetWidth, h = arcFab.offsetHeight;
                newLeft = Math.min(Math.max(newLeft, 5), vw - w - 5);
                newTop  = Math.min(Math.max(newTop,  5), vh - h - 5);
                setArcPos(newLeft, newTop);
            }
        }

        function onDragEnd(e) {
            if (!dragActive) return;
            dragActive = false;
            if (!dragMoved) {
                toggleArc(e);
                return;
            }
            const rect = arcFab.getBoundingClientRect();
            const vw = window.innerWidth, vh = window.innerHeight;
            const w  = arcFab.offsetWidth,  h = arcFab.offsetHeight;
            const snapped = snapToEdges(rect.left, rect.top, vw, vh, w, h);
            setArcPos(snapped.left, snapped.top);
            if (arcOpen) updateArcTransforms();
        }

        arcMainBtn.addEventListener('mousedown', onDragStart);
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', onDragEnd);

        arcMainBtn.addEventListener('touchstart', onDragStart, { passive: false });
        window.addEventListener('touchmove', onDragMove, { passive: false });
        window.addEventListener('touchend', onDragEnd);

        window.addEventListener('resize', () => {
            const rect = arcFab.getBoundingClientRect();
            const vw = window.innerWidth, vh = window.innerHeight;
            const w  = arcFab.offsetWidth,  h = arcFab.offsetHeight;
            const snapped = snapToEdges(rect.left, rect.top, vw, vh, w, h);
            setArcPos(snapped.left, snapped.top);
            positionArcItems();
        });

        positionArcItems();

        // ========== PINTEREST GALLERY ==========
        let DESIGNS = [];

        fetch('designs.json')
            .then(response => response.json())
            .then(data => {
                DESIGNS = data;
                renderGallery();
            })
            .catch(error => console.error('Error loading designs:', error));

        let currentFilter = 'all';
        let activeExpandId = null;

        const pinGrid      = document.getElementById('pinGrid');
        const galleryCount = document.getElementById('galleryCount');
        const filterBtns   = document.querySelectorAll('.filter-btn');

        function getFiltered() {
            return currentFilter === 'all'
                ? DESIGNS
                : DESIGNS.filter(d => d.category === currentFilter);
        }

        function buildPin(d) {
            const item = document.createElement('div');
            item.className = 'pin-item';
            item.dataset.id = d.id;
            item.dataset.category = d.category;

            const imgHtml = d.image
                ? `<img class="pin-img" src="${d.image}" alt="${d.title}" style="height:${d.height}px;">`
                : `<div class="pin-placeholder" style="height:${d.height}px;"><i class="fas ${d.icon}"></i></div>`;

            item.innerHTML = `
                ${imgHtml}
                <div class="pin-overlay">
                    <div class="pin-overlay-title">${d.title}</div>
                    <div class="pin-overlay-tag">${d.category}</div>
                </div>`;

            item.addEventListener('click', () => toggleExpand(d));
            return item;
        }

        function buildExpandRow(d) {
            const filtered = getFiltered();
            const related  = filtered.filter(r => r.category === d.category && r.id !== d.id).slice(0, 8);

            const relatedHtml = related.length
                ? `<div class="pin-related">
                    <div class="pin-related-label">Related Designs</div>
                    <div class="pin-related-strip">
                        ${related.map(r => `
                            <div class="pin-related-thumb" data-id="${r.id}">
                                ${r.image
                                    ? `<img src="${r.image}" alt="${r.title}">`
                                    : `<i class="fas ${r.icon}"></i>`}
                            </div>`).join('')}
                    </div>
                   </div>`
                : '';

            const toolsHtml = d.tools.map(t => `<span class="pin-expand-tool">${t}</span>`).join('');

            const expandImgHtml = d.image
                ? `<div class="pin-expand-img-wrap"><img src="${d.image}" alt="${d.title}"></div>`
                : `<div class="pin-expand-img-wrap"><div class="pin-expand-placeholder" style="min-height:280px;"><i class="fas ${d.icon}"></i></div></div>`;

            const waMsg = encodeURIComponent(`Hi Felix, I saw your "${d.title}" design and I'd love something similar. Can we talk?`);

            const row = document.createElement('div');
            row.className = 'pin-expand-row open';
            row.dataset.expandFor = d.id;
            row.innerHTML = `
                <div class="pin-expand-panel">
                    <button class="pin-expand-close" id="pinExpandClose"><i class="fas fa-times"></i></button>
                    ${expandImgHtml}
                    <div class="pin-expand-info">
                        <div class="pin-expand-tag">${d.category} · ${d.year}</div>
                        <div class="pin-expand-title">${d.title}</div>
                        <div class="pin-expand-desc">${d.description}</div>
                        <div class="pin-expand-tools">${toolsHtml}</div>
                        <a href="https://wa.me/254106723905?text=${waMsg}" target="_blank" class="pin-expand-cta">
                            <i class="fab fa-whatsapp"></i> Order Similar
                        </a>
                        ${relatedHtml}
                    </div>
                </div>`;

            row.querySelector('#pinExpandClose').addEventListener('click', (e) => {
                e.stopPropagation();
                closeExpand();
            });

            row.querySelectorAll('.pin-related-thumb').forEach(thumb => {
                thumb.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const relId  = parseInt(thumb.dataset.id);
                    const relDes = DESIGNS.find(x => x.id === relId);
                    if (relDes) toggleExpand(relDes);
                });
            });

            return row;
        }

        function closeExpand() {
            const existing = pinGrid.querySelector('.pin-expand-row');
            if (existing) existing.remove();
            activeExpandId = null;
        }

        function toggleExpand(d) {
            if (activeExpandId === d.id) { closeExpand(); return; }
            closeExpand();
            activeExpandId = d.id;
            const clickedPin = pinGrid.querySelector(`.pin-item[data-id="${d.id}"]`);
            if (!clickedPin) return;
            const expandRow = buildExpandRow(d);
            clickedPin.after(expandRow);
            setTimeout(() => {
                expandRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 80);
        }

        function renderGallery() {
            closeExpand();
            const filtered = getFiltered();
            pinGrid.innerHTML = '';
            if (filtered.length === 0) {
                pinGrid.innerHTML = '<div class="pin-empty"><i class="fas fa-search"></i><p>No projects in this category yet.</p></div>';
                galleryCount.textContent = '0 projects';
                return;
            }
           filtered.slice(0, 6).forEach((d, i) => {
                const pin = buildPin(d);
                pin.style.opacity = '0';
                pinGrid.appendChild(pin);
                setTimeout(() => {
                    pin.style.opacity = '1';
                    pin.classList.add('fade-in');
                }, i * 40);
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
                    const card  = entry.target;
                    const pct   = card.getAttribute('data-pct');
                    const fill  = card.querySelector('.tool-bar-fill');
                    const siblings = Array.from(card.parentElement.querySelectorAll('.tool-card'));
                    const idx = siblings.indexOf(card);
                    const delay = idx * 100;
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        setTimeout(() => {
                            if (fill) fill.style.width = pct + '%';
                        }, 200);
                    }, delay);
                    barObserver.unobserve(card);
                }
            });
        }, { threshold: 0.15 });

        toolCards.forEach(card => barObserver.observe(card));

// ========== 3 PAGE STRUCTURE ==========
const galleryView = document.getElementById('galleryView');
const searchView  = document.getElementById('searchView');
const galleryBack = document.getElementById('galleryBack');
const searchBack  = document.getElementById('searchBack');
const openSearch  = document.getElementById('openSearch');
const arcGalleryBtn = document.getElementById('arcGalleryBtn');
const searchInput   = document.getElementById('searchInput');
const searchClear   = document.getElementById('searchClear');
const searchSuggestions = document.getElementById('searchSuggestions');
const galleryPinGrid    = document.getElementById('galleryPinGrid');
const loadMoreBtn       = document.getElementById('loadMoreBtn');
const loadMoreWrap      = document.getElementById('loadMoreWrap');

const PAGE_SIZE = 8;
let galleryFilter  = 'all';
let galleryPage    = 0;
let galleryExpand  = null;

// Open / close views
function openView(view) {
    view.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeView(view) {
    view.classList.remove('active');
    document.body.style.overflow = '';
}

// Arc gallery button
arcGalleryBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (arcOpen) toggleArc(e);
    setTimeout(() => {
        openView(galleryView);
        renderGalleryView();
    }, 150);
});

// Back buttons
galleryBack?.addEventListener('click', () => closeView(galleryView));
searchBack?.addEventListener('click', () => {
    closeView(searchView);
    searchInput.value = '';
    searchClear.classList.remove('visible');
    renderSuggestions('');
});

// Open search from gallery
openSearch?.addEventListener('click', () => {
    openView(searchView);
    setTimeout(() => searchInput.focus(), 300);
    renderSuggestions('');
});

// ── Gallery View rendering ──
function getGalleryFiltered() {
    return galleryFilter === 'all'
        ? DESIGNS
        : DESIGNS.filter(d => d.category === galleryFilter);
}

function renderGalleryView() {
    galleryPage = 0;
    galleryExpand = null;
    galleryPinGrid.innerHTML = '';
    loadMoreWrap.style.display = 'flex';
    renderGalleryPage();
}

function renderGalleryPage() {
    const filtered = getGalleryFiltered();
    const start = galleryPage * PAGE_SIZE;
    const slice = filtered.slice(start, start + PAGE_SIZE);

    slice.forEach((d, i) => {
        const pin = buildGalleryPin(d);
        pin.style.opacity = '0';
        galleryPinGrid.appendChild(pin);
        setTimeout(() => {
            pin.style.opacity = '1';
            pin.classList.add('fade-in');
        }, i * 40);
    });

    galleryPage++;

    // Hide load more if no more designs
    if (galleryPage * PAGE_SIZE >= filtered.length) {
        loadMoreWrap.style.display = 'none';
    }
}

function buildGalleryPin(d) {
    const item = document.createElement('div');
    item.className = 'pin-item';
    item.dataset.id = d.id;

    const imgHtml = d.image
        ? `<img class="pin-img" src="${d.image}" alt="${d.title}" style="height:${d.height}px;">`
        : `<div class="pin-placeholder" style="height:${d.height}px;"><i class="fas ${d.icon}"></i></div>`;

    item.innerHTML = `
        ${imgHtml}
        <div class="pin-overlay">
            <div class="pin-overlay-title">${d.title}</div>
            <div class="pin-overlay-tag">${d.category}</div>
        </div>`;

    item.addEventListener('click', () => toggleGalleryExpand(d));
    return item;
}

function toggleGalleryExpand(d) {
    // Remove existing expand
    const existing = galleryPinGrid.querySelector('.pin-expand-row');
    if (existing) existing.remove();

    if (galleryExpand === d.id) {
        galleryExpand = null;
        return;
    }

    galleryExpand = d.id;
    const clickedPin = galleryPinGrid.querySelector(`.pin-item[data-id="${d.id}"]`);
    if (!clickedPin) return;

    const expandRow = buildExpandRow(d);
    clickedPin.after(expandRow);
    setTimeout(() => {
        expandRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
}

// Load more button
loadMoreBtn?.addEventListener('click', renderGalleryPage);

// Gallery filter buttons
document.querySelectorAll('.gallery-filter-bar .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.gallery-filter-bar .filter-btn')
            .forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        galleryFilter = btn.dataset.filter;
        renderGalleryView();
    });
});

// ── Search View ──
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
    const q = query.toLowerCase();
    const results = q.length === 0
        ? DESIGNS.slice(0, 12)
        : DESIGNS.filter(d =>
            d.title.toLowerCase().includes(q) ||
            d.category.toLowerCase().includes(q) ||
            (d.description && d.description.toLowerCase().includes(q)) ||
            (d.tools && d.tools.some(t => t.toLowerCase().includes(q)))
        );

    if (results.length === 0) {
        searchSuggestions.innerHTML = `
            <div class="search-empty">
                <i class="fas fa-search"></i>
                <p>No designs found for "${query}"</p>
            </div>`;
        return;
    }

    searchSuggestions.innerHTML = results.map(d => `
        <div class="suggestion-item" data-id="${d.id}">
            <div class="suggestion-thumb">
                ${d.image
                    ? `<img src="${d.image}" alt="${d.title}">`
                    : `<i class="fas ${d.icon}"></i>`}
            </div>
            <div class="suggestion-info">
                <div class="suggestion-title">${d.title}</div>
                <div class="suggestion-category">${d.category}</div>
            </div>
        </div>
    `).join('');

    // Tap suggestion — go back to gallery focused on that design
    searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = parseInt(item.dataset.id);
            const design = DESIGNS.find(d => d.id === id);
            if (!design) return;
            closeView(searchView);
            searchInput.value = '';
            searchClear.classList.remove('visible');
            // Reset gallery and open expand for selected design
            galleryFilter = design.category;
            document.querySelectorAll('.gallery-filter-bar .filter-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.filter === design.category);
            });
            renderGalleryView();
            setTimeout(() => toggleGalleryExpand(design), 400);
        });
    });
}
document.getElementById('viewAllBtn')?.addEventListener('click', () => {
    openView(galleryView);
    renderGalleryView();
});

