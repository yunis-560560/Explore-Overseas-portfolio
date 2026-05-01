// Firebase — loaded via CDN script tags in HTML (optional)
// If not configured, form data is logged to the console.

let db = null;
try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(window._firebaseConfig || {});
        db = firebase.firestore();
    }
} catch (e) {
    console.info('Firebase not configured — form data will be logged to console.');
}

// ─── NAVBAR MOBILE ─────────────────────────────────────────────────────────────
window.toggleNav = function () {
    document.getElementById('navLinks').classList.toggle('open');
};

// Close nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('open');
    });
});

// ─── ALL COUNTRIES LIST ─────────────────────────────────────────────────────────
const ALL_COUNTRIES = [
    "Dubai (UAE)", "United States of America (USA)", "United Kingdom (UK)", "Canada", "Australia",
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
    "Argentina", "Armenia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
    "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
    "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
    "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
    "Congo (Brazzaville)", "Congo (Kinshasa)", "Costa Rica", "Croatia", "Cuba",
    "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
    "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea",
    "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
    "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
    "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
    "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
    "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
    "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
    "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
    "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
    "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
    "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
    "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru",
    "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
    "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
    "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
    "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
    "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe", "Other"
];

// ─── HERO SEARCH AUTOCOMPLETE ────────────────────────────────────────────────────
const searchInput = document.getElementById('destSearch');
const suggestionsBox = document.getElementById('searchSuggestions');

function selectCountry(country) {
    searchInput.value = country;
    suggestionsBox.innerHTML = '';
    suggestionsBox.classList.remove('open');

    // 1. Specific mapping for known site slugs
    const slugMap = {
        'uae': 'dubai',
        'uae (dubai)': 'dubai',
        'dubai (uae)': 'dubai',
        'dubai': 'dubai',
        'uk': 'uk',
        'united kingdom': 'uk',
        'united kingdom (uk)': 'uk',
        'usa': 'united-states',
        'united states': 'united-states',
        'united states (usa)': 'united-states',
        'united states of america (usa)': 'united-states',
        'sri lanka': 'srilanka'
    };

    let base = country.toLowerCase().trim();
    let slug = slugMap[base];

    if (!slug) {
        // 2. Default extraction logic for items like "UAE (Dubai)"
        if (base.includes('(')) {
            slug = base.split('(')[1].split(')')[0];
        } else {
            slug = base;
        }
        // Clean up: lowercase, replace spaces/specials with hyphens
        slug = slug.trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    // Navigate to the main website's country page
    if (slug) {
        window.location.href = `https://eovisas.com/country/${slug}`;
    }

    // Also update the local form
    const destSelect = document.getElementById('destination');
    if (destSelect) {
        for (let i = 0; i < destSelect.options.length; i++) {
            if (destSelect.options[i].text === country) {
                destSelect.selectedIndex = i;
                break;
            }
        }
    }
}

window.fillSearch = function (dest) {
    selectCountry(dest);
};

searchInput.addEventListener('input', function () {
    const val = this.value.trim().toLowerCase();
    suggestionsBox.innerHTML = '';
    if (!val) { suggestionsBox.classList.remove('open'); return; }

    const matches = ALL_COUNTRIES.filter(c => c.toLowerCase().includes(val));
    if (matches.length === 0) { suggestionsBox.classList.remove('open'); return; }

    matches.slice(0, 10).forEach(country => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.innerHTML = `<i class="fa-solid fa-location-dot" style="color:var(--accent);font-size:0.8rem;"></i> ${country}`;
        item.addEventListener('click', () => selectCountry(country));
        suggestionsBox.appendChild(item);
    });
    suggestionsBox.classList.add('open');
});

// Close on outside click
document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-bar-wrap')) {
        suggestionsBox.classList.remove('open');
    }
});

// Enter key
searchInput.addEventListener('keydown', function (e) {
    const items = suggestionsBox.querySelectorAll('.suggestion-item');
    let active = suggestionsBox.querySelector('.suggestion-item.active');
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!active) items[0]?.classList.add('active');
        else { active.classList.remove('active'); (active.nextElementSibling || items[0]).classList.add('active'); }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!active) items[items.length - 1]?.classList.add('active');
        else { active.classList.remove('active'); (active.previousElementSibling || items[items.length - 1]).classList.add('active'); }
    } else if (e.key === 'Enter') {
        e.preventDefault();
        const chosen = suggestionsBox.querySelector('.suggestion-item.active') || suggestionsBox.querySelector('.suggestion-item');
        if (chosen) { selectCountry(chosen.textContent.trim()); }
        else window.searchDest();
    } else if (e.key === 'Escape') {
        suggestionsBox.classList.remove('open');
    }
});

window.searchDest = function () {
    const val = searchInput.value.trim();
    if (!val) return;
    const match = ALL_COUNTRIES.find(c => c.toLowerCase() === val.toLowerCase());
    selectCountry(match || val);
};

// ─── ANIMATED COUNTERS ──────────────────────────────────────────────────────────
function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        start += step;
        if (start >= target) {
            el.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(start).toLocaleString();
        }
    }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            const target = parseInt(entry.target.dataset.target, 10);
            animateCounter(entry.target, target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.count').forEach(el => counterObserver.observe(el));

// ─── NAVBAR SCROLL EFFECT ───────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (window.scrollY > 60) {
        nav.style.background = 'rgba(255,255,255,0.98)';
        nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
    } else {
        nav.style.background = 'rgba(255,255,255,0.95)';
        nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
    }
});

// ─── CONTACT FORM ───────────────────────────────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    const status = document.getElementById('formStatus');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
    status.textContent = '';
    status.className = 'form-status';

    const formData = {
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        visaType: document.getElementById('visaType').value,
        destination: document.getElementById('destination').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };

    try {
        if (db) {
            await db.collection("applications").add(formData);
        } else {
            console.log("Form Data:", formData);
            await new Promise(r => setTimeout(r, 800)); // simulate delay
        }
        status.textContent = '✅ Application submitted! Our team will contact you within 24 hours.';
        status.classList.add('status-success');
        document.getElementById('contactForm').reset();
    } catch (err) {
        console.error(err);
        status.textContent = '❌ Something went wrong. Please try again or call us directly.';
        status.classList.add('status-error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Application';
    }
});

// ─── SCROLL REVEAL ANIMATION ────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .about-card, .dest-card, .how-step, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// ─── VISA FINDER ─────────────────────────────────────────────────────────────────
const VISA_DATA = {
    evisa: [
        'Vietnam', 'Indonesia', 'Dubai (UAE)', 'Thailand', 'Egypt', 'Malaysia',
        'South Africa', 'Hong Kong', 'Australia', 'United Kingdom (UK)', 'Uzbekistan', 'Oman',
        'Azerbaijan', 'Russia', 'Georgia', 'Taiwan', 'Jordan', 'Kenya', 'Turkey',
        'New Zealand', 'Cambodia', 'Qatar', 'Philippines', 'Laos', 'Morocco',
        'Tanzania', 'Ethiopia', 'Mongolia', 'Zambia', 'Armenia', 'Kyrgyzstan',
        'Madagascar', 'Papua New Guinea', 'Bhutan', 'Argentina', 'Kuwait',
        'Israel', 'Antigua & Barbuda', 'Cuba', 'Seychelles', 'Tajikistan',
        'Benin', 'Lebanon', 'Cameroon', 'Malawi', 'Myanmar', 'Uganda', 'Gabon',
        'Togo', 'South Sudan', 'Guinea', 'Cape Verde', 'Moldova',
        'Equatorial Guinea', 'Chile', 'Nigeria', 'Rwanda', 'Sierra Leone',
        'Somalia', 'Namibia', 'Cote D Ivoire', 'Djibouti', 'Bahamas', 'Eritrea',
        'Sao Tome & Principe'
    ],
    sticker: [
        'United States of America (USA)', 'Canada', 'Austria', 'South Korea', 'China', 'Japan', 'France',
        'Switzerland', 'Spain', 'Netherlands', 'Germany', 'Greece', 'Bulgaria',
        'Czech Republic', 'Portugal', 'Poland', 'Brazil', 'Belgium', 'Ireland',
        'Finland', 'Iceland', 'Croatia', 'Bolivia', 'Honduras', 'Venezuela',
        'Dominican Republic', 'Nicaragua', 'Mali', 'Italy', 'Hungary', 'Sweden',
        'Malta', 'Estonia', 'Slovakia', 'Cyprus', 'Mexico', 'Algeria',
        'Lithuania', 'Uruguay', 'Ghana', 'Tunisia', 'Guatemala', 'Eritrea'
    ],
    arrival: [
        'Belarus', 'Saint Lucia', 'Palau', 'Samoa', 'Burundi', 'Mauritania',
        'Marshall Islands', 'Comoros', 'Solomon Islands', 'Guinea-Bissau'
    ],
    free: [
        'Sri Lanka', 'Nepal', 'Maldives', 'Mauritius', 'Jamaica', 'Barbados',
        'Fiji', 'Micronesia', 'El Salvador', 'Trinidad & Tobago', 'Senegal',
        'Saint Kitts & Nevis', 'Haiti', 'Gambia'
    ]
};

const VISA_ICONS = {
    evisa: 'fa-laptop', sticker: 'fa-stamp', arrival: 'fa-plane-arrival', free: 'fa-check-circle'
};

let activeVisaType = 'evisa';
const COUNTRY_ISO = {
    'Vietnam': 'vn', 'Indonesia': 'id', 'Dubai (UAE)': 'ae', 'Thailand': 'th', 'Egypt': 'eg', 'Malaysia': 'my',
    'South Africa': 'za', 'Hong Kong': 'hk', 'Australia': 'au', 'United Kingdom (UK)': 'gb', 'Uzbekistan': 'uz', 'Oman': 'om',
    'Azerbaijan': 'az', 'Russia': 'ru', 'Georgia': 'ge', 'Taiwan': 'tw', 'Jordan': 'jo', 'Kenya': 'ke', 'Turkey': 'tr',
    'New Zealand': 'nz', 'Cambodia': 'kh', 'Qatar': 'qa', 'Philippines': 'ph', 'Laos': 'la', 'Morocco': 'ma',
    'Tanzania': 'tz', 'Ethiopia': 'et', 'Mongolia': 'mn', 'Zambia': 'zm', 'Armenia': 'am', 'Kyrgyzstan': 'kg',
    'Madagascar': 'mg', 'Papua New Guinea': 'pg', 'Bhutan': 'bt', 'Argentina': 'ar', 'Kuwait': 'kw',
    'Israel': 'il', 'Antigua & Barbuda': 'ag', 'Cuba': 'cu', 'Seychelles': 'sc', 'Tajikistan': 'tj',
    'Benin': 'bj', 'Lebanon': 'lb', 'Cameroon': 'cm', 'Malawi': 'mw', 'Myanmar': 'mm', 'Uganda': 'ug', 'Gabon': 'ga',
    'Togo': 'tg', 'South Sudan': 'ss', 'Guinea': 'gn', 'Cape Verde': 'cv', 'Moldova': 'md',
    'Equatorial Guinea': 'gq', 'Chile': 'cl', 'Nigeria': 'ng', 'Rwanda': 'rw', 'Sierra Leone': 'sl',
    'Somalia': 'so', 'Namibia': 'na', 'Cote D Ivoire': 'ci', 'Djibouti': 'dj', 'Bahamas': 'bs', 'Eritrea': 'er',
    'Sao Tome & Principe': 'st', 'United States of America (USA)': 'us', 'Canada': 'ca', 'Austria': 'at', 'South Korea': 'kr', 'China': 'cn',
    'Japan': 'jp', 'France': 'fr', 'Switzerland': 'ch', 'Spain': 'es', 'Netherlands': 'nl', 'Germany': 'de',
    'Greece': 'gr', 'Bulgaria': 'bg', 'Czech Republic': 'cz', 'Portugal': 'pt', 'Poland': 'pl', 'Brazil': 'br',
    'Belgium': 'be', 'Ireland': 'ie', 'Finland': 'fi', 'Iceland': 'is', 'Croatia': 'hr', 'Bolivia': 'bo',
    'Honduras': 'hn', 'Venezuela': 've', 'Dominican Republic': 'do', 'Nicaragua': 'ni', 'Mali': 'ml', 'Italy': 'it',
    'Hungary': 'hu', 'Sweden': 'se', 'Malta': 'mt', 'Estonia': 'ee', 'Slovakia': 'sk', 'Cyprus': 'cy', 'Mexico': 'mx',
    'Algeria': 'dz', 'Lithuania': 'lt', 'Uruguay': 'uy', 'Ghana': 'gh', 'Tunisia': 'tn', 'Guatemala': 'gt',
    'Belarus': 'by', 'Saint Lucia': 'lc', 'Palau': 'pw', 'Samoa': 'ws', 'Burundi': 'bi', 'Mauritania': 'mr',
    'Marshall Islands': 'mh', 'Comoros': 'km', 'Solomon Islands': 'sb', 'Guinea-Bissau': 'gw',
    'Sri Lanka': 'lk', 'Nepal': 'np', 'Maldives': 'mv', 'Mauritius': 'mu', 'Jamaica': 'jm', 'Barbados': 'bb',
    'Fiji': 'fj', 'Micronesia': 'fm', 'El Salvador': 'sv', 'Trinidad & Tobago': 'tt', 'Senegal': 'sn',
    'Saint Kitts & Nevis': 'kn', 'Haiti': 'ht', 'Gambia': 'gm'
};

function renderVisaGrid(query = '') {
    const grid = document.getElementById('visaCountryGrid');
    grid.innerHTML = '';
    const list = VISA_DATA[activeVisaType];
    const filtered = query
        ? list.filter(c => c.toLowerCase().includes(query.toLowerCase()))
        : list;
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="vf-no-result">No countries found matching your search.</div>';
        return;
    }
    filtered.forEach((country, i) => {
        const chip = document.createElement('span');
        chip.className = 'vf-chip';
        chip.style.animationDelay = `${i * 0.03}s`;
        const iso = COUNTRY_ISO[country];
        const flagImg = iso
            ? `<img src="https://flagcdn.com/w40/${iso}.png" srcset="https://flagcdn.com/w80/${iso}.png 2x" width="20" alt="${country}" style="border-radius:2px;">`
            : `<i class="fa-solid fa-globe" style="font-size:0.75rem;color:var(--accent);"></i>`;
        chip.innerHTML = `${flagImg} ${country}`;
        grid.appendChild(chip);
    });
}

window.switchVisaTab = function (type, btn) {
    activeVisaType = type;
    document.querySelectorAll('.vf-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('visaCountrySearch').value = '';
    renderVisaGrid();
};

window.filterVisaCountries = function () {
    const q = document.getElementById('visaCountrySearch').value.trim().toLowerCase();

    let foundType = activeVisaType;

    if (q) {
        let currentTabMatches = VISA_DATA[activeVisaType].filter(c => c.toLowerCase().includes(q));

        if (currentTabMatches.length === 0) {
            for (const [type, countries] of Object.entries(VISA_DATA)) {
                if (countries.some(c => c.toLowerCase().includes(q))) {
                    foundType = type;
                    break;
                }
            }
        }

        if (foundType !== activeVisaType) {
            activeVisaType = foundType;
            document.querySelectorAll('.vf-tab').forEach(t => t.classList.remove('active'));
            const btn = document.querySelector(`.vf-tab[data-type="${foundType}"]`);
            if (btn) btn.classList.add('active');
        }
    }

    renderVisaGrid(q);
};

// ─── CAROUSEL SHARED LOGIC ────────────────────────────────────────────────────
function setupCarousel(gridId, progressId, slideDelay = 4000) {
    const grid = document.getElementById(gridId);
    const progress = document.getElementById(progressId);
    if (!grid) return null;

    let isPaused = false;
    let autoSlideInterval;

    function updateProgress() {
        if (!progress) return;
        const maxScroll = grid.scrollWidth - grid.clientWidth;
        const percentage = maxScroll > 0 ? (grid.scrollLeft / maxScroll) * 100 : 0;
        progress.style.width = `${percentage}%`;
    }

    function slideNext() {
        if (isPaused) return;
        const maxScroll = grid.scrollWidth - grid.clientWidth;
        if (grid.scrollLeft >= maxScroll - 10) {
            grid.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            const cardWidth = grid.querySelector('.insight-card, .dest-card')?.offsetWidth || grid.clientWidth;
            grid.scrollBy({ left: cardWidth + 30, behavior: 'smooth' });
        }
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(slideNext, slideDelay);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
    }

    grid.addEventListener('scroll', updateProgress);
    grid.addEventListener('mouseenter', () => isPaused = true);
    grid.addEventListener('mouseleave', () => isPaused = false);
    
    // Initial start
    startAutoSlide();

    return {
        scroll: (direction) => {
            const cardWidth = grid.querySelector('.insight-card, .dest-card')?.offsetWidth || grid.clientWidth;
            grid.scrollBy({ left: direction * (cardWidth + 30), behavior: 'smooth' });
            // Pause auto-slide for a while after manual interaction
            isPaused = true;
            setTimeout(() => isPaused = false, 8000);
        }
    };
}

// Wait for DOM to be fully ready
window.addEventListener('load', () => {
    const insightsCarousel = setupCarousel('insightsGrid', 'insightsProgress', 4000);
    if (insightsCarousel) window.scrollInsights = (dir) => insightsCarousel.scroll(dir);
});

// ─── TAB NAVIGATION HANDLER ──────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        // Small delay to let focus land
        setTimeout(() => {
            const activeEl = document.activeElement;
            if (!activeEl) return;
            
            // Find the closest section container
            const section = activeEl.closest('header, section, footer');
            if (section) {
                // Force scroll to section start to ensure snap
                const sectionTop = section.offsetTop;
                window.scrollTo({
                    top: sectionTop,
                    behavior: 'smooth'
                });
            }
        }, 50);
    }
});

// Init
renderVisaGrid();
