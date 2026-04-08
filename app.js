const searchInput = document.getElementById('search-input');
const grid = document.getElementById('anime-grid');
const loading = document.getElementById('loading');

const sortChips = document.querySelectorAll('.sort-chip');
const filterChips = document.querySelectorAll('.chip:not(.sort-chip)');

let allAnime = []; 
let activeFilters = []; 
let activeSortValue = ''; 

let currentPage = 1;
let hasNextPage = true;
let isFetching = false;

async function fetchNextPage() {
    if (isFetching || !hasNextPage) return;
    isFetching = true;

    if (currentPage > 1 && loading) loading.style.display = 'none';

    try {
        const url = `https://api.jikan.moe/v4/top/anime?limit=25&page=${currentPage}`;
        const res = await fetch(url);
        if (!res.ok) {
            console.warn('API Rate Limit Reached.');
            const trigger = document.getElementById('scroll-trigger');
            if (trigger) trigger.style.display = 'none';
            return;
        }

        const data = await res.json();
        allAnime = allAnime.concat(data.data || []);
        
        applyTransformations();
        
        if (data.pagination && data.pagination.has_next_page === false) {
            hasNextPage = false;
            const trigger = document.getElementById('scroll-trigger');
            if (trigger) trigger.style.display = 'none';
        } else {
            currentPage++;
        }
        
    } catch (err) {
        console.error('Data loading error:', err);
    } finally {
        isFetching = false;
        if (loading) loading.style.display = 'none';
        
        await new Promise(resolve => setTimeout(resolve, 350));
    }
}

const observerOptions = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        fetchNextPage();
    }
}, observerOptions);

const triggerEl = document.getElementById('scroll-trigger');
if (triggerEl) observer.observe(triggerEl);

// Filter, sort, forEach
function applyTransformations() {
    let result = allAnime;

    if (activeFilters.length > 0) {
        result = result.filter(anime => {
            return activeFilters.some(filterValue => {
                const matchType = anime.type === filterValue;
                const matchStatus = anime.status && anime.status.includes(filterValue);
                const matchGenre = anime.genres && anime.genres.some(g => g.name === filterValue);
                return matchType || matchStatus || matchGenre;
            });
        });
    }

    const query = searchInput.value.trim().toLowerCase();
    if (query) {
        result = result.filter(anime => {
            const title = (anime.title_english || anime.title || '').toLowerCase();
            return title.includes(query);
        });
    }

    if (activeSortValue) {
        result = result.sort((a, b) => {
            const scoreA = a.score || 0;
            const scoreB = b.score || 0;
            const titleA = a.title_english || a.title || '';
            const titleB = b.title_english || b.title || '';

            if (activeSortValue === 'scoreAsc') return scoreA - scoreB;
            if (activeSortValue === 'scoreDesc') return scoreB - scoreA;
            if (activeSortValue === 'titleAsc') return titleA.localeCompare(titleB);
            if (activeSortValue === 'titleDesc') return titleB.localeCompare(titleA);
            return 0;
        });
    }

    renderGrid(result);
}


function renderGrid(animeList) {
    grid.innerHTML = '';

    animeList.forEach(anime => {
        const card = document.createElement('div');
        card.className = 'anime-card';

        const img = anime.images?.jpg?.large_image_url || '';
        const title = anime.title_english || anime.title;
        const eps = anime.episodes || '?';
        const score = anime.score ?? 'N/A';

        card.innerHTML = `
            <img src="${img}" alt="${title}">
            <div style="padding: 0.75rem;">
                <h3 style="margin-bottom: 0.5rem; font-size: 0.95rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; min-height: 2.8em;">${title}</h3>
                <div class="meta" style="padding: 0; margin-bottom: 0.75rem;">
                    <span>${eps} eps</span>
                    <span class="score">★ ${score}</span>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

if (searchInput) searchInput.addEventListener('input', applyTransformations);

sortChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const sortType = chip.getAttribute('data-sort');
        
        if (chip.classList.contains('active')) {
            chip.classList.remove('active');
            activeSortValue = '';
        } else {
            sortChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeSortValue = sortType;
        }
        
        applyTransformations();
    });
});

filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const value = chip.textContent.trim();
        chip.classList.toggle('active');

        if (activeFilters.includes(value)) {
            activeFilters = activeFilters.filter(f => f !== value);
        } else {
            activeFilters = [...activeFilters, value];
        }

        applyTransformations();
    });
});


fetchNextPage();