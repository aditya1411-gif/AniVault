# AniVault

## Overview

AniVault is a web application that allows users to explore anime using real-time data from the Jikan API. It provides an interactive interface where users can search, filter, and sort anime based on different criteria.

## Tagline

Unlock the World of Anime.

## Features

* Search anime by name
* Filter anime by genre
* Sort anime by rating, popularity, or episodes
* Display anime details in clean and responsive cards

## API Used

Jikan API (MyAnimeList Unofficial API)
Base URL: https://api.jikan.moe/v4

### API Documentation

#### Search Anime

Fetch anime based on a search query:
https://api.jikan.moe/v4/anime?q={anime_name}

Example:
https://api.jikan.moe/v4/anime?q=naruto

#### Filter by Genre

Fetch anime using genre ID:
https://api.jikan.moe/v4/anime?genres={genre_id}

Example:
https://api.jikan.moe/v4/anime?genres=1

Common Genre IDs:

* 1 → Action
* 2 → Adventure
* 4 → Comedy
* 22 → Romance

#### Sorting

Sorting can be applied using query parameters:
https://api.jikan.moe/v4/anime?order_by=score&sort=desc

Example:
https://api.jikan.moe/v4/anime?order_by=score&sort=desc

Available sort options:

* score
* popularity
* episodes

#### Rate Limiting

The Jikan API allows approximately **3 requests per second**.
To prevent hitting the limit, the application uses **debouncing (400–500ms delay)** on search input.

## Technologies Used

* HTML
* CSS
* JavaScript (Vanilla JS)
* Jikan API

## How to Run the Project

1. Clone the repository:
   git clone https://github.com/your-username/anivault.git

2. Open the project folder:
   cd anivault

3. Run the project:
   Open index.html in your browser
