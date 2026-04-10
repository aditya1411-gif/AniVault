# AniVault

## Overview

AniVault is a web application that allows users to explore anime using real-time data from the Jikan API. It provides an interactive interface where users can search, filter, and sort anime based on different criteria.

## Features

- Search anime by title (English title preferred, falls back to Japanese)
- Filter anime by genre (Action, Romance, Comedy, Horror, Sci-Fi), type (TV, Movie), and status (Currently Airing, Completed, Upcoming) — multiple filters can be active at once
- Sort anime by Score (High to Low / Low to High) and Title (A–Z / Z–A) — only one sort active at a time
- Infinite scroll pagination — loads 25 anime per page automatically as user scrolls
- Each card shows the cover image, title (clamped to 2 lines), episode count, and score

## API Used

- API Name: Jikan API (Unofficial MyAnimeList API)
- Base URL: https://api.jikan.moe/v4
- Endpoint used: GET /top/anime?limit=25&page={page}
- All filtering and sorting is done client-side on the fetched data — no filter/sort query params are sent to the API

## How It Works

- On page load, the first page of top anime is fetched
- An IntersectionObserver watches a scroll trigger element at the bottom of the page
- When the trigger enters the viewport, the next page is fetched and appended
- After each fetch, `applyTransformations()` runs — it filters, searches, and sorts the full `allAnime` array and re-renders the grid
- Pagination stops when the API returns `has_next_page: false` or on a rate limit error

## Rate Limiting

- The Jikan API allows approximately 3 requests per second
- The app handles rate limit errors gracefully: if the API returns a non-ok response, fetching stops and the scroll trigger is hidden
- There is no debounce on search — filtering runs instantly on every keystroke against already-fetched data (no extra API calls are made for search)

## Technologies Used

- HTML
- CSS
- JavaScript
- Jikan API

## Demo Link

https://ani-vault-pi.vercel.app/