const searchInput = document.getElementById('search-input');
const grid = document.getElementById('anime-grid');
const loading = document.getElementById('loading');

// Fetch and display anime
async function fetchAnime(query = '') {
    loading.style.display = 'block';
    grid.innerHTML = '';

    const url = query
        ? `https://api.jikan.moe/v4/anime?q=${query}&limit=24`
        : 'https://api.jikan.moe/v4/top/anime?limit=24';

    const res = await fetch(url);
    const data = await res.json();

    loading.style.display = 'none';

    data.data.forEach(anime => {
        const card = document.createElement('div');
        card.className = 'anime-card';

        const img = anime.images.jpg.large_image_url;
        const title = anime.title_english || anime.title;
        const eps = anime.episodes || '?';
        const score = anime.score || 'N/A';

        card.innerHTML = `
            <img src="${img}" alt="${title}">
            <h3>${title}</h3>
            <div class="meta">
                <span>${eps} eps</span>
                <span class="score">★ ${score}</span>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Search on Enter key
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        fetchAnime(searchInput.value);
    }
});

// Load top anime on page load
fetchAnime();
