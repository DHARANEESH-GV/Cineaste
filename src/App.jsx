import React, { useState, useEffect, useMemo } from 'react';

const BASE_URL = 'https://8q7y0xmhw7.execute-api.ap-south-1.amazonaws.com/prod/Movies';
const MOCK_DATA = [
  { id: '1', title: 'The Brutalist', year: '2024', director: 'Brady Corbet', synopsis: 'Escaping post-war Europe, visionary architect László Tóth arrives in America to rebuild his life.', rating: 85, image: 'https://images.unsplash.com/photo-1481026469463-66327c86e544?auto=format&fit=crop&q=80&w=1000', genres: ['DRAMA'] },
  { id: '2', title: 'Zone of Interest', year: '2023', director: 'Jonathan Glazer', synopsis: 'The commandant of Auschwitz, Rudolf Höss, and his wife Hedwig, strive to build a dream life for their family in a house and garden next to the camp.', rating: 90, image: 'https://images.unsplash.com/photo-1505506874110-6a7a6c9924cb?auto=format&fit=crop&q=80&w=1000', genres: ['DRAMA', 'HISTORY'] },
  { id: '3', title: 'Anatomy of a Fall', year: '2023', director: 'Justine Triet', synopsis: 'A woman is suspected of her husband\'s murder, and their blind son faces a moral dilemma as the sole witness.', rating: 88, image: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&q=80&w=1000', genres: ['THRILLER', 'DRAMA'] },
  { id: '4', title: 'Tár', year: '2022', director: 'Todd Field', synopsis: 'Set in the international world of Western classical music, the film centers on Lydia Tár, widely considered one of the greatest living composer-conductors.', rating: 91, image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=1000', genres: ['DRAMA', 'MUSIC'] },
  { id: '5', title: 'Aftersun', year: '2022', director: 'Charlotte Wells', synopsis: 'Sophie reflects on the shared joy and private melancholy of a holiday she took with her father twenty years earlier.', rating: 95, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000', genres: ['DRAMA'] },
  { id: '6', title: 'Drive My Car', year: '2021', director: 'Ryusuke Hamaguchi', synopsis: 'A renowned stage actor and director learns to cope with his wife\'s unexpected passing when he receives an offer to direct a production of Uncle Vanya in Hiroshima.', rating: 89, image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&q=80&w=1000', genres: ['DRAMA'] },
  { id: '7', title: 'Portrait of a Lady on Fire', year: '2019', director: 'Céline Sciamma', synopsis: 'On an isolated island in Brittany at the end of the eighteenth century, a female painter is obliged to paint a wedding portrait of a young woman.', rating: 98, image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1000', genres: ['ROMANCE', 'DRAMA'] }
];

const SVG_NOISE = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400&display=swap');

:root {
  --bg: #121212;
  --text-primary: #EEEEEE;
  --text-secondary: #8A8A8A;
  --accent: #E35F21;
  --font-serif: "Tiempos Text", "Editorial New", "Untitled Serif", "Cormorant Garamond", serif;
  --font-sans: "Aperçu", "Suisse Int'l", "Graphik", "Inter", sans-serif;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  padding: 0;
  background-color: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-sans);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* Texture */
.noise-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.04;
}

/* Layout */
.app-container {
  display: flex;
  min-height: 100vh;
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Nav */
.nav-rail {
  width: 64px;
  border-right: 1px solid rgba(238, 238, 238, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 0;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
}

.nav-item {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  margin-bottom: 4rem;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.3s ease, letter-spacing 0.3s ease;
  position: relative;
  text-transform: uppercase;
}

.nav-item:hover {
  color: var(--text-primary);
  letter-spacing: 0.25em;
}

.nav-item.active {
  color: var(--text-primary);
}

.nav-item.active::after {
  content: "";
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background-color: var(--accent);
}

/* Main Content */
.main-content {
  margin-left: 64px;
  width: calc(100% - 64px);
  padding: 4rem 8%;
  display: flex;
  flex-direction: column;
}

.header-row {
  margin-bottom: 4rem;
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 2rem;
}

.title-massive {
  font-family: var(--font-serif);
  font-size: 10vw;
  font-weight: 300;
  line-height: 0.8;
  margin: 0;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.title-massive .period {
  color: var(--accent);
}

.subheader {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-secondary);
}

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 4rem;
  border-bottom: 1px solid rgba(238, 238, 238, 0.1);
  padding-bottom: 1rem;
}

.filters {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  align-items: center;
}

.filter-year {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--text-secondary);
  cursor: pointer;
  position: relative;
  padding-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.filter-year.active {
  color: var(--text-primary);
}

.filter-year::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--accent);
  transform: scaleX(0);
  transition: transform 0.3s ease;
  transform-origin: left;
}

.filter-year.active::after {
  transform: scaleX(1);
}

.search-trigger {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.3s ease;
  background: none;
  border: none;
  padding: 0;
}

.search-trigger:hover {
  color: var(--text-primary);
}

.search-input {
  background: none;
  border: none;
  color: var(--text-primary);
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-style: italic;
  outline: none;
  width: 200px;
  border-bottom: 1px solid var(--text-primary);
  padding-bottom: 0.25rem;
}

.search-input::placeholder {
  color: rgba(138, 138, 138, 0.5);
}

/* Grid */
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  opacity: 1;
  transition: opacity 0.5s ease;
}

.movie-grid.loading {
  opacity: 0;
}

.movie-item {
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.movie-image-container {
  width: 100%;
  aspect-ratio: 2 / 3;
  overflow: visible;
  background-color: rgba(255, 255, 255, 0.02);
  margin-bottom: 0.75rem;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 2px;
  position: relative;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.4s ease;
  z-index: 1;
}

.movie-item:hover .movie-image-container {
  border-color: var(--accent);
  transform: translateY(-8px) scale(1.02);
  z-index: 10;
}

.movie-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.4s ease;
  filter: grayscale(0%);
  display: block;
  position: relative;
  z-index: 2;
  border-radius: 2px;
}

.movie-item:hover .movie-image {
  filter: grayscale(0%);
}

.movie-image-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(25px);
  opacity: 0;
  z-index: 1;
  transform: scale(0.9) translateY(10%);
  transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  pointer-events: none;
}

.movie-item:hover .movie-image-glow {
  opacity: 0.8;
  transform: scale(1.1) translateY(15%);
  filter: blur(40px);
}

.movie-meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}

.movie-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  margin: 0;
  font-weight: 300;
  position: relative;
  display: inline-block;
  color: var(--text-primary);
}

.movie-title::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--text-primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s ease;
}

.movie-item:hover .movie-title::after {
  transform: scaleX(1);
}

.movie-year {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: var(--text-secondary);
}

/* Detail Overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
  z-index: 100;
  display: flex;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.overlay.visible {
  opacity: 1;
  pointer-events: auto;
}

.overlay-content {
  display: flex;
  width: 100%;
  height: 100%;
  transform: scale(0.95) translateY(20px);
  transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.overlay.visible .overlay-content {
  transform: scale(1) translateY(0);
}

.close-btn {
  position: absolute;
  top: 2rem;
  right: 4rem;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 300;
  cursor: pointer;
  z-index: 101;
  font-family: var(--font-sans);
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: var(--accent);
}

.overlay-left {
  flex: 1;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
}

.media-card {
  width: 100%;
  max-width: 400px;
  margin-top: 3rem;
  margin-bottom: 2rem;
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.4s ease, box-shadow 0.4s ease;
}

.media-card:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.4);
}

.media-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  gap: 0.75rem;
}

.media-empty-icon {
  font-size: 2rem;
  opacity: 0.3;
}

.media-empty-text {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: var(--text-secondary);
  text-transform: uppercase;
  text-align: center;
}

.media-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 0.5rem;
}

.media-loading-dot {
  width: 4px;
  height: 4px;
  background-color: var(--accent);
  border-radius: 50%;
  animation: mediaPulse 1.4s ease-in-out infinite;
}

.media-loading-dot:nth-child(2) { animation-delay: 0.2s; }
.media-loading-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes mediaPulse {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

.video-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 4px;
  overflow: hidden;
  background-color: #000;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}

.video-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.gallery-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.gallery-img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 4px;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.4s ease, z-index 0s;
  filter: grayscale(40%) brightness(0.8);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.gallery-img:hover {
  transform: scale(1.05);
  filter: grayscale(0%) brightness(1.1);
  position: relative;
  z-index: 10;
  box-shadow: 0 8px 20px rgba(0,0,0,0.6);
}

.media-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(5px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

.media-modal-content {
  position: relative;
  transform: scale(0.95);
  animation: scaleUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  box-shadow: 0 20px 60px rgba(0,0,0,0.8);
  border-radius: 4px;
  overflow: hidden;
}

@keyframes scaleUp {
  to { transform: scale(1); }
}

.overlay-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
}

.overlay-right {
  flex: 1;
  padding: 8rem 6rem 4rem 4rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.detail-title {
  font-family: var(--font-serif);
  font-size: 4rem;
  font-weight: 300;
  margin: 0 0 1rem 0;
  line-height: 1;
  color: var(--text-primary);
}

.detail-meta {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 3rem;
  display: flex;
  gap: 1rem;
}

.detail-synopsis {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--text-primary);
  max-width: 400px;
  text-align: justify;
  margin-bottom: 4rem;
  font-style: italic;
  font-weight: 300;
}

.rating-container {
  margin-bottom: 4rem;
  max-width: 400px;
}

.rating-label {
  font-family: var(--font-sans);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  display: block;
}

.rating-bar-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
}

.rating-bar-bg {
  flex: 1;
  height: 1px;
  background-color: rgba(238, 238, 238, 0.1);
  position: relative;
}

.rating-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 1px;
  background-color: var(--accent);
  width: 0;
  transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
}

.rating-number {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  margin-left: 1rem;
  color: var(--text-primary);
}

.tech-data {
  margin-bottom: 3rem;
  max-width: 400px;
}

.tech-data-summary {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  cursor: pointer;
  color: var(--text-secondary);
  list-style: none;
  transition: color 0.3s ease;
}

.tech-data-summary:hover {
  color: var(--text-primary);
}

.tech-data-summary::-webkit-details-marker {
  display: none;
}

.tech-data-content {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--text-secondary);
  background-color: rgba(255,255,255,0.02);
  padding: 1rem;
  margin-top: 1rem;
  white-space: pre-wrap;
  border-left: 1px solid rgba(238,238,238,0.1);
}

.actions {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  align-items: center;
}

.action-link {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--text-secondary);
  text-transform: uppercase;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.3s ease;
}

.action-link:hover {
  color: var(--accent);
}

.inline-confirm {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--text-primary);
  text-transform: uppercase;
}

/* Add Form */
.add-form-container {
  max-width: 600px;
  width: 100%;
  animation: fadeIn 0.8s ease-out forwards;
}

.form-group {
  margin-bottom: 4rem;
}

.form-label {
  display: block;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.form-input {
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid rgba(238, 238, 238, 0.2);
  color: var(--text-primary);
  font-family: var(--font-serif);
  font-size: 2rem;
  padding: 0.5rem 0;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-bottom-color: var(--accent);
}

textarea.form-input {
  font-size: 1.25rem;
  resize: vertical;
  min-height: 100px;
}

.publish-btn {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  color: var(--text-primary);
  background: none;
  border: none;
  text-transform: uppercase;
  cursor: pointer;
  padding: 0;
  transition: color 0.3s ease;
}

.publish-btn:hover {
  color: var(--accent);
}

/* Skeletons */
.skeleton-line {
  height: 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  margin-bottom: 0.5rem;
  position: relative;
  overflow: hidden;
}
.skeleton-line::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 200%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent);
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  100% { transform: translateX(100%); }
}


/* Reviews & Diary */
.view-transition {
  animation: fadeUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.stagger-item {
  opacity: 0;
  animation: fadeUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(238, 238, 238, 0.1);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(238, 238, 238, 0.2);
}

.genre-pill {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(227, 95, 33, 0.9);
  color: #fff;
  font-size: 0.6rem;
  padding: 0.25rem 0.5rem;
  border-radius: 2px;
  font-family: var(--font-sans);
  letter-spacing: 0.1em;
  z-index: 20;
}

.torrent-btn {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--text-secondary);
  text-transform: uppercase;
  background: none;
  border: 1px solid rgba(238, 238, 238, 0.15);
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.torrent-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.quality-btn {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: var(--text-primary);
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
}

.quality-btn:hover {
  border-color: var(--accent);
  background: rgba(227, 95, 33, 0.1);
}

.quality-size {
  font-size: 0.6rem;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
}

.star-rating {
  display: flex;
  gap: 0.25rem;
  cursor: pointer;
}
.star {
  color: rgba(238, 238, 238, 0.2);
  transition: color 0.2s ease, transform 0.2s ease;
  font-size: 1.5rem;
  position: relative;
}
.star.filled {
  color: var(--accent);
}
.star.half::after {
  content: "★";
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  overflow: hidden;
  color: var(--accent);
}
.star:hover {
  transform: scale(1.2);
}

.heart-btn {
  background: none;
  border: none;
  color: rgba(238, 238, 238, 0.2);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  padding: 0;
}
.heart-btn.liked {
  color: #ff3366;
  animation: heartBounce 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
@keyframes heartBounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.4); }
  100% { transform: scale(1); }
}

.review-card {
  border-top: 1px solid rgba(238, 238, 238, 0.1);
  padding: 2rem 0;
  display: flex;
  gap: 2rem;
}
.review-date {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--text-secondary);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(238, 238, 238, 0.1);
}

.review-grid {
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .nav-rail {
    flex-direction: row;
    width: 100vw;
    height: 64px;
    top: auto;
    bottom: 0;
    left: 0;
    border-right: none;
    border-top: 1px solid rgba(238, 238, 238, 0.05);
    padding: 0;
    justify-content: space-evenly;
    align-items: center;
    background-color: var(--bg);
    z-index: 90;
  }
  
  .nav-item {
    writing-mode: horizontal-tb;
    transform: none;
    margin-bottom: 0;
  }
  
  .nav-item.active::after {
    left: 50%;
    top: -12px;
    transform: translateX(-50%);
  }

  .main-content {
    margin-left: 0;
    width: 100%;
    padding: 2rem 5%;
    padding-bottom: 80px;
  }

  .title-massive {
    font-size: 15vw;
  }

  .movie-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .overlay-content {
    flex-direction: column;
    overflow-y: auto;
  }

  .overlay-left {
    padding: 2rem;
    overflow-y: visible;
  }

  .overlay-right {
    padding: 2rem;
    overflow-y: visible;
  }
  
  .detail-title {
    font-size: 2.5rem;
  }
  
  .actions {
    flex-wrap: wrap;
  }
}
`;

const StarRating = ({ rating, setRating, interactive = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseMove = (e, index) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    setHoverRating(index + (isHalf ? 0.5 : 1));
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };

  const handleClick = (e, index) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    if (setRating) setRating(index + (isHalf ? 0.5 : 1));
  };

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="star-rating" onMouseLeave={handleMouseLeave}>
      {[...Array(5)].map((_, i) => {
        const isFilled = displayRating >= i + 1;
        const isHalf = displayRating > i && displayRating < i + 1;
        return (
          <span
            key={i}
            className={`star ${isFilled ? 'filled' : ''} ${isHalf ? 'half' : ''}`}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onClick={(e) => handleClick(e, i)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

const HeartButton = ({ liked, setLiked, interactive = false }) => (
  <button 
    className={`heart-btn ${liked ? 'liked' : ''}`} 
    onClick={(e) => {
      e.stopPropagation();
      if(interactive && setLiked) setLiked(!liked);
    }}
  >
    ❤
  </button>
);

const TypographicPoster = ({ title }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      boxSizing: 'border-box',
      border: '1px solid rgba(255,255,255,0.03)',
      aspectRatio: '2/3',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        fontSize: '0.5rem',
        letterSpacing: '0.3em',
        color: 'var(--accent)',
        fontFamily: 'var(--font-sans)'
      }}>
        ARCHIVE // NO MEDIA
      </div>
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 1.1,
        textAlign: 'left',
        wordBreak: 'break-word',
        margin: 0,
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
        width: '100%',
        fontStyle: 'italic',
        fontWeight: 300
      }}>
        {title}
      </h2>
    </div>
  );
};

const SmartPoster = ({ movie }) => {
  const [imageFailed, setImageFailed] = useState(false);

  if (!movie.image || imageFailed) {
    return <TypographicPoster title={movie.title} />;
  }

  return (
    <>
      <img 
        src={movie.image} 
        alt={movie.title} 
        className="movie-image-glow" 
        loading="lazy" 
        onError={() => setImageFailed(true)} 
      />
      <img 
        src={movie.image} 
        alt={movie.title} 
        className="movie-image" 
        loading="lazy" 
        onError={() => setImageFailed(true)} 
      />
    </>
  );
};

const ParallaxPoster = ({ image, title }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const containerRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Invert Y for natural physical tilt (mouse up tilts image up)
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotation({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.6 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlare({ ...glare, opacity: 0 });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'crosshair'
      }}
    >
      <div 
        style={{
          display: 'inline-block',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: rotation.x === 0 && rotation.y === 0 ? 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'transform 0.1s linear',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          boxShadow: rotation.x !== 0 ? '0 30px 60px rgba(0,0,0,0.8)' : '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        {image && !imageFailed ? (
          <img 
            src={image} 
            alt={title} 
            style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', display: 'block', margin: 0 }} 
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
            <TypographicPoster title={title} />
          </div>
        )}
        <div  
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)`,
            opacity: glare.opacity,
            transition: glare.opacity === 0 ? 'opacity 0.5s ease' : 'opacity 0.1s linear',
            pointerEvents: 'none'
          }}
        />
      </div>
    </div>
  );
};

const MediaModal = ({ media, onClose }) => {
  if (!media) return null;
  return (
    <div className="media-modal" onClick={onClose}>
      <button className="close-btn" style={{ right: '2rem', top: '2rem', position: 'absolute' }} onClick={onClose}>×</button>
      <div className="media-modal-content" onClick={e => e.stopPropagation()}>
        {media.type === 'image' ? (
          <img src={media.url} alt="Preview" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', display: 'block' }} />
        ) : (
          <iframe 
            src={media.url} 
            style={{ width: '90vw', height: '90vh', maxWidth: '1280px', maxHeight: '720px', border: 'none', display: 'block' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            title="Preview"
          />
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [previewMedia, setPreviewMedia] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState('idle');
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('cinerama_reviews');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cinerama_reviews', JSON.stringify(reviews));
  }, [reviews]);
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState({ rating: 0, text: '', liked: false, date: new Date().toISOString().split('T')[0] });


  const [currentView, setCurrentView] = useState('FILMS');
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (previewMedia) {
          setPreviewMedia(null);
        } else if (overlayOpen) {
          setOverlayOpen(false);
          setTimeout(() => {
            setSelectedMovie(null);
            setShowRating(false);
          }, 500);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewMedia, overlayOpen]);
  const [recommendations, setRecommendations] = useState([]);
  const [searchType, setSearchType] = useState('ALL');
  
  const [tmdbMedia, setTmdbMedia] = useState(null);
  const [tmdbLoading, setTmdbLoading] = useState(false);

  const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

  const fetchTMDBMedia = async (movie) => {
    setTmdbLoading(true);
    setTmdbMedia(null);
    try {
      let tmdbId = null;
      let type = 'movie';

      if (movie.id && movie.id.startsWith('tt')) {
        const findRes = await fetch(`https://api.themoviedb.org/3/find/${movie.id}?external_source=imdb_id&api_key=${TMDB_KEY}`);
        const findData = await findRes.json();
        
        if (findData.movie_results && findData.movie_results.length > 0) {
          tmdbId = findData.movie_results[0].id;
          type = 'movie';
        } else if (findData.tv_results && findData.tv_results.length > 0) {
          tmdbId = findData.tv_results[0].id;
          type = 'tv';
        }
      }

      if (!tmdbId && movie.title) {
        const searchRes = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(movie.title)}&api_key=${TMDB_KEY}`);
        const searchData = await searchRes.json();
        if (searchData.results && searchData.results.length > 0) {
          const firstValid = searchData.results.find(r => r.media_type === 'movie' || r.media_type === 'tv');
          if (firstValid) {
            tmdbId = firstValid.id;
            type = firstValid.media_type;
          }
        }
      }

      if (tmdbId) {
        const mediaRes = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${TMDB_KEY}&append_to_response=videos,images`);
        const mediaData = await mediaRes.json();
        
        const trailer = mediaData.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube') || 
                        mediaData.videos?.results?.find(v => v.site === 'YouTube');
        
        const backdrops = mediaData.images?.backdrops?.slice(0, 8) || [];
        
        setTmdbMedia({ trailer, backdrops });
      }
    } catch (e) {
      console.error("TMDB Fetch Error", e);
    } finally {
      setTmdbLoading(false);
    }
  };

  const [torrentStatus, setTorrentStatus] = useState('idle');
  const [availableTorrents, setAvailableTorrents] = useState([]);

  const fetchTorrents = async (movie) => {
    setTorrentStatus('loading');
    setAvailableTorrents([]);
    try {
      const query = encodeURIComponent(`${movie.title} ${movie.year}`);
      const targetUrl = `https://apibay.org/q.php?q=${query}`;

      const proxies = [
        (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
        (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
        (url) => `https://thingproxy.freeboard.io/fetch/${url}`,
      ];

      let data = null;
      let lastError = null;

      for (const makeProxy of proxies) {
        try {
          const proxyUrl = makeProxy(targetUrl);
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);
          const response = await fetch(proxyUrl, { signal: controller.signal });
          clearTimeout(timeout);
          const text = await response.text();
          data = JSON.parse(text);
          break; 
        } catch (proxyErr) {
          lastError = proxyErr;
          console.warn("Proxy failed, trying next...", proxyErr.message);
          continue;
        }
      }

      if (!data) throw lastError || new Error("All proxies failed");
      
      if (Array.isArray(data) && data[0] && data[0].id !== '0') {
        const results = data.slice(0, 4).map(t => {
          let quality = 'SD';
          if (t.name.toLowerCase().includes('1080p')) quality = '1080p';
          else if (t.name.toLowerCase().includes('720p')) quality = '720p';
          else if (t.name.toLowerCase().includes('2160p') || t.name.toLowerCase().includes('4k')) quality = '4K';
          
          let type = '';
          if (t.name.toLowerCase().includes('bluray') || t.name.toLowerCase().includes('brrip')) type = 'BluRay';
          else if (t.name.toLowerCase().includes('web')) type = 'WEB';
          
          const bytes = parseInt(t.size) || 0;
          const gb = bytes / (1024 * 1024 * 1024);
          const sizeStr = gb > 1 ? gb.toFixed(1) + ' GB' : (bytes / (1024 * 1024)).toFixed(0) + ' MB';

          return {
            hash: t.info_hash,
            quality: quality,
            type: type,
            size: sizeStr,
            seeds: t.seeders,
            title: t.name
          };
        });
        setAvailableTorrents(results);
        setTorrentStatus('success');
      } else {
        setTorrentStatus('none');
      }
    } catch (error) {
      console.error("Torrent fetch error", error);
      setTorrentStatus('error');
    }
  };

  const getMagnetLink = (hash, title) => {
    return `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(title)}&tr=udp://tracker.opentrackr.org:1337/announce`;
  };


  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('cinerama_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cinerama_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const fetchingGenresRef = React.useRef(new Set());

  useEffect(() => {
    const OMDB_KEY = import.meta.env.VITE_OMDB_KEY;
    
    const missing = movies.filter(m => m.genres && m.genres.length === 0 && m.id && !fetchingGenresRef.current.has(m.id));
    if (missing.length === 0) return;

    missing.forEach(movie => {
      fetchingGenresRef.current.add(movie.id);
      fetch(`https://www.omdbapi.com/?i=${movie.id}&apikey=${OMDB_KEY}`)
        .then(res => res.json())
        .then(fullData => {
          if (fullData.Response === 'True') {
            const genres = fullData.Genre && fullData.Genre !== 'N/A' ? fullData.Genre.split(', ').map(g => g.toUpperCase()) : ['MOVIE'];
            setMovies(currentMovies => 
              currentMovies.map(m => m.id === movie.id ? { ...m, genres } : m)
            );
          } else {
            setMovies(currentMovies => 
              currentMovies.map(m => m.id === movie.id ? { ...m, genres: ['MOVIE'] } : m)
            );
          }
        })
        .catch(() => {
          setMovies(currentMovies => 
            currentMovies.map(m => m.id === movie.id ? { ...m, genres: ['MOVIE'] } : m)
          );
        });
    });
  }, [movies]);

  const searchMoviesFromAWS = async (query = 'batman', type = searchType) => {
    setLoading(true);
    let data = [];
    const typeParam = type !== 'ALL' ? `&type=${type.toLowerCase()}` : '';
    try {
      const response = await fetch(`${BASE_URL}?s=${encodeURIComponent(query)}${typeParam}`);
      let jsonData = await response.json();

      if (typeof jsonData === 'string') {
        jsonData = JSON.parse(jsonData);
      }

      if (jsonData.Search) {
        data = jsonData.Search.map(m => {
          const hasImage = m.Poster !== 'N/A' && m.Poster;
          return {
            id: m.imdbID,
            title: m.Title,
            year: m.Year,
            director: 'Unknown',
            synopsis: 'Details fetched via AWS API',
            rating: 0,
            genres: [],
            image: hasImage ? m.Poster : null
          };
        });

        data.sort((a, b) => {
          if (a.image && !b.image) return -1;
          if (!a.image && b.image) return 1;
          return 0;
        });
      }

      if (data.length === 0) {
        data = MOCK_DATA;
      }
    } catch (err) {
      console.error("AWS Fetch Error:", err);
      data = MOCK_DATA;
    }

    await new Promise(resolve => setTimeout(resolve, 600));
    setMovies(data);
    setLoading(false);
  };

  const loadCompletelyRandomMixedCollection = async () => {
    setLoading(true);
    const diverseList = [
      'inception', 'gladiator', 'jaws', 'alien', 'parasite', 'psycho',
      'fargo', 'goodfellas', 'halloween', 'jumanji', 'shrek', 'matrix',
      'rocky', 'titanic', 'avatar', 'dune', 'superman', 'batman',
      'scream', 'twister', 'speed', 'predator', 'robocop', 'casablanca',
      'vertigo', 'her', 'arrival', 'sicario', 'se7en', 'zodiac', 'memento',
      'moana', 'frozen', 'cars', 'up', 'coco', 'soul', 'brave', 'mulan',
      'aladdin', 'lion king', 'tarzan', 'hercules', 'shining', 'exorcist',
      'thing', 'saw', 'ring', 'conjuring', 'insidious', 'sinister'
    ];

    const shuffled = diverseList.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    try {
      const promises = selected.map(term => fetch(`${BASE_URL}?s=${encodeURIComponent(term)}`).then(r => r.json()));
      const results = await Promise.allSettled(promises);

      let allFound = [];
      results.forEach(res => {
        if (res.status === 'fulfilled') {
          const data = res.value;
          const searchArray = typeof data === 'string' ? JSON.parse(data).Search : data.Search;
          if (searchArray) {
            allFound = [...allFound, ...searchArray];
          }
        }
      });

      const finalMixed = [];
      allFound.sort(() => 0.5 - Math.random());
      for (const m of allFound) {
        if (finalMixed.length >= 10) break;
        if (!finalMixed.find(existing => existing.id === m.imdbID)) {
          finalMixed.push({
            id: m.imdbID,
            title: m.Title,
            year: m.Year,
            director: 'Unknown',
            synopsis: 'Details fetched via AWS API',
            rating: 0,
            genres: [],
            image: m.Poster !== 'N/A' && m.Poster ? m.Poster : `https://placehold.co/400x600/121212/E35F21?text=${encodeURIComponent(m.Title)}`
          });
        }
      }
      setMovies(finalMixed.length > 0 ? finalMixed : MOCK_DATA);
    } catch (e) {
      console.error("Mixed Randomizer failed", e);
      setMovies(MOCK_DATA);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loadCompletelyRandomMixedCollection();
  }, []);

  const years = ['ALL', ...Array.from(new Set(movies.map(m => String(m.year || '').substring(0, 4)))).filter(y => y.length === 4).sort().reverse()];

  const filteredMovies = useMemo(() => {
    return movies.filter(m => {
      if (selectedYear !== 'ALL' && !String(m.year || '').startsWith(selectedYear)) return false;
      if (searchTerm && !m.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [movies, selectedYear, searchTerm]);

  const openDetail = async (movie) => {
    setSelectedMovie(movie);
    requestAnimationFrame(() => {
      setOverlayOpen(true);
      setTimeout(() => setShowRating(true), 300);
    });
    setRecommendations([]);
    const titleWords = movie.title.split(' ').map(w => w.replace(/[^a-zA-Z0-9]/g, '')).filter(w => w.length > 3);
    const searchKeyword = titleWords[0] || movie.title.split(' ')[0];

    fetch(`${BASE_URL}?s=${encodeURIComponent(searchKeyword)}`)
      .then(res => res.json())
      .then(data => {
        const searchArray = typeof data === 'string' ? JSON.parse(data).Search : data.Search;
        if (searchArray) {
          const recs = searchArray.filter(m => m.imdbID !== movie.id).slice(0, 3).map(m => ({
            id: m.imdbID,
            title: m.Title,
            year: m.Year,
            director: 'Unknown',
            synopsis: '',
            rating: 0,
            genres: [],
            image: m.Poster !== 'N/A' && m.Poster ? m.Poster : `https://placehold.co/400x600/121212/E35F21?text=${encodeURIComponent(m.Title)}`
          }));
          setRecommendations(recs);
        }
      })
      .catch(e => console.error("Recommender fetch failed", e));

    fetchTMDBMedia(movie);
    
    if (movie.director === 'Unknown' || movie.synopsis.includes('fetched via AWS')) {
      try {
        const OMDB_KEY = import.meta.env.VITE_OMDB_KEY;
        const res = await fetch(`https://www.omdbapi.com/?i=${movie.id}&plot=full&apikey=${OMDB_KEY}`);
        const fullData = await res.json();

        if (fullData.Response === 'True') {
          const newDetails = {
            director: fullData.Director !== 'N/A' ? fullData.Director : 'Unknown',
            synopsis: fullData.Plot !== 'N/A' ? fullData.Plot : 'No synopsis available.',
            rating: parseInt(fullData.Metascore) || 85,
            genres: fullData.Genre && fullData.Genre !== 'N/A' ? fullData.Genre.split(', ').map(g => g.toUpperCase()) : [],
            actors: fullData.Actors !== 'N/A' ? fullData.Actors : 'Unknown',
            boxOffice: fullData.BoxOffice !== 'N/A' ? fullData.BoxOffice : 'N/A',
            runtime: fullData.Runtime !== 'N/A' ? fullData.Runtime : 'Unknown',
            awards: fullData.Awards !== 'N/A' ? fullData.Awards : 'None'
          };

          setSelectedMovie(prev => {
            if (!prev || prev.id !== movie.id) return prev;
            return { ...prev, ...newDetails };
          });

          setMovies(currentMovies =>
            currentMovies.map(m => m.id === movie.id ? { ...m, ...newDetails } : m)
          );
        }
      } catch (e) {
        console.error("Failed to fetch full details", e);
      }
    }
  };

  const closeDetail = () => {
    setOverlayOpen(false);
    setShowRating(false);
    setDeleteStatus('idle');
    setTorrentStatus('idle');
    setAvailableTorrents([]);
    setTmdbMedia(null);
    setTmdbLoading(false);
    setTimeout(() => setSelectedMovie(null), 600);
  };

  const handlePublish = (e) => {
    e.preventDefault();
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setCurrentView('FILMS');
    }, 1500);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="noise-overlay" style={{ backgroundImage: `url("${SVG_NOISE}")` }}></div>

      <div className="app-container">
        <nav className="nav-rail">
          <div
            className={`nav-item ${currentView === 'FILMS' ? 'active' : ''}`}
            onClick={() => setCurrentView('FILMS')}
          >
            FILMS
          </div>
          <div
            className={`nav-item ${currentView === 'ADD' ? 'active' : ''}`}
            onClick={() => setCurrentView('ADD')}
          >
            ADD
          </div>
          <div
            className={`nav-item ${currentView === 'WATCHLIST' ? 'active' : ''}`}
            onClick={() => setCurrentView('WATCHLIST')}
          >
            WATCHLIST
          </div>
          <div
            className={`nav-item ${currentView === 'REVIEWS' ? 'active' : ''}`}
            onClick={() => setCurrentView('REVIEWS')}
          >
            REVIEWS
          </div>
        </nav>

        <main className="main-content">
          <header className="header-row">
            <h1 className="title-massive">
              CINÉRAMA<span className="period">.</span>
            </h1>
            <div className="subheader">
              {loading ? (
                <span>LOADING COLLECTION...</span>
              ) : (
                <span>OVER 5.3 MILLION FILMS IN COLLECTION</span>
              )}
            </div>
          </header>

          {currentView === 'FILMS' && (
            <>
              <div className="toolbar" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', borderBottom: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="filters" style={{ flex: 1, gap: '1.5rem' }}>
                    <span style={{ marginRight: '1rem', color: 'var(--accent)', fontSize: '0.65rem', letterSpacing: '0.2em', display: 'inline-block', marginBottom: '0.5rem' }}>RELEASE YEAR //</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                      {years.map(year => (
                        <span
                          key={year}
                          className={`filter-year ${selectedYear === year ? 'active' : ''}`}
                          onClick={() => setSelectedYear(year)}
                        >
                          {year}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="filters" style={{ flex: 1, justifyContent: 'flex-end', textAlign: 'right', gap: '1.5rem' }}>
                    <span style={{ marginRight: '1rem', color: 'var(--accent)', fontSize: '0.65rem', letterSpacing: '0.2em', display: 'inline-block', marginBottom: '0.5rem' }}>MEDIA FORMAT //</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'flex-end' }}>
                      {['ALL', 'MOVIE', 'SERIES'].map(type => (
                        <span
                          key={type}
                          className={`filter-year ${searchType === type ? 'active' : ''}`}
                          onClick={() => {
                            setSearchType(type);
                            if (searchTerm) searchMoviesFromAWS(searchTerm, type);
                          }}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="search-box" style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
                  {showSearch ? (
                    <input
                      type="text"
                      className="search-input"
                      placeholder="press enter to search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchTerm) {
                          searchMoviesFromAWS(searchTerm, searchType);
                        }
                      }}
                      autoFocus
                      onBlur={() => {
                        if (!searchTerm) setShowSearch(false);
                      }}
                    />
                  ) : (
                    <button className="search-trigger" onClick={() => setShowSearch(true)}>SEARCH</button>
                  )}
                </div>
              </div>

              <div className={`movie-grid view-transition ${loading ? 'loading' : ''}`}>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="movie-item" style={{ gap: '1rem' }}>
                      <div className="movie-image-container" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}></div>
                      <div className="skeleton-line" style={{ width: '80%' }}></div>
                      <div className="skeleton-line" style={{ width: '40%' }}></div>
                    </div>
                  ))
                ) : (
                  filteredMovies.map((movie, i) => (
                    <div key={movie.id} className="movie-item stagger-item" style={{ animationDelay: `${i * 0.05}s` }} onClick={() => openDetail(movie)}>
                      <div className="movie-image-container">
                        {movie.genres && movie.genres[0] && <div className="genre-pill">{movie.genres[0]}</div>}
                        <SmartPoster movie={movie} />
                      </div>
                      <div className="movie-meta">
                        <h2 className="movie-title">{movie.title}</h2>
                        <span className="movie-year">{movie.year}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {currentView === 'ADD' && (
            <form className="add-form-container view-transition" onSubmit={handlePublish}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input required className="form-input" placeholder="e.g. The Brutalist" />
              </div>
              <div className="form-group">
                <label className="form-label">Year</label>
                <input required className="form-input" placeholder="e.g. 2024" />
              </div>
              <div className="form-group">
                <label className="form-label">Director</label>
                <input required className="form-input" placeholder="e.g. Brady Corbet" />
              </div>
              <div className="form-group">
                <label className="form-label">Synopsis</label>
                <textarea required className="form-input" placeholder="Brief editorial summary..."></textarea>
              </div>
              <button type="submit" className="publish-btn" disabled={isPublishing}>
                {isPublishing ? 'PUBLISHING...' : 'PUBLISH'}
              </button>
            </form>
          )}


          {currentView === 'REVIEWS' && (
            <div className="review-grid view-transition">
              {reviews.length === 0 ? (
                <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    You haven't logged any films yet.
                  </div>
                  <button className="action-link" onClick={() => setCurrentView('FILMS')} style={{ borderBottom: '1px solid var(--accent)', paddingBottom: '0.25rem' }}>BROWSE FILMS</button>
                </div>
              ) : (
                reviews.sort((a, b) => new Date(b.date) - new Date(a.date)).map((review, i) => (
                  <div key={review.movieId} className="review-card stagger-item" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div style={{ width: '120px', flexShrink: 0, cursor: 'pointer' }} onClick={() => openDetail(review.movie)}>
                      <SmartPoster movie={review.movie} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h2 className="movie-title" style={{ fontSize: '2rem', cursor: 'pointer' }} onClick={() => openDetail(review.movie)}>{review.movie.title}</h2>
                        <span className="review-date">{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <StarRating rating={review.rating} />
                        {review.liked && <HeartButton liked={true} />}
                      </div>
                      {review.text && (
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontStyle: 'italic', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                          {review.text}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {currentView === 'WATCHLIST' && (
            <div className={`movie-grid view-transition`}>
              {watchlist.length === 0 ? (
                <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Your watchlist is currently empty.
                  </div>
                  <button className="action-link" onClick={() => setCurrentView('FILMS')} style={{ borderBottom: '1px solid var(--accent)', paddingBottom: '0.25rem' }}>BROWSE FILMS</button>
                </div>
              ) : (
                watchlist.map((movie, i) => (
                  <div key={movie.id} className="movie-item stagger-item" style={{ animationDelay: `${i * 0.05}s` }} onClick={() => openDetail(movie)}>
                    <div className="movie-image-container">
                      {movie.genres && movie.genres[0] && <div className="genre-pill">{movie.genres[0]}</div>}
                      <SmartPoster movie={movie} />
                    </div>
                    <div className="movie-meta">
                      <h2 className="movie-title">{movie.title}</h2>
                      <span className="movie-year">{movie.year}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      <div className={`overlay ${overlayOpen ? 'visible' : ''}`}>
        {selectedMovie && (
          <>
            <button className="close-btn" onClick={closeDetail}>×</button>
            <div className="overlay-content">
              <div className="overlay-left" style={{ perspective: '1000px' }}>
                <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto' }}>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <ParallaxPoster image={selectedMovie.image} title={selectedMovie.title} />
                  </div>
                  
                  <div className="media-card view-transition">
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.15em', marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
                      MEDIA & GALLERY
                    </h3>
                    
                    {tmdbLoading && (
                      <div className="media-loading">
                        <div className="media-loading-dot"></div>
                        <div className="media-loading-dot"></div>
                        <div className="media-loading-dot"></div>
                      </div>
                    )}

                    {!tmdbLoading && tmdbMedia?.trailer && (
                      <div 
                        className="video-container" 
                        style={{ position: 'relative', cursor: 'pointer' }}
                        onClick={() => setPreviewMedia({ type: 'video', url: `https://www.youtube.com/embed/${tmdbMedia.trailer.key}?autoplay=1` })}
                      >
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }} />
                        <iframe 
                          src={`https://www.youtube.com/embed/${tmdbMedia.trailer.key}?rel=0`} 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                          title="Trailer"
                          style={{ pointerEvents: 'none' }}
                        />
                      </div>
                    )}
                    
                    {!tmdbLoading && tmdbMedia?.backdrops?.length > 0 && (
                      <div className="gallery-container">
                        {tmdbMedia.backdrops.map((img, i) => (
                          <img 
                            key={i} 
                            src={`https://image.tmdb.org/t/p/w500${img.file_path}`} 
                            alt="Screenshot" 
                            className="gallery-img" 
                            onClick={() => setPreviewMedia({ type: 'image', url: `https://image.tmdb.org/t/p/original${img.file_path}` })}
                          />
                        ))}
                      </div>
                    )}

                    {!tmdbLoading && (!tmdbMedia || (!tmdbMedia.trailer && (!tmdbMedia.backdrops || tmdbMedia.backdrops.length === 0))) && (
                      <div className="media-empty">
                        <div className="media-empty-icon">🎬</div>
                        <div className="media-empty-text">No trailers or stills available for this title</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="overlay-right">
                <h1 className="detail-title">{selectedMovie.title}</h1>
                <div className="detail-meta">
                  <span>{selectedMovie.year}</span>
                  <span>—</span>
                  <span>{selectedMovie.director}</span>
                </div>

                <p className="detail-synopsis">{selectedMovie.synopsis}</p>

                <div className="actions">
                  <button
                    className="action-link"
                    onClick={() => {
                      if (watchlist.some(m => m.id === selectedMovie.id)) {
                        setWatchlist(watchlist.filter(m => m.id !== selectedMovie.id));
                      } else {
                        setWatchlist([...watchlist, selectedMovie]);
                      }
                    }}
                  >
                    {watchlist.some(m => m.id === selectedMovie.id) ? 'REMOVE FROM WATCHLIST' : 'SAVE TO WATCHLIST'}
                  </button>
                  <button className="action-link">EDIT</button>

                  {deleteStatus === 'idle' && (
                    <button className="action-link" onClick={() => setDeleteStatus('confirm')}>DELETE</button>
                  )}
                  {deleteStatus === 'confirm' && (
                    <div className="inline-confirm">
                      <span className="confirm-text">Are you sure?</span>
                      <button className="action-link" onClick={() => {
                        setDeleteStatus('deleting');
                        setTimeout(() => closeDetail(), 800);
                      }}>YES</button>
                      <button className="action-link" onClick={() => setDeleteStatus('idle')}>NO</button>
                    </div>
                  )}
                  {deleteStatus === 'deleting' && (
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                      REMOVING...
                    </span>
                  )}
                  
                  <button 
                    className="torrent-btn" 
                    onClick={() => {
                      if (torrentStatus === 'idle' || torrentStatus === 'error') {
                        fetchTorrents(selectedMovie);
                      }
                    }}
                  >
                    GET TORRENT
                  </button>
                </div>

                {torrentStatus !== 'idle' && (
                  <div className="view-transition" style={{ marginBottom: '3rem', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.15em', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                      MAGNET LINKS
                    </h3>
                    
                    {torrentStatus === 'loading' && <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>Searching the high seas...</span>}
                    {torrentStatus === 'error' && <span style={{ color: '#ff3366', fontSize: '0.85rem' }}>Failed to reach the indexer. Please try again.</span>}
                    {torrentStatus === 'none' && <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>No torrents found for this title.</span>}
                    
                    {torrentStatus === 'success' && availableTorrents.length > 0 && (
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {availableTorrents.map((t, i) => (
                          <button 
                            key={i} 
                            className="quality-btn"
                            onClick={() => {
                              window.location.href = getMagnetLink(t.hash, selectedMovie.title);
                            }}
                          >
                            <span>{t.quality} {t.type}</span>
                            <span className="quality-size">{t.size} • {t.seeds} seeds</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}


                
                {/* Review Section */}
                <div style={{ marginBottom: '4rem', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                    <StarRating 
                      rating={reviews.find(r => r.movieId === selectedMovie.id)?.rating || 0} 
                      interactive={false} 
                    />
                    <HeartButton 
                      liked={reviews.find(r => r.movieId === selectedMovie.id)?.liked || false} 
                      interactive={true}
                      setLiked={(val) => {
                        const existing = reviews.find(r => r.movieId === selectedMovie.id);
                        if (existing) {
                          setReviews(reviews.map(r => r.movieId === selectedMovie.id ? { ...r, liked: val } : r));
                        } else {
                          setReviews([...reviews, { movieId: selectedMovie.id, movie: selectedMovie, rating: 0, text: '', liked: val, date: new Date().toISOString().split('T')[0], createdAt: Date.now() }]);
                        }
                      }}
                    />
                    <button 
                      className="action-link"
                      onClick={() => {
                        const existing = reviews.find(r => r.movieId === selectedMovie.id);
                        if (existing) {
                          setEditingReview({ rating: existing.rating, text: existing.text, liked: existing.liked, date: existing.date });
                        } else {
                          setEditingReview({ rating: 0, text: '', liked: false, date: new Date().toISOString().split('T')[0] });
                        }
                        setShowReviewForm(!showReviewForm);
                      }}
                    >
                      {reviews.find(r => r.movieId === selectedMovie.id) ? 'EDIT REVIEW' : 'LOG OR REVIEW'}
                    </button>
                  </div>
                  
                  {showReviewForm && (
                    <div className="review-form view-transition">
                      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div>
                          <label className="form-label">Date Watched</label>
                          <input 
                            type="date" 
                            className="form-input" 
                            style={{ fontSize: '1rem', fontFamily: 'var(--font-sans)' }}
                            value={editingReview.date}
                            onChange={(e) => setEditingReview({...editingReview, date: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="form-label">Rating</label>
                          <StarRating 
                            rating={editingReview.rating} 
                            setRating={(val) => setEditingReview({...editingReview, rating: val})}
                            interactive={true} 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="form-label">Review</label>
                        <textarea 
                          className="form-input" 
                          placeholder="Write your review here..."
                          value={editingReview.text}
                          onChange={(e) => setEditingReview({...editingReview, text: e.target.value})}
                        />
                      </div>
                      
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                          className="publish-btn"
                          onClick={() => {
                            const existing = reviews.find(r => r.movieId === selectedMovie.id);
                            if (existing) {
                              setReviews(reviews.map(r => r.movieId === selectedMovie.id ? { ...existing, ...editingReview } : r));
                            } else {
                              setReviews([...reviews, { movieId: selectedMovie.id, movie: selectedMovie, ...editingReview, createdAt: Date.now() }]);
                            }
                            setShowReviewForm(false);
                          }}
                        >
                          SAVE
                        </button>
                        <button 
                          className="publish-btn" 
                          style={{ color: 'var(--text-secondary)' }}
                          onClick={() => setShowReviewForm(false)}
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {!showReviewForm && reviews.find(r => r.movieId === selectedMovie.id) && reviews.find(r => r.movieId === selectedMovie.id).text && (
                    <div className="view-transition" style={{ marginTop: '2rem', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                      "{reviews.find(r => r.movieId === selectedMovie.id).text}"
                    </div>
                  )}
                </div>


                <div className="rating-container">
                  <span className="rating-label">Metacritic Score</span>
                  <div className="rating-bar-wrapper">
                    <div className="rating-bar-bg">
                      <div className="rating-bar" style={{ width: showRating ? `${selectedMovie.rating}%` : '0%' }}></div>
                    </div>
                    <span className="rating-number">{selectedMovie.rating}</span>
                  </div>
                </div>

                <div className="tech-data" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginTop: '2rem', borderTop: '1px solid rgba(138,138,138,0.2)', paddingTop: '2rem' }}>
                  <div>
                    <div style={{ marginBottom: '1rem' }}><strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem', fontSize: '0.65rem', letterSpacing: '0.1em' }}>CAST</strong>{selectedMovie.actors}</div>
                    <div><strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem', fontSize: '0.65rem', letterSpacing: '0.1em' }}>RUNTIME</strong>{selectedMovie.runtime}</div>
                  </div>
                  <div>
                    <div style={{ marginBottom: '1rem' }}><strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem', fontSize: '0.65rem', letterSpacing: '0.1em' }}>BOX OFFICE</strong>{selectedMovie.boxOffice}</div>
                    <div><strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem', fontSize: '0.65rem', letterSpacing: '0.1em' }}>AWARDS</strong>{selectedMovie.awards}</div>
                  </div>
                </div>

                {recommendations.length > 0 && (
                  <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.15em', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                      YOU MIGHT ALSO LIKE
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                      {recommendations.map(rec => (
                        <div
                          key={rec.id}
                          style={{ cursor: 'pointer', position: 'relative' }}
                          onClick={() => {
                            closeDetail();
                            setTimeout(() => openDetail(rec), 650);
                          }}
                          className="movie-item"
                        >
                          <div className="movie-image-container">
                            <SmartPoster movie={rec} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <MediaModal media={previewMedia} onClose={() => setPreviewMedia(null)} />
    </>
  );
}
