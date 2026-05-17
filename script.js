// Firebase — loaded via CDN script tags in HTML (optional)
// If not configured, form data is logged to the console.

let db = null;
try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(window._firebaseConfig || {});
        db = firebase.firestore();
        if (typeof firebase.analytics === 'function') {
            firebase.analytics();
        }
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
    "Guatemala", "Guinea", "Guinea-Bissau", "Guinea Bissau", "Guyana", "Haiti", "Honduras",
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
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe", "Cote D Ivoire", "Other"
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
        'Sao Tome & Principe', 'Mozambique', 'Zimbabwe', 'Bangladesh', 'Bahrain',
        'Montenegro', 'Saudi Arabia', 'Liberia', 'Chad'
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
    'Sao Tome & Principe': 'st', 'Mozambique': 'mz', 'Zimbabwe': 'zw', 'Bangladesh': 'bd',
    'Bahrain': 'bh', 'Montenegro': 'me', 'Saudi Arabia': 'sa', 'Liberia': 'lr', 'Chad': 'td',
    'United States of America (USA)': 'us', 'Canada': 'ca', 'Austria': 'at', 'South Korea': 'kr', 'China': 'cn',
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
    if (!grid) return;
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
        chip.addEventListener('click', () => selectCountry(country));
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

// ─── SECTION NAVIGATION ────────────────────────────────────────────────────────
window.scrollToNextSection = function (btn) {
    const currentSection = btn.closest('header, section');
    let nextSection = currentSection.nextElementSibling;

    // Find the next actual section (skip scripts/comments)
    while (nextSection && !['SECTION', 'HEADER', 'FOOTER'].includes(nextSection.tagName)) {
        nextSection = nextSection.nextElementSibling;
    }

    if (nextSection) {
        // Rely on CSS scroll-behavior: smooth to avoid conflict with scroll-snap
        window.scrollTo({
            top: nextSection.offsetTop
        });
    }
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        setTimeout(() => {
            const activeEl = document.activeElement;
            if (!activeEl) return;
            const section = activeEl.closest('header, section, footer');
            if (section) {
                window.scrollTo({
                    top: section.offsetTop
                });
            }
        }, 10);
    }
});

// Init
renderVisaGrid();

// ─── CONTACT FORM SUBMISSION (FIREBASE) ─────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Collect Data
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            visaType: document.getElementById('visaType').value,
            destination: document.getElementById('destination').value,
            message: document.getElementById('message').value.trim(),
            submittedAt: new Date().toISOString()
        };

        // 2. Visual Feedback
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
        formStatus.className = 'form-status';
        formStatus.textContent = '';

        try {
            if (db) {
                // 3. Save to Firebase Firestore
                await db.collection('inquiries').add(formData);

                formStatus.textContent = "Thank you! Your application has been submitted successfully. We'll contact you soon.";
                formStatus.classList.add('success');
                contactForm.reset();
            } else {
                // Fallback if Firebase isn't configured
                console.log('Firebase not configured. Data:', formData);
                formStatus.textContent = "Firebase is not yet configured with your API keys. Please check the documentation.";
                formStatus.classList.add('error');
            }
        } catch (error) {
            console.error('Submission Error:', error);
            formStatus.textContent = "Oops! Something went wrong. Please try again later or contact us directly.";
            formStatus.classList.add('error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Application';

            // Auto-hide status after 8 seconds
            setTimeout(() => {
                formStatus.style.opacity = '0';
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.style.opacity = '1';
                }, 500);
            }, 8000);
        }
    });
}

// ─── TRAVEL MAP & PLANNER LOGIC ───────────────────────────────────────────────
const ORIGINS_GEOGRAPHY = {
    AP: { name: "Andhra Pradesh", coords: [16.5062, 80.6480], code: "VGA" },
    AR: { name: "Arunachal Pradesh", coords: [27.0844, 93.6053], code: "HGI" },
    AS: { name: "Assam", coords: [26.1445, 91.7362], code: "GAU" },
    BR: { name: "Bihar", coords: [25.5941, 85.1376], code: "PAT" },
    CG: { name: "Chhattisgarh", coords: [21.2514, 81.6296], code: "RPR" },
    GA: { name: "Goa", coords: [15.4909, 73.8278], code: "GOI" },
    GJ: { name: "Gujarat", coords: [23.0225, 72.5714], code: "AMD" },
    HR: { name: "Haryana", coords: [30.7333, 76.7794], code: "IXC" },
    HP: { name: "Himachal Pradesh", coords: [31.1048, 77.1734], code: "SLV" },
    JH: { name: "Jharkhand", coords: [23.3441, 85.3096], code: "IXR" },
    KA: { name: "Karnataka", coords: [12.9716, 77.5946], code: "BLR" },
    KL: { name: "Kerala", coords: [8.5241, 76.9366], code: "TRV" },
    MP: { name: "Madhya Pradesh", coords: [23.2599, 77.4126], code: "BHO" },
    MH: { name: "Maharashtra", coords: [19.0760, 72.8777], code: "BOM" },
    MN: { name: "Manipur", coords: [24.8170, 93.9368], code: "IMF" },
    ML: { name: "Meghalaya", coords: [25.5788, 91.8831], code: "SHL" },
    MZ: { name: "Mizoram", coords: [23.7307, 92.7179], code: "AJL" },
    NL: { name: "Nagaland", coords: [25.6751, 94.1086], code: "DMU" },
    OD: { name: "Odisha", coords: [20.2961, 85.8245], code: "BBI" },
    PB: { name: "Punjab", coords: [31.6340, 74.8723], code: "ATQ" },
    RJ: { name: "Rajasthan", coords: [26.9124, 75.7873], code: "JAI" },
    SK: { name: "Sikkim", coords: [27.3314, 88.6138], code: "PYG" },
    TN: { name: "Tamil Nadu", coords: [13.0827, 80.2707], code: "MAA" },
    TG: { name: "Telangana", coords: [17.3850, 78.4867], code: "HYD" },
    TR: { name: "Tripura", coords: [23.8315, 91.2868], code: "IXA" },
    UP: { name: "Uttar Pradesh", coords: [26.8467, 80.9462], code: "LKO" },
    UK: { name: "Uttarakhand", coords: [30.3165, 78.0322], code: "DED" },
    WB: { name: "West Bengal", coords: [22.5726, 88.3639], code: "CCU" },
    AN: { name: "Andaman & Nicobar Islands", coords: [11.6234, 92.7265], code: "IXZ" },
    CH: { name: "Chandigarh", coords: [30.7333, 76.7794], code: "IXC" },
    DN: { name: "Dadra & Nagar Haveli and Daman & Diu", coords: [20.4140, 72.8322], code: "NMB" },
    DL: { name: "Delhi", coords: [28.6139, 77.2090], code: "DEL" },
    JK: { name: "Jammu & Kashmir", coords: [34.0837, 74.7973], code: "SXR" },
    LA: { name: "Ladakh", coords: [34.1526, 77.5771], code: "IXL" },
    LD: { name: "Lakshadweep", coords: [10.8524, 72.1837], code: "AGT" },
    PY: { name: "Puducherry", coords: [11.9416, 79.8083], code: "PNY" }
};

const MAP_DESTINATIONS = {
    "Dubai (UAE)": { coords: [25.2048, 55.2708], code: "DXB", flightTime: "3h 30m", processDays: 2, type: "E-Visa", iso: "ae" },
    "Vietnam": { coords: [14.0583, 108.2772], code: "SGN", flightTime: "4h 30m", processDays: 3, type: "E-Visa", iso: "vn" },
    "Indonesia": { coords: [-0.7893, 113.9213], code: "DPS", flightTime: "5h 45m", processDays: 2, type: "E-Visa", iso: "id" },
    "Thailand": { coords: [15.8700, 100.9925], code: "BKK", flightTime: "4h 0m", processDays: 3, type: "E-Visa", iso: "th" },
    "Egypt": { coords: [26.8206, 30.8025], code: "CAI", flightTime: "6h 15m", processDays: 5, type: "E-Visa", iso: "eg" },
    "Malaysia": { coords: [4.2105, 101.9758], code: "KUL", flightTime: "4h 15m", processDays: 2, type: "E-Visa", iso: "my" },
    "United States of America (USA)": { coords: [37.0902, -95.7129], code: "JFK", flightTime: "16h 0m", processDays: 20, type: "Sticker Visa", iso: "us" },
    "Canada": { coords: [56.1304, -106.3468], code: "YYZ", flightTime: "15h 30m", processDays: 30, type: "Sticker Visa", iso: "ca" },
    "United Kingdom (UK)": { coords: [55.3781, -3.4360], code: "LHR", flightTime: "9h 0m", processDays: 15, type: "Sticker Visa", iso: "gb" },
    "Australia": { coords: [-25.2744, 133.7751], code: "SYD", flightTime: "12h 0m", processDays: 10, type: "E-Visa", iso: "au" },
    "Japan": { coords: [36.2048, 138.2529], code: "NRT", flightTime: "8h 0m", processDays: 7, type: "E-Visa / Sticker", iso: "jp" },
    "South Korea": { coords: [35.9078, 127.7669], code: "ICN", flightTime: "7h 30m", processDays: 5, type: "Sticker Visa", iso: "kr" }
};

// Comprehensive Geo-Coordinate Dictionary for ALL countries in ALL_COUNTRIES
const COUNTRY_COORDINATES = {
    "Dubai (UAE)": [25.2048, 55.2708],
    "United States of America (USA)": [37.0902, -95.7129],
    "United Kingdom (UK)": [55.3781, -3.4360],
    "Canada": [56.1304, -106.3468],
    "Australia": [-25.2744, 133.7751],
    "Afghanistan": [33.9391, 67.7100],
    "Albania": [41.1533, 20.1683],
    "Algeria": [28.0339, 1.6596],
    "Andorra": [42.5063, 1.5218],
    "Angola": [-11.2027, 17.8739],
    "Antigua and Barbuda": [17.0608, -61.7964],
    "Antigua & Barbuda": [17.0608, -61.7964],
    "Argentina": [-38.4161, -63.6167],
    "Armenia": [40.0691, 45.0382],
    "Austria": [47.5162, 14.5501],
    "Azerbaijan": [40.1431, 47.5769],
    "Bahamas": [25.0343, -77.3963],
    "Bahrain": [25.9304, 50.6377],
    "Bangladesh": [23.6850, 90.3563],
    "Barbados": [13.1939, -59.5432],
    "Belarus": [53.7098, 27.9534],
    "Belgium": [50.5039, 4.4699],
    "Belize": [17.1899, -88.4976],
    "Benin": [9.3077, 2.3158],
    "Bhutan": [27.5142, 90.4336],
    "Bolivia": [-16.2902, -63.5887],
    "Bosnia and Herzegovina": [43.9159, 17.6791],
    "Botswana": [-22.3285, 24.6849],
    "Brazil": [-14.2350, -51.9253],
    "Brunei": [4.5353, 114.7277],
    "Bulgaria": [42.7339, 25.4858],
    "Burkina Faso": [12.2383, -1.5616],
    "Burundi": [-3.3731, 29.9189],
    "Cabo Verde": [16.5388, -23.0418],
    "Cape Verde": [16.5388, -23.0418],
    "Cambodia": [12.5657, 104.9910],
    "Cameroon": [7.3697, 12.3547],
    "Central African Republic": [6.6111, 20.9394],
    "Chad": [15.4542, 18.7322],
    "Chile": [-35.6751, -71.5430],
    "China": [35.8617, 104.1954],
    "Colombia": [4.5709, -74.2973],
    "Comoros": [-11.8750, 43.8722],
    "Congo (Brazzaville)": [-0.2280, 15.8277],
    "Congo (Kinshasa)": [-4.0383, 21.7587],
    "Costa Rica": [9.7489, -83.7534],
    "Croatia": [45.1000, 15.2000],
    "Cuba": [21.5218, -77.7812],
    "Cyprus": [35.1264, 33.4299],
    "Czech Republic": [49.8175, 15.4730],
    "Denmark": [56.2639, 9.5018],
    "Djibouti": [11.8251, 42.5903],
    "Dominica": [15.4150, -61.3710],
    "Dominican Republic": [18.7357, -70.1627],
    "Ecuador": [-1.8312, -78.1834],
    "Egypt": [26.8206, 30.8025],
    "El Salvador": [13.7942, -88.8965],
    "Equatorial Guinea": [1.6508, 10.2679],
    "Eritrea": [15.1794, 39.7823],
    "Estonia": [58.5953, 25.0136],
    "Eswatini": [-26.5225, 31.4659],
    "Ethiopia": [9.1450, 40.4897],
    "Fiji": [-16.5782, 179.4144],
    "Finland": [61.9241, 25.7482],
    "France": [46.2276, 2.2137],
    "Gabon": [-0.8037, 11.6094],
    "Gambia": [13.4432, -15.3101],
    "Georgia": [42.3154, 43.3569],
    "Germany": [51.1657, 10.4515],
    "Ghana": [7.9465, -1.0232],
    "Greece": [39.0742, 21.8243],
    "Grenada": [12.1165, -61.6790],
    "Guatemala": [15.7835, -90.2308],
    "Guinea": [9.9456, -9.6966],
    "Guinea-Bissau": [11.8037, -15.1804],
    "Guinea Bissau": [11.8037, -15.1804],
    "Guyana": [4.8604, -58.9302],
    "Haiti": [18.9712, -72.2852],
    "Honduras": [15.2000, -86.2419],
    "Hungary": [47.1625, 19.5033],
    "Iceland": [64.9631, -19.0208],
    "India": [20.5937, 78.9629],
    "Indonesia": [-0.7893, 113.9213],
    "Iran": [32.4279, 53.6880],
    "Iraq": [33.2232, 43.6793],
    "Ireland": [53.4129, -8.2439],
    "Israel": [31.0461, 34.8516],
    "Italy": [41.8719, 12.5674],
    "Jamaica": [18.1096, -77.2975],
    "Japan": [36.2048, 138.2529],
    "Jordan": [30.5852, 36.2384],
    "Kazakhstan": [48.0196, 66.9237],
    "Kenya": [-0.0236, 37.9062],
    "Kiribati": [-3.3704, -168.7340],
    "Kuwait": [29.3759, 47.9774],
    "Kyrgyzstan": [41.2044, 74.7661],
    "Laos": [19.8563, 102.4955],
    "Latvia": [56.8796, 24.6032],
    "Lebanon": [33.8547, 35.8623],
    "Lesotho": [-29.6100, 28.2336],
    "Liberia": [6.4281, -9.4295],
    "Libya": [26.3351, 17.2283],
    "Liechtenstein": [47.1660, 9.5554],
    "Lithuania": [55.1694, 23.8813],
    "Luxembourg": [49.8153, 6.1296],
    "Madagascar": [-18.7669, 46.8691],
    "Malawi": [-13.2543, 34.3015],
    "Malaysia": [4.2105, 101.9758],
    "Maldives": [3.2028, 73.2207],
    "Mali": [17.5707, -3.9962],
    "Malta": [35.9375, 14.3754],
    "Marshall Islands": [7.1315, 171.1844],
    "Mauritania": [21.0079, -10.9408],
    "Mauritius": [-20.3484, 57.5522],
    "Mexico": [23.6345, -102.5528],
    "Micronesia": [7.4256, 150.5508],
    "Moldova": [47.4116, 28.3699],
    "Monaco": [43.7384, 7.4246],
    "Mongolia": [46.8625, 103.8467],
    "Montenegro": [42.7087, 19.3744],
    "Morocco": [31.7917, -7.0926],
    "Mozambique": [-18.6657, 35.5296],
    "Myanmar": [21.9162, 95.9560],
    "Namibia": [-22.9576, 18.4904],
    "Nauru": [-0.5228, 166.9315],
    "Nepal": [28.3949, 84.1240],
    "Netherlands": [52.1326, 5.2913],
    "New Zealand": [-40.9006, 174.8860],
    "Nicaragua": [12.8654, -85.2072],
    "Niger": [17.6078, 8.0817],
    "Nigeria": [9.0820, 8.6753],
    "North Korea": [40.3399, 127.5101],
    "North Macedonia": [41.6086, 21.7453],
    "Norway": [60.4720, 8.4689],
    "Oman": [21.5126, 55.9233],
    "Pakistan": [30.3753, 69.3451],
    "Palau": [7.5150, 134.5825],
    "Palestine": [31.9522, 35.2332],
    "Panama": [8.5380, -80.7821],
    "Papua New Guinea": [-6.3150, 143.9555],
    "Paraguay": [-23.4425, -58.4438],
    "Peru": [-9.1900, -75.0152],
    "Philippines": [12.8797, 121.7740],
    "Poland": [51.9194, 19.1451],
    "Portugal": [39.3999, -8.2245],
    "Qatar": [25.3548, 51.1839],
    "Romania": [45.9432, 24.9668],
    "Russia": [61.5240, 105.3188],
    "Rwanda": [-1.9403, 29.8739],
    "Saint Kitts and Nevis": [17.3578, -62.7830],
    "Saint Lucia": [13.9094, -60.9789],
    "Saint Vincent and the Grenadines": [12.9843, -61.2872],
    "Samoa": [-13.7590, -172.1046],
    "San Marino": [43.9424, 12.4578],
    "Sao Tome and Principe": [0.1864, 6.6131],
    "Sao Tome & Principe": [0.1864, 6.6131],
    "Saudi Arabia": [23.8859, 45.0792],
    "Senegal": [14.4974, -14.4524],
    "Serbia": [44.0165, 21.0059],
    "Seychelles": [-4.6796, 55.4920],
    "Sierra Leone": [8.4606, -11.7799],
    "Singapore": [1.3521, 103.8198],
    "Slovakia": [48.6690, 19.6990],
    "Slovenia": [46.1512, 14.9955],
    "Solomon Islands": [-9.6457, 160.1562],
    "Somalia": [5.1521, 46.1996],
    "South Africa": [-30.5595, 22.9375],
    "South Korea": [35.9078, 127.7669],
    "South Sudan": [6.8770, 31.3070],
    "Spain": [40.4637, -3.7492],
    "Sri Lanka": [7.8731, 80.7718],
    "Sudan": [12.8628, 30.2176],
    "Suriname": [3.9193, -56.0278],
    "Sweden": [60.1282, 18.6435],
    "Switzerland": [46.8182, 8.2275],
    "Syria": [34.8021, 38.9968],
    "Taiwan": [23.6978, 120.9605],
    "Tajikistan": [38.8610, 71.2761],
    "Tanzania": [-6.3690, 34.8888],
    "Thailand": [15.8700, 100.9925],
    "Timor-Leste": [-8.8742, 125.7275],
    "Togo": [8.6195, 0.8248],
    "Tonga": [-21.1789, -175.1982],
    "Trinidad and Tobago": [10.6918, -61.2225],
    "Trinidad & Tobago": [10.6918, -61.2225],
    "Tunisia": [33.8869, 9.5375],
    "Turkey": [38.9637, 35.2433],
    "Turkmenistan": [38.9697, 59.5563],
    "Tuvalu": [-7.1095, 177.6493],
    "Uganda": [1.3733, 32.2903],
    "Ukraine": [48.3794, 31.1656],
    "Uruguay": [-32.5228, -55.7658],
    "Uzbekistan": [41.3775, 64.5853],
    "Vanuatu": [-15.3767, 166.9592],
    "Vatican City": [41.9029, 12.4534],
    "Venezuela": [6.4238, -66.5897],
    "Vietnam": [14.0583, 108.2772],
    "Yemen": [15.5527, 48.5164],
    "Zambia": [-13.1339, 27.8493],
    "Zimbabwe": [-19.0154, 29.1549],
    "Cote D Ivoire": [7.5400, -5.5471],
    "Cote D'Ivoire": [7.5400, -5.5471],
    "Antigua & Barbuda": [17.0608, -61.7964],
    "Guinea-Bissau": [11.8037, -15.1804]
};

let activeLeafletMap = null;
let activeFlightPolyline = null;
let activeFlightPolylineGlow = null;
let activeOriginMarker = null;
let activePlaneMarker = null;
let activeDestinationMarker = null;
let flightAnimationInterval = null;
let destinationMapMarkers = {};

function getBezierPoints(p1, p2, mid, steps = 80) {
    const points = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lat = (1 - t) * (1 - t) * p1[0] + 2 * (1 - t) * t * mid[0] + t * t * p2[0];
        const lng = (1 - t) * (1 - t) * p1[1] + 2 * (1 - t) * t * mid[1] + t * t * p2[1];
        points.push([lat, lng]);
    }
    return points;
}

// Great-Circle Distance math formula in kilometers
function getDistance(p1, p2) {
    const R = 6371; // Earth radius in km
    const dLat = (p2[0] - p1[0]) * Math.PI / 180;
    const dLng = (p2[1] - p1[1]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(p1[0] * Math.PI / 180) * Math.cos(p2[0] * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Realistically estimate flight duration from distance
function getFlightTimeForCountry(p1, p2) {
    const dist = getDistance(p1, p2);
    // 780 km/h cruising + 45m climb/descent
    const totalHours = dist / 780 + 0.75;
    const hrs = Math.floor(totalHours);
    const mins = Math.round((totalHours % 1) * 60);
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
}

function getVisaTypeForCountry(countryName) {
    if (VISA_DATA.evisa.includes(countryName)) return "E-Visa";
    if (VISA_DATA.sticker.includes(countryName)) return "Sticker Visa";
    if (VISA_DATA.arrival.includes(countryName)) return "Visa on Arrival";
    if (VISA_DATA.free.includes(countryName)) return "Visa Free";
    return "E-Visa"; // fallback
}

function getProcessDaysForCountry(countryName) {
    const type = getVisaTypeForCountry(countryName);
    if (type === "Visa Free") return 0;
    if (type === "Visa on Arrival") return 1;
    if (type === "E-Visa") return 3;
    if (type === "Sticker Visa") return 15;
    return 3;
}

function getAirportCodeForCountry(countryName) {
    const codes = {
        "Dubai (UAE)": "DXB",
        "United States of America (USA)": "JFK",
        "United Kingdom (UK)": "LHR",
        "Canada": "YYZ",
        "Australia": "SYD",
        "Japan": "NRT",
        "South Korea": "ICN",
        "Singapore": "SIN",
        "Malaysia": "KUL",
        "Thailand": "BKK",
        "Vietnam": "SGN",
        "Indonesia": "DPS",
        "Egypt": "CAI",
        "France": "CDG",
        "Germany": "FRA",
        "Italy": "FCO",
        "Spain": "MAD",
        "Switzerland": "ZRH",
        "Netherlands": "AMS",
        "Austria": "VIE",
        "China": "PEK",
        "Sri Lanka": "CMB",
        "Nepal": "KTM",
        "Maldives": "MLE"
    };
    if (codes[countryName]) return codes[countryName];
    
    // Take first 3 letters uppercase of standard clean name
    const cleanName = countryName.replace(/\(.*?\)/g, "").replace(/[^a-zA-Z]/g, "").trim();
    return cleanName.slice(0, 3).toUpperCase() || "DST";
}

function initTravelPlannerMap() {
    const mapEl = document.getElementById('travelMap');
    if (!mapEl || typeof L === 'undefined') return;

    // 1. Initialize Map Object (disabled scroll zoom to prevent scrolling issues)
    activeLeafletMap = L.map('travelMap', {
        center: [20, 80],
        zoom: 3,
        scrollWheelZoom: false,
        zoomControl: true
    });

    // 2. Load CartoDB Voyager ultra-premium colorful map layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(activeLeafletMap);

    // 3. Populate dropdown options for Destination Country Select with ALL sorted countries
    const destSelect = document.getElementById('destinationSelect');
    if (destSelect) {
        destSelect.innerHTML = '';
        // Filter out "Other" and "India" then sort alphabetically
        const sortedCountries = [...ALL_COUNTRIES]
            .filter(c => c !== "Other" && c !== "India")
            .sort();

        sortedCountries.forEach(country => {
            const opt = document.createElement('option');
            opt.value = country;
            opt.textContent = country;
            if (country === "Dubai (UAE)") {
                opt.selected = true;
            }
            destSelect.appendChild(opt);
        });
    }

    // 4. Add featured destination markers on load for high clickable interaction
    Object.keys(MAP_DESTINATIONS).forEach(country => {
        const data = MAP_DESTINATIONS[country];
        const flagUrl = `https://flagcdn.com/w40/${data.iso}.png`;

        // Compute dynamically formatted date
        const offsetDate = new Date();
        offsetDate.setDate(offsetDate.getDate() + data.processDays);
        const day = offsetDate.getDate();
        const monthShort = offsetDate.toLocaleString('default', { month: 'short' }).toUpperCase();
        const yearShort = offsetDate.getFullYear().toString().slice(-2);
        const labelDateStr = `${day} ${monthShort} ${yearShort}`;

        const pinHtml = `
            <div class="map-country-pin dest-marker-bounce" style="display: flex; align-items: center; gap: 6px; background: #ffffff; padding: 4px 10px; border-radius: 20px; box-shadow: 0 6px 16px rgba(15,23,42,0.15); border: 1px solid #e2e8f0; pointer-events: auto; white-space: nowrap; cursor: pointer;">
                <img src="${flagUrl}" width="16" alt="${country}" style="border-radius:2px; display:block;">
                <div style="display: flex; flex-direction: column; line-height: 1.1; text-align: left;">
                    <span style="font-size: 0.72rem; font-weight: 800; color: #0f172a;">${country}</span>
                    <span style="font-size: 0.65rem; font-weight: 700; color: var(--accent2);">${labelDateStr}</span>
                </div>
            </div>
        `;

        const destIcon = L.divIcon({
            html: pinHtml,
            className: 'dest-marker-custom',
            iconSize: [110, 30],
            iconAnchor: [55, 15]
        });

        const marker = L.marker(data.coords, { icon: destIcon })
            .addTo(activeLeafletMap)
            .on('click', () => {
                if (destSelect) {
                    destSelect.value = country;
                    calculateRoute();
                }
            });
        
        destinationMapMarkers[country] = marker;
    });

    // Run initial calculation to show Dubai (UAE) immediately
    calculateRoute();
}

function getFormattedDateOffset(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

window.calculateRoute = function() {
    const originSelect = document.getElementById('originSelect');
    const destSelect = document.getElementById('destinationSelect');
    
    if (!originSelect || !destSelect) return;
    
    const originCode = originSelect.value;
    const country = destSelect.value;
    
    const origin = ORIGINS_GEOGRAPHY[originCode];
    if (!origin) return;

    // Resolve details dynamically for ANY selected country in ALL_COUNTRIES!
    let destination = MAP_DESTINATIONS[country];
    if (!destination) {
        // Dynamically build country details on the fly
        const coords = COUNTRY_COORDINATES[country] || [20.0, 77.0]; // fallback
        const iso = COUNTRY_ISO[country] || 'un';
        const type = getVisaTypeForCountry(country);
        const processDays = getProcessDaysForCountry(country);
        const code = getAirportCodeForCountry(country);
        const flightTime = getFlightTimeForCountry(origin.coords, coords);
        
        destination = { coords, code, flightTime, processDays, type, iso };
    } else {
        // Recalculate flight time dynamically based on the current active origin state!
        destination.flightTime = getFlightTimeForCountry(origin.coords, destination.coords);
    }

    // 1. Update live display panel results
    document.getElementById('originNodeCode').textContent = origin.code;
    document.getElementById('destNodeCode').textContent = destination.code;
    document.getElementById('calcFlightTime').textContent = destination.flightTime;
    document.getElementById('calcVisaProcess').textContent = destination.processDays === 0 ? "Instant" : `${destination.processDays} Days`;
    document.getElementById('calcVisaType').textContent = destination.type;
    document.getElementById('calcEstimatedLanding').textContent = getFormattedDateOffset(destination.processDays);

    // Dynamic Flash recalculation animations on metrics cards
    const cards = document.querySelectorAll('.metric-card');
    cards.forEach(card => {
        card.classList.add('highlight-recalc');
        setTimeout(() => {
            card.classList.remove('highlight-recalc');
        }, 800);
    });

    // Pulsing animation for connecting nodes
    const nodeOrig = document.getElementById('originNodeCode');
    const nodeDest = document.getElementById('destNodeCode');
    if (nodeOrig && nodeDest) {
        nodeOrig.classList.add('node-pulse');
        nodeDest.classList.add('node-pulse');
        setTimeout(() => {
            nodeOrig.classList.remove('node-pulse');
            nodeDest.classList.remove('node-pulse');
        }, 1000);
    }

    // Restart flight icon sweep animation
    const icon = document.getElementById('airplaneFlightIcon');
    if (icon) {
        icon.style.animation = 'none';
        void icon.offsetHeight; // trigger reflow
        icon.style.animation = 'flightSweep 3s infinite linear';
    }

    if (activeLeafletMap) {
        // Clear previous animation loop
        if (flightAnimationInterval) {
            clearInterval(flightAnimationInterval);
        }

        // Remove previous route paths
        if (activeFlightPolyline) {
            activeLeafletMap.removeLayer(activeFlightPolyline);
        }
        if (activeFlightPolylineGlow) {
            activeLeafletMap.removeLayer(activeFlightPolylineGlow);
        }

        // Remove previous active state origin marker
        if (activeOriginMarker) {
            activeLeafletMap.removeLayer(activeOriginMarker);
        }

        // Remove previous active destination marker
        if (activeDestinationMarker) {
            activeLeafletMap.removeLayer(activeDestinationMarker);
        }

        // Remove previous plane marker
        if (activePlaneMarker) {
            activeLeafletMap.removeLayer(activePlaneMarker);
        }

        // Create glowing Indian State active marker pin!
        const flagUrl = "https://flagcdn.com/w40/in.png";
        const originHtml = `
            <div class="origin-pulsing-node" style="position: relative; display: flex; align-items: center; justify-content: center;">
                <div class="origin-pulse-ring"></div>
                <div style="background: var(--accent); border: 2px solid #ffffff; border-radius: 50%; padding: 4px; display:flex; align-items:center; justify-content:center; box-shadow: 0 4px 15px rgba(37,99,235,0.4); width:32px; height:32px; animation: bounce 2s infinite;">
                    <img src="${flagUrl}" width="16" style="border-radius:1px; display:block;">
                </div>
            </div>
        `;
        const originIcon = L.divIcon({
            html: originHtml,
            className: 'origin-custom-pulsing',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        activeOriginMarker = L.marker(origin.coords, { icon: originIcon })
            .addTo(activeLeafletMap)
            .bindTooltip(`<b>Origin: ${origin.name}</b>`, { permanent: false, direction: 'top' });

        // Draw active destination marker dynamically
        const destFlagUrl = `https://flagcdn.com/w40/${destination.iso}.png`;
        const offsetDate = new Date();
        offsetDate.setDate(offsetDate.getDate() + destination.processDays);
        const day = offsetDate.getDate();
        const monthShort = offsetDate.toLocaleString('default', { month: 'short' }).toUpperCase();
        const yearShort = offsetDate.getFullYear().toString().slice(-2);
        const labelDateStr = `${day} ${monthShort} ${yearShort}`;

        const destPinHtml = `
            <div class="map-country-pin dest-marker-bounce" style="display: flex; align-items: center; gap: 6px; background: #ffffff; padding: 4px 10px; border-radius: 20px; box-shadow: 0 6px 16px rgba(15,23,42,0.15); border: 1px solid #e2e8f0; pointer-events: auto; white-space: nowrap; cursor: pointer;">
                <img src="${destFlagUrl}" width="16" alt="${country}" style="border-radius:2px; display:block;">
                <div style="display: flex; flex-direction: column; line-height: 1.1; text-align: left;">
                    <span style="font-size: 0.72rem; font-weight: 800; color: #0f172a;">${country}</span>
                    <span style="font-size: 0.65rem; font-weight: 700; color: var(--accent2);">${labelDateStr}</span>
                </div>
            </div>
        `;

        const destIcon = L.divIcon({
            html: destPinHtml,
            className: 'dest-marker-custom active-destination-pin',
            iconSize: [110, 30],
            iconAnchor: [55, 15]
        });

        activeDestinationMarker = L.marker(destination.coords, { icon: destIcon })
            .addTo(activeLeafletMap);

        // Draw animated curved route from Origin coordinates to Destination coordinates
        const p1 = origin.coords;
        const p2 = destination.coords;

        // Draw a neat geodesic line (curve) by computing a midpoint with an offset
        const midLat = (p1[0] + p2[0]) / 2 + (p2[1] - p1[1]) * 0.15; // arc offset
        const midLng = (p1[1] + p2[1]) / 2;

        // Draw a smooth bezier curve with 80 points
        const bezierPoints = getBezierPoints(p1, p2, [midLat, midLng], 80);

        // Draw neon glow backdrop polyline
        activeFlightPolylineGlow = L.polyline(bezierPoints, {
            color: 'var(--accent)',
            weight: 8,
            lineCap: 'round',
            opacity: 0.15
        }).addTo(activeLeafletMap);

        // Draw elegant geodesic arc line on map
        activeFlightPolyline = L.polyline(bezierPoints, {
            color: 'var(--accent)',
            weight: 3,
            dashArray: '6, 8',
            lineCap: 'round',
            opacity: 0.95
        }).addTo(activeLeafletMap);

        // Create customized flying airplane marker
        const planeHtml = `
            <div class="map-flight-plane" style="transform-origin: center center; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px;">
                <i class="fa-solid fa-plane" style="color: var(--accent2); font-size: 1.3rem; text-shadow: 0 4px 10px rgba(14,165,233,0.7); filter: drop-shadow(0 2px 5px rgba(0,0,0,0.3)); display: block;"></i>
            </div>
        `;
        const planeIcon = L.divIcon({
            html: planeHtml,
            className: 'leaflet-plane-icon',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        activePlaneMarker = L.marker(bezierPoints[0], { icon: planeIcon }).addTo(activeLeafletMap);

        // Live Airplane flight path animation loop
        let stepIndex = 0;
        flightAnimationInterval = setInterval(() => {
            if (stepIndex >= bezierPoints.length - 1) {
                stepIndex = 0; // reset flight path back to takeoff
            }

            const curr = bezierPoints[stepIndex];
            const next = bezierPoints[stepIndex + 1];

            // Update marker position
            activePlaneMarker.setLatLng(curr);

            // Compute geographic heading angle
            const dy = next[0] - curr[0];
            const dx = next[1] - curr[1];
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;

            // Align FontAwesome's top-right pointing plane (rotate offset by -45 degrees)
            const rotation = -angle - 45;

            // Apply rotation style directly
            const el = activePlaneMarker.getElement();
            if (el) {
                const innerPlane = el.querySelector('.map-flight-plane');
                if (innerPlane) {
                    innerPlane.style.transform = `rotate(${rotation}deg)`;
                }
            }

            stepIndex++;
        }, 40); // smooth, real-time sweeping flight path simulation

        // Zoom map nicely to view the route
        const bounds = L.latLngBounds([p1, p2]);
        activeLeafletMap.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 5,
            animate: true,
            duration: 1.5
        });
    }
};

window.applyFromPlanner = function() {
    const destSelect = document.getElementById('destinationSelect');
    if (destSelect) {
        const country = destSelect.value;
        selectCountry(country);
    } else {
        window.location.href = "https://eovisas.com/about#contact";
    }
};

// Initial Load Handler additions
window.addEventListener('load', () => {
    // Wait for the loader / screen setup
    setTimeout(initTravelPlannerMap, 150);
});
