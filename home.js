// ============================================
// 🔒 ANEZWORLD - SECURE PASSWORD GATE 🔒
// ============================================

// SHA-256 hash verification
// The correct answer is: Cheeks (converted to lowercase for comparison)
const CORRECT_HASH = "e7adc837a3baffa82e0033f709339397c5dd2ef9b040fb2f124987c69572fce7";

// Password gate functionality
window.addEventListener('DOMContentLoaded', () => {
    // Check if user navigated from another page (like valentine.html)
    const navigatedFromPage = sessionStorage.getItem('navigatedFromValentine');

    if (navigatedFromPage === 'true') {
        // Clear navigation flag (one-time use)
        sessionStorage.removeItem('navigatedFromValentine');

        // Skip password gate and show content
        const passwordGate = document.getElementById('passwordGate');
        const mainContent = document.getElementById('mainContent');

        passwordGate.style.display = 'none';
        mainContent.classList.remove('hidden');
        renderArchive();
        initMusicPlayer();
        initSortDropdown();
        initEasterEggs();
    } else {
        // Show password gate
        initPasswordGate();
    }
});

async function initPasswordGate() {
    const passwordInput = document.getElementById('passwordInput');
    const submitButton = document.getElementById('submitPassword');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const passwordGate = document.getElementById('passwordGate');
    const mainContent = document.getElementById('mainContent');

    // Submit on button click
    submitButton.addEventListener('click', () => checkPassword());

    // Submit on Enter key
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });

    async function checkPassword() {
        const input = passwordInput.value.trim().toLowerCase();

        if (!input) {
            showError();
            return;
        }

        // Hash the input
        const hash = await sha256(input);

        // Compare with correct hash
        if (hash === CORRECT_HASH) {
            // Correct answer!
            errorMessage.classList.add('hidden');
            successMessage.classList.remove('hidden');
            passwordInput.disabled = true;
            submitButton.disabled = true;

            // Wait 1.5 seconds to show the hedgehog, then unlock
            setTimeout(() => {
                unlockContent();
            }, 1500);
        } else {
            // Incorrect answer
            showError();
            passwordInput.value = '';
            passwordInput.focus();
        }
    }

    function showError() {
        errorMessage.classList.remove('hidden');
        successMessage.classList.add('hidden');
        passwordInput.classList.add('error-shake');
        setTimeout(() => {
            passwordInput.classList.remove('error-shake');
        }, 500);
    }

    function unlockContent() {
        passwordGate.classList.add('fade-out');
        setTimeout(() => {
            passwordGate.style.display = 'none';
            mainContent.classList.remove('hidden');
            mainContent.classList.add('fade-in');
            // Initialize archive after unlocking
            renderArchive();
            // Initialize music player
            initMusicPlayer();
            // Initialize sort dropdown
            initSortDropdown();
            // Initialize easter eggs
            initEasterEggs();
        }, 600);
    }
}

// SHA-256 hashing function using Web Crypto API
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// ============================================
// 📚 ARCHIVE COLLECTIONS RENDERING 📚
// ============================================

let currentSort = 'date-asc'; // Default sort

function renderArchive(sortBy = currentSort) {
    const archiveGrid = document.getElementById('archiveGrid');

    if (!archiveGrid) return;

    // Clear existing content
    archiveGrid.innerHTML = '';

    // Get all collections from DATA
    let collections = [...(DATA.collections || [])];

    if (collections.length === 0) {
        archiveGrid.innerHTML = '<p class="empty-state">No collections yet. Your memories will appear here.</p>';
        return;
    }

    // Sort collections
    collections = sortCollections(collections, sortBy);

    // Render each collection as a card
    collections.forEach((collection, index) => {
        const card = createCollectionCard(collection, index);
        archiveGrid.appendChild(card);
    });

    // Initialize scroll animations
    initScrollAnimations();
}

function sortCollections(collections, sortBy) {
    const sorted = [...collections];

    switch (sortBy) {
        case 'date-desc':
            return sorted.sort((a, b) => {
                if (!a.date) return 1;
                if (!b.date) return -1;
                return new Date(b.date) - new Date(a.date);
            });

        case 'date-asc':
            return sorted.sort((a, b) => {
                if (!a.date) return 1;
                if (!b.date) return -1;
                return new Date(a.date) - new Date(b.date);
            });

        case 'occasion':
            const categoryOrder = { 'birthdays': 1, 'special-days': 2, 'adventure-days': 3 };
            return sorted.sort((a, b) => {
                const orderA = categoryOrder[a.category] || 999;
                const orderB = categoryOrder[b.category] || 999;
                return orderA - orderB;
            });

        default:
            return sorted;
    }
}

// Sort dropdown handler
function initSortDropdown() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderArchive(currentSort);
    });
}

function createCollectionCard(collection, index) {
    const card = document.createElement('div');
    card.className = 'collection-card';
    card.style.animationDelay = `${index * 0.1}s`;

    // Add placeholder class if it's a coming soon card
    if (collection.isPlaceholder) {
        card.classList.add('placeholder');
    }

    // Get category label
    const categoryLabel = collection.category ? collection.category.replace('-', ' ') : '';

    // Create card content
    card.innerHTML = `
        ${collection.icon ? `<div class="card-icon">${collection.icon}</div>` : ''}
        <div class="card-header">
            <h3 class="card-title">${collection.title}</h3>
            ${collection.category ? `<span class="category-badge">${categoryLabel}</span>` : ''}
        </div>
        <p class="card-description">${collection.description || ''}</p>
        ${collection.date ? `<p class="card-date">${formatDate(collection.date)}</p>` : ''}
        ${collection.items ? `<p class="card-count">${collection.items.length} ${collection.items.length === 1 ? 'item' : 'items'}</p>` : ''}
    `;

    // Add click handler if there's a link (not for placeholder cards)
    if (collection.link && !collection.isPlaceholder) {
        card.classList.add('clickable');
        card.addEventListener('click', () => {
            window.location.href = collection.link;
        });
    }

    // Add hover effect
    card.addEventListener('mouseenter', () => {
        card.classList.add('hover');
    });

    card.addEventListener('mouseleave', () => {
        card.classList.remove('hover');
    });

    return card;
}

// Helper function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ============================================
// 🎵 MUSIC PLAYER & PLAYLIST DROPDOWN 🎵
// ============================================

let currentSongIndex = 0;
let isPlaying = false;
let allSongs = [];
let bgMusicPlayer = null;
let currentVolume = 0.5; // Store volume persistently

function initMusicPlayer() {
    console.log("🎵 Initializing music player...");

    const musicToggle = document.getElementById('musicToggle');
    const playlistDropdown = document.getElementById('playlistDropdown');
    bgMusicPlayer = document.getElementById('bgMusic');
    const playlist = document.getElementById('playlist');

    // Dropdown controls
    const playPauseBtnDropdown = document.getElementById('playPauseBtnDropdown');
    const prevBtnDropdown = document.getElementById('prevBtnDropdown');
    const nextBtnDropdown = document.getElementById('nextBtnDropdown');
    const volumeSlider = document.getElementById('volumeSlider');

    console.log("Elements found:", {
        musicToggle: !!musicToggle,
        playlistDropdown: !!playlistDropdown,
        bgMusicPlayer: !!bgMusicPlayer,
        playlist: !!playlist,
        volumeSlider: !!volumeSlider
    });

    if (!musicToggle || !playlistDropdown || !bgMusicPlayer || !playlist) {
        console.error("Missing required elements for music player");
        return;
    }

    allSongs = Array.from(playlist.querySelectorAll('.song'));
    console.log(`Found ${allSongs.length} songs`);

    if (allSongs.length === 0) {
        console.error("No songs found in playlist");
        return;
    }

    // Restore saved state if exists
    const savedIndex = sessionStorage.getItem('currentSongIndex');
    const savedTime = sessionStorage.getItem('currentSongTime');
    if (savedIndex !== null) {
        currentSongIndex = parseInt(savedIndex);
        console.log(`Restoring song ${currentSongIndex + 1} at ${savedTime}s`);
    }

    // Playlist dropdown toggle
    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        playlistDropdown.classList.toggle('hidden');
        musicToggle.classList.toggle('active');
        console.log("Playlist toggled");
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!musicToggle.contains(e.target) && !playlistDropdown.contains(e.target)) {
            playlistDropdown.classList.add('hidden');
            musicToggle.classList.remove('active');
        }
    });

    // Function to update UI
    function updateUI() {
        allSongs.forEach(s => s.classList.remove('playing'));
        if (isPlaying) {
            allSongs[currentSongIndex].classList.add('playing');
            playlistDropdown.classList.add('playing');
        } else {
            playlistDropdown.classList.remove('playing');
        }
    }

    // Function to load and play song
    function loadSong(index, shouldPlay = true, resumeTime = null) {
        if (index < 0 || index >= allSongs.length) return;

        currentSongIndex = index;
        const songSrc = allSongs[index].getAttribute('data-src');

        console.log(`Loading song ${index + 1}: ${songSrc}`);

        // Only change src if it's a different song
        if (bgMusicPlayer.src !== songSrc && !bgMusicPlayer.src.includes(songSrc)) {
            bgMusicPlayer.src = songSrc;
            bgMusicPlayer.volume = currentVolume; // Use persistent volume
            bgMusicPlayer.load();
        }

        // Resume from saved time if provided
        if (resumeTime !== null && resumeTime > 0) {
            bgMusicPlayer.currentTime = parseFloat(resumeTime);
        }

        if (shouldPlay) {
            bgMusicPlayer.play().then(() => {
                console.log("Song playing");
                isPlaying = true;
                updateUI();
            }).catch(err => {
                console.error("Playback failed:", err);
            });
        }

        // Save state
        sessionStorage.setItem('currentSongIndex', currentSongIndex);
    }

    // Function to toggle play/pause
    function togglePlayPause() {
        if (isPlaying) {
            console.log("Pausing");
            bgMusicPlayer.pause();
            isPlaying = false;
        } else {
            console.log("Resuming");
            bgMusicPlayer.play().then(() => {
                isPlaying = true;
                updateUI();
            }).catch(err => {
                console.error("Resume failed:", err);
            });
        }
        updateUI();
    }

    // Function to play next song
    function playNext() {
        const nextIndex = (currentSongIndex + 1) % allSongs.length;
        console.log(`Next: ${nextIndex + 1}`);
        loadSong(nextIndex, true);
    }

    // Function to play previous song
    function playPrevious() {
        const prevIndex = currentSongIndex - 1 < 0 ? allSongs.length - 1 : currentSongIndex - 1;
        console.log(`Previous: ${prevIndex + 1}`);
        loadSong(prevIndex, true);
    }

    // Setup playlist click handlers
    allSongs.forEach((song, index) => {
        const playBtn = song.querySelector('.play-btn');
        const songSrc = song.getAttribute('data-src');

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log(`Play button clicked for song ${index + 1}`);

            if (currentSongIndex === index && isPlaying) {
                // Pause current song
                togglePlayPause();
            } else if (currentSongIndex === index && !isPlaying) {
                // Resume current song
                togglePlayPause();
            } else {
                // Play different song
                loadSong(index, true);
            }
        });

        // Click anywhere on song row
        song.addEventListener('click', (e) => {
            if (!e.target.closest('.play-btn')) {
                playBtn.click();
            }
        });
    });

    // Dropdown controls event listeners
    if (playPauseBtnDropdown) playPauseBtnDropdown.addEventListener('click', togglePlayPause);
    if (nextBtnDropdown) nextBtnDropdown.addEventListener('click', playNext);
    if (prevBtnDropdown) prevBtnDropdown.addEventListener('click', playPrevious);

    // Volume slider event listener
    if (volumeSlider) {
        // Set initial slider value to match current volume
        volumeSlider.value = currentVolume * 100;

        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            currentVolume = volume; // Update persistent volume
            bgMusicPlayer.volume = volume;
            console.log(`Volume set to ${e.target.value}%`);
        });
    }

    // When song ends, play next (loop playlist)
    bgMusicPlayer.addEventListener('ended', () => {
        console.log("Song ended, playing next");
        playNext();
    });

    // Save playback time periodically
    bgMusicPlayer.addEventListener('timeupdate', () => {
        if (isPlaying) {
            sessionStorage.setItem('currentSongTime', bgMusicPlayer.currentTime);
        }
    });

    // Save state before leaving page
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('currentSongIndex', currentSongIndex);
        sessionStorage.setItem('currentSongTime', bgMusicPlayer.currentTime);
        sessionStorage.setItem('wasPlaying', isPlaying);
    });

    // AUTO-PLAY OR RESTORE
    console.log("🎵 Attempting to start music...");

    const wasPlaying = sessionStorage.getItem('wasPlaying') === 'true';
    const resumeTime = savedTime ? parseFloat(savedTime) : 0;

    if (savedIndex !== null && wasPlaying) {
        // Restore previous state
        console.log(`Restoring playback from song ${currentSongIndex + 1} at ${resumeTime}s`);
        loadSong(currentSongIndex, true, resumeTime);
    } else {
        // Start fresh with first song
        loadSong(0, true);
    }

    // Fallback if autoplay blocked
    const startOnInteraction = () => {
        if (!isPlaying && bgMusicPlayer.paused) {
            console.log("User interaction detected, starting music...");
            bgMusicPlayer.play().then(() => {
                console.log("✅ Music started!");
                isPlaying = true;
                updateUI();
            }).catch(err => {
                console.error("Failed to play:", err);
            });
        }
    };

    document.addEventListener('click', startOnInteraction, { once: true });
    document.addEventListener('keydown', startOnInteraction, { once: true });

    console.log("✅ Music player initialized");
}

// ============================================
// 📜 SCROLL ANIMATIONS 📜
// ============================================

function initScrollAnimations() {
    const cards = document.querySelectorAll('.collection-card');

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class when card comes into view
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all cards
    cards.forEach(card => {
        observer.observe(card);
    });
}

// ============================================
// 🎨 EASTER EGG DOODLES 🎨
// ============================================

function initEasterEggs() {
    console.log("🎨 Initializing easter eggs...");

    const starDoodle = document.getElementById('starDoodle');
    const starMessage = document.getElementById('starMessage');

    const valentineDoodle = document.getElementById('valentineDoodle');
    const valentineAudio = document.getElementById('valentineAudio');

    // Star Doodle - Hover to show message (link remains clickable)
    if (starDoodle && starMessage) {
        let hideTimeout = null;

        starDoodle.addEventListener('mouseenter', () => {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            starMessage.classList.remove('hidden');
            starMessage.classList.add('visible');
        });

        starDoodle.addEventListener('mouseleave', () => {
            // Delay hiding to give user time to click link
            hideTimeout = setTimeout(() => {
                starMessage.classList.remove('visible');
                setTimeout(() => {
                    starMessage.classList.add('hidden');
                }, 300);
            }, 1000); // 1 second delay before starting to hide
        });

        // Keep message visible when hovering over the message itself
        starMessage.addEventListener('mouseenter', () => {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
        });

        starMessage.addEventListener('mouseleave', () => {
            starMessage.classList.remove('visible');
            setTimeout(() => {
                starMessage.classList.add('hidden');
            }, 300);
        });
    }

    // Valentine Doodle - Hover to play sound bite (loop) and pause music
    if (valentineDoodle && valentineAudio) {
        let wasMusicPlaying = false;

        // Play on hover
        valentineDoodle.addEventListener('mouseenter', () => {
            console.log("💝 Playing valentine sound bite");

            // Pause music if playing
            if (bgMusicPlayer && !bgMusicPlayer.paused) {
                wasMusicPlaying = true;
                bgMusicPlayer.pause();
                console.log("⏸️ Paused music for soundbite");
            }

            // Play soundbite on loop
            valentineAudio.loop = true;
            valentineAudio.volume = 0.8;
            valentineAudio.currentTime = 0;
            valentineAudio.play().catch(err => {
                console.error("Failed to play valentine audio:", err);
            });
        });

        // Stop on hover out
        valentineDoodle.addEventListener('mouseleave', () => {
            console.log("💝 Stopping valentine sound bite");
            valentineAudio.pause();
            valentineAudio.currentTime = 0;
            valentineAudio.loop = false;

            // Resume music if it was playing
            if (wasMusicPlaying && bgMusicPlayer) {
                bgMusicPlayer.play().catch(err => {
                    console.error("Failed to resume music:", err);
                });
                wasMusicPlaying = false;
                console.log("▶️ Resumed music");
            }
        });
    }

    console.log("✅ Easter eggs initialized");
}
