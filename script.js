// --- App Initialization & Theme Handling ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupEventListeners();
});

const themeToggleBtn = document.getElementById('theme-toggle');
const rootElement = document.documentElement;

function initTheme() {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    }
}

function setTheme(theme) {
    if (theme === 'dark') {
        rootElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        rootElement.removeAttribute('data-theme');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
}

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = rootElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

function setupEventListeners() {
    document.getElementById('btn-dog').addEventListener('click', fetchDog);
    document.getElementById('btn-cat').addEventListener('click', fetchCat);
    document.getElementById('btn-bike').addEventListener('click', fetchBike);
    document.getElementById('btn-user').addEventListener('click', fetchUser);
    document.getElementById('btn-posts').addEventListener('click', fetchPosts);
    document.getElementById('btn-advice').addEventListener('click', fetchAdvice);
    document.getElementById('btn-activity').addEventListener('click', fetchActivity);
    
    // Copy events
    document.getElementById('btn-dog-copy').addEventListener('click', () => handleCopy('dog-img', 'Dog image URL copied!'));
    document.getElementById('btn-cat-copy').addEventListener('click', () => handleCopy('cat-img', 'Cat image URL copied!'));
    document.getElementById('btn-bike-copy').addEventListener('click', () => handleCopy('bike-img', 'Bike image URL copied!'));
}

// --- Cross-Component Utility Functions ---

const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 
        '<i class="fa-solid fa-check-circle" style="color: var(--success)"></i>' : 
        '<i class="fa-solid fa-circle-exclamation" style="color: var(--error)"></i>';
        
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
};

const copyToClipboard = async (text, successMsg) => {
    try {
        await navigator.clipboard.writeText(text);
        showToast(successMsg);
    } catch (err) {
        showToast('Failed to copy to clipboard', 'error');
    }
};

const handleCopy = (imgId, successMsg) => {
    const imgElement = document.getElementById(imgId);
    // Ignore if not fetched yet
    if (!imgElement.src || imgElement.classList.contains('hidden')) {
        showToast('Please fetch an image first!', 'error');
        return;
    }
    copyToClipboard(imgElement.src, successMsg);
};

const toggleLoadingMode = (cardId, isLoading) => {
    const loader = document.getElementById(`${cardId}-loader`) || document.querySelector(`#${cardId}-media .loader`);
    const content = document.getElementById(`${cardId}-content`) || document.querySelector(`#${cardId}-media img`);
    const placeholder = document.querySelector(`#${cardId}-media .placeholder`);
    const errorMsg = document.getElementById(`${cardId}-error`);

    if (errorMsg) errorMsg.classList.add('hidden');

    if (isLoading) {
        if (loader) loader.classList.remove('hidden');
        if (content && !content.src) content.classList.add('hidden'); // keep previous image while fetching
        if (placeholder) placeholder.classList.add('hidden');
    } else {
        if (loader) loader.classList.add('hidden');
        if (content) content.classList.remove('hidden');
    }
};

const triggerError = (cardId, message) => {
    const errorEl = document.getElementById(`${cardId}-error`);
    toggleLoadingMode(cardId, false);
    
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        setTimeout(() => errorEl.classList.add('hidden'), 4000);
    }
};

// --- API Integrations ---

// 1. Dog Finder
const fetchDog = async () => {
    toggleLoadingMode('dog', true);
    
    // Hide previous image while new one loads to feel snappy
    document.getElementById('dog-img').classList.add('hidden');
    
    try {
        const res = await fetch('https://dog.ceo/api/breeds/image/random');
        if (!res.ok) throw new Error('Failed to fetch dog');
        const data = await res.json();
        
        const img = document.getElementById('dog-img');
        
        // Wait for image blob to download completely before displaying
        img.onload = () => {
            toggleLoadingMode('dog', false);
        };
        img.onerror = () => { throw new Error('Dog image failed to load'); };
        
        img.src = data.message;
        
        // Ex: https://images.dog.ceo/breeds/hound-afghan/n02089867_3111.jpg
        const match = data.message.match(/breeds\/(.*?)\//);
        let breedName = match ? match[1].replace('-', ' ') : 'Unknown Breed';
        document.getElementById('dog-breed').textContent = breedName;

    } catch (err) {
        triggerError('dog', err.message || 'Error occurred while fetching.');
    }
};

// 2. Cat Finder
const fetchCat = async () => {
    toggleLoadingMode('cat', true);
    document.getElementById('cat-img').classList.add('hidden');
    
    try {
        const res = await fetch('https://api.thecatapi.com/v1/images/search');
        if (!res.ok) throw new Error('Failed to fetch cat');
        const data = await res.json();
        
        const img = document.getElementById('cat-img');
        
        img.onload = () => {
            toggleLoadingMode('cat', false);
        };
        img.onerror = () => { throw new Error('Cat image failed to load'); };
        
        img.src = data[0].url;
    } catch (err) {
        triggerError('cat', err.message || 'Error occurred while fetching.');
    }
};

// 3. Bike Finder (Pexels / Open Fallback)
const PEXELS_KEY = 'INSERT_YOUR_PEXELS_API_KEY_HERE'; // Replace with a real Pexels key if you have one!

const fetchBike = async () => {
    toggleLoadingMode('bike', true);
    document.getElementById('bike-img').classList.add('hidden');
    
    try {
        let imageUrl = '';
        let photographerName = '';

        // If user hasn't added a key, smoothly fall back to a curated list of stunning bike photos!
        if (PEXELS_KEY === 'INSERT_YOUR_PEXELS_API_KEY_HERE') {
            const fallbackBikes = [
                { url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80", name: "Harley-Davidson" },
                { url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80", name: "Royal Enfield" },
                { url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80", name: "Ducati Panigale" },
                { url: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80", name: "Cafe Racer" },
                { url: "https://images.unsplash.com/photo-1595861180801-6c4ca8c5af73?w=800&q=80", name: "BMW Motorrad" }
            ];
            
            // Artificial delay to simulate network request since it's local
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const randomBike = fallbackBikes[Math.floor(Math.random() * fallbackBikes.length)];
            imageUrl = randomBike.url;
            photographerName = randomBike.name + " (Unsplash)";
            
        } else {
            // Standard Pexels Flow
            const res = await fetch('https://api.pexels.com/v1/search?query=motorcycle', {
                headers: { Authorization: PEXELS_KEY }
            });
            
            if (res.status === 401) throw new Error('Invalid Pexels API Key');
            if (!res.ok) throw new Error('Failed to fetch bike');
            
            const data = await res.json();
            const photos = data.photos;
            
            if (!photos || photos.length === 0) throw new Error('No bikes found');
            const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
            
            imageUrl = randomPhoto.src.medium;
            photographerName = randomPhoto.photographer;
        }

        const img = document.getElementById('bike-img');
        
        img.onload = () => {
            toggleLoadingMode('bike', false);
        };
        img.onerror = () => { throw new Error('Bike image failed to load'); };
        
        img.src = imageUrl; 
        document.getElementById('bike-photographer').textContent = photographerName;
        
    } catch (err) {
        triggerError('bike', err.message);
    }
};

// 4. Random User Profile
const fetchUser = async () => {
    toggleLoadingMode('user', true);
    
    try {
        const res = await fetch('https://randomuser.me/api/');
        if (!res.ok) throw new Error('Failed to fetch user data');
        const data = await res.json();
        const user = data.results[0];
        
        const avatar = document.getElementById('user-avatar');
        avatar.onload = () => toggleLoadingMode('user', false);
        avatar.onerror = () => toggleLoadingMode('user', false);
        
        avatar.src = user.picture.large;
        document.getElementById('user-name').textContent = `${user.name.first} ${user.name.last}`;
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('user-country').textContent = user.location.country;
        document.getElementById('user-age').textContent = `Age: ${user.dob.age} (${user.cell})`;
        
    } catch (err) {
        triggerError('user', err.message);
    }
};

// 5. Posts Explorer
const fetchPosts = async () => {
    toggleLoadingMode('posts', true);
    
    try {
        // limit to 5 to keep the UI clean
        const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        
        const list = document.getElementById('posts-list');
        list.innerHTML = ''; // reset content
        
        data.forEach((post, index) => {
            const li = document.createElement('li');
            li.style.animationDelay = `${index * 0.08}s`; // Staggered animation
            li.innerHTML = `
                <h4>${post.title}</h4>
                <p>${document.documentElement.getAttribute('data-theme') === 'dark' ? post.body.replace(/\n/g, '<br>') : post.body}</p>
            `;
            list.appendChild(li);
        });
        
        toggleLoadingMode('posts', false);
    } catch (err) {
        triggerError('posts', err.message);
    }
};

// 6. Advice Generator
const fetchAdvice = async () => {
    toggleLoadingMode('advice', true);
    document.querySelector('#advice-content .quote').textContent = '';
    
    try {
        // Cache bypass trick required for advice API (caches heavily otherwise)
        const res = await fetch(`https://api.adviceslip.com/advice?t=${Date.now()}`);
        if (!res.ok) throw new Error('Failed to fetch advice');
        const data = await res.json();
        
        document.querySelector('#advice-content .quote').textContent = `"${data.slip.advice}"`;
        toggleLoadingMode('advice', false);
    } catch (err) {
        triggerError('advice', err.message);
    }
};

// 7. Activity Suggestion
const fetchActivity = async () => {
    toggleLoadingMode('activity', true);
    
    try {
        // Note: The official boredapi.com is frequently offline in 2024+. 
        // Attempting to fetch from appbrewery fallback, and if that fails, use structured fallbacks.
        const res = await fetch('https://bored-api.appbrewery.com/random').catch(() => null);
        
        let data;
        if (res && res.ok) {
            data = await res.json();
        } else {
            console.info("Using fallback mock data for Activity since API was blocked/down");
            const fallbacks = [
                { activity: "Learn a new programming language", type: "education", participants: 1, accessibility: 0.25 },
                { activity: "Host a board game night", type: "social", participants: 4, accessibility: 0.8 },
                { activity: "Go for a walk exploring a new park", type: "recreational", participants: 1, accessibility: 0.9 },
                { activity: "Try a new recipe from a cookbook", type: "cooking", participants: 2, accessibility: 0.6 },
                { activity: "Start a small DIY project", type: "diy", participants: 1, accessibility: 0.4 }
            ];
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 600)); 
            data = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        }
        
        document.getElementById('act-name').textContent = data.activity;
        document.getElementById('act-type').textContent = data.type;
        document.getElementById('act-participants').textContent = data.participants;
        
        // Format difficulty dynamically
        let difficultyStr = "Easy";
        if (data.accessibility <= 0.3) difficultyStr = "Hard";
        else if (data.accessibility <= 0.7) difficultyStr = "Medium";
        document.getElementById('act-difficulty').textContent = difficultyStr;
        
        toggleLoadingMode('activity', false);
    } catch (err) {
        triggerError('activity', 'Could not load activity. Try again.');
    }
};
