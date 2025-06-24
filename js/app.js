import {
    themeToggle,
    searchInput,
    filterText,
    backButton
} from './html-elements.js';
import {
    fetchCountries,
    fetchCountryDetails,
    getAllCountries,
    getFilteredCountries,
    setAllCountries,
    setFilteredCountries
} from './api.js';
import {
    initializeTheme,
    toggleTheme,
    showListView,
    showDetailView,
    renderCountries,
    renderCountryDetail,
    showError
} from './utils.js';

let currentRegionFilter = '';
let currentSearchTerm = '';

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    setupEventListeners();
    initializeApp();
});

async function initializeApp() {
    try {
        const { allCountries, filteredCountries } = await fetchCountries();
        setAllCountries(allCountries);
        setFilteredCountries(filteredCountries);
        renderCountries(filteredCountries);
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
}

function setupEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);
    
    searchInput.addEventListener('input', function(e) {
        currentSearchTerm = e.target.value.toLowerCase().trim();
        filterCountries();
    });

    backButton.addEventListener('click', showListView);

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.activeElement.blur();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const currentView = document.getElementById('countries-list-view').classList.contains('hidden') ? 'detail' : 'list';
            if (currentView === 'detail') {
                showListView();
            } else {
                document.activeElement.blur();
            }
        }
        
        if (e.key === '/' && !e.target.matches('input')) {
            const currentView = document.getElementById('countries-list-view').classList.contains('hidden') ? 'detail' : 'list';
            if (currentView === 'list') {
                e.preventDefault();
                searchInput.focus();
            }
        }
    });
}

function filterByRegion(region) {
    currentRegionFilter = region;
    filterText.textContent = region || 'Filter by Region';
    
    // Close dropdown
    document.activeElement.blur();
    
    filterCountries();
}

function filterCountries() {
    const allCountries = getAllCountries();
    const filtered = allCountries.filter(country => {
        const matchesSearch = !currentSearchTerm || 
            country.name.common.toLowerCase().includes(currentSearchTerm);
        
        const matchesRegion = !currentRegionFilter || 
            country.region === currentRegionFilter;
        
        return matchesSearch && matchesRegion;
    });
    
    setFilteredCountries(filtered);
    renderCountries(filtered);
}

async function showCountryDetail(countryCode) {
    try {
        showDetailView();
        const country = await fetchCountryDetails(countryCode);
        renderCountryDetail(country);
    } catch (error) {
        showError('Please try again.');
        showListView();
    }
}
async function retryFetch() {
    try {
        const { allCountries, filteredCountries } = await fetchCountries();
        setAllCountries(allCountries);
        setFilteredCountries(filteredCountries);
        renderCountries(filteredCountries);
    } catch (error) {
        console.error('failed:', error);
    }
}
window.filterByRegion = filterByRegion;
window.appHandlers = {
    showCountryDetail,
    retryFetch
};