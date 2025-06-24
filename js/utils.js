import {
    detailLoading,
    countryDetailContent,
    countriesGrid,
    noResults,
    countriesListView,
    countryDetailView,
    themeIcon,
    themeText
} from './html-elements.js';
import { getAllCountries } from './api.js';

export function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

export function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = 'Light Mode';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeText.textContent = 'Dark Mode';
    }
}

export function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

export function showListView() {
    countriesListView.classList.remove('hidden');
    countryDetailView.classList.remove('slide-in');
    countryDetailView.classList.add('slide-out');
    
    setTimeout(() => {
        countryDetailView.classList.add('hidden');
        countryDetailView.classList.remove('slide-out');
    }, 300);
}

export function showDetailView() {
    countriesListView.classList.add('hidden');
    countryDetailView.classList.remove('hidden');
    countryDetailView.classList.add('slide-in');
    
    setTimeout(() => {
        countryDetailView.classList.remove('slide-in');
    }, 300);
}

export function showSkeletonLoaders(show = true) {
    if (show) {
        countriesGrid.innerHTML = '';
        // Create 12 skeleton cards
        for (let i = 0; i < 12; i++) {
            const skeletonCard = createSkeletonCard();
            countriesGrid.appendChild(skeletonCard);
        }
        showCountriesGrid(true);
        showNoResults(false);
    }
}

export function hideSkeletonLoaders() {
}

function createSkeletonCard() {
    const cardElement = document.createElement('div');
    cardElement.className = 'card bg-base-100 shadow-xl border border-base-300 skeleton-card';
    cardElement.innerHTML = `
        <figure class="px-0 pt-0">
            <div class="skeleton w-full h-40"></div>
        </figure>
        <div class="card-body px-6 py-6">
            <div class="skeleton h-6 w-3/4 mb-4"></div>
            <div class="space-y-2">
                <div class="skeleton h-4 w-full"></div>
                <div class="skeleton h-4 w-2/3"></div>
                <div class="skeleton h-4 w-4/5"></div>
            </div>
        </div>
    `;
    return cardElement;
}

export function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

export function showDetailLoading(show) {
    detailLoading.classList.toggle('hidden', !show);
    countryDetailContent.classList.toggle('hidden', show);
}

export function showCountriesGrid(show) {
    countriesGrid.classList.toggle('hidden', !show);
}

export function showNoResults(show) {
    noResults.classList.toggle('hidden', !show);
}

export function showError(message) {
    const currentView = getCurrentView();
    
    if (currentView === 'list') {
        countriesGrid.innerHTML = `
            <div class="col-span-full text-center py-20">
                <div class="text-6xl mb-4">⚠️</div>
                <h3 class="text-2xl font-bold mb-2">Oops! Something went wrong</h3>
                <p class="text-base-content/70 mb-4">${message}</p>
                <button onclick="window.appHandlers.retryFetch()" class="btn btn-primary">
                    <i class="fas fa-refresh mr-2"></i>
                    Try Again
                </button>
            </div>
        `;
        showCountriesGrid(true);
    } else {
        countryDetailContent.innerHTML = `
            <div class="col-span-full text-center py-20">
                <div class="text-6xl mb-4">⚠️</div>
                <h3 class="text-2xl font-bold mb-2">Oops! Something went wrong</h3>
                <p class="text-base-content/70">${message}</p>
            </div>
        `;
        showDetailLoading(false);
    }
}

export function renderCountryDetail(country) {
    const nativeNames = country.name.nativeName ? 
        Object.values(country.name.nativeName).map(name => name.common).join(', ') : 
        country.name.common;
    
    const currencies = country.currencies ? 
        Object.values(country.currencies).map(currency => currency.name).join(', ') : 
        'N/A';
    
    const languages = country.languages ? 
        Object.values(country.languages).join(', ') : 
        'N/A';
    
    const population = formatNumber(country.population);
    const capital = country.capital ? country.capital[0] : 'N/A';
    const subregion = country.subregion || 'N/A';
    const topLevelDomain = country.tld ? country.tld.join(', ') : 'N/A';
    const flagAlt = country.flags.alt || `Flag of ${country.name.common}`;
    
    countryDetailContent.innerHTML = `
        <!-- Flag Image -->
        <div class="w-full">
            <div class="aspect-[4/3] lg:aspect-[3/2] w-full overflow-hidden">
                <img 
                    src="${country.flags.svg || country.flags.png}" 
                    alt="${flagAlt}"
                    class="detail-flag-image"
                    onerror="this.src='https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Flag+Not+Available'"
                />
            </div>
        </div>
        
        <!-- Country Information -->
        <div class="w-full space-y-6">
            <h1 class="text-3xl lg:text-4xl font-bold">${country.name.common}</h1>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Left Column -->
                <div class="space-y-3">
                    <p class="text-sm lg:text-base">
                        <span class="font-semibold">Native Name:</span> 
                        <span class="text-base-content/80">${nativeNames}</span>
                    </p>
                    <p class="text-sm lg:text-base">
                        <span class="font-semibold">Population:</span> 
                        <span class="text-base-content/80">${population}</span>
                    </p>
                    <p class="text-sm lg:text-base">
                        <span class="font-semibold">Region:</span> 
                        <span class="text-base-content/80">${country.region}</span>
                    </p>
                    <p class="text-sm lg:text-base">
                        <span class="font-semibold">Sub Region:</span> 
                        <span class="text-base-content/80">${subregion}</span>
                    </p>
                    <p class="text-sm lg:text-base">
                        <span class="font-semibold">Capital:</span> 
                        <span class="text-base-content/80">${capital}</span>
                    </p>
                </div>
                
                <!-- Right Column -->
                <div class="space-y-3">
                    <p class="text-sm lg:text-base">
                        <span class="font-semibold">Top Level Domain:</span> 
                        <span class="text-base-content/80">${topLevelDomain}</span>
                    </p>
                    <p class="text-sm lg:text-base">
                        <span class="font-semibold">Currencies:</span> 
                        <span class="text-base-content/80">${currencies}</span>
                    </p>
                    <p class="text-sm lg:text-base">
                        <span class="font-semibold">Languages:</span> 
                        <span class="text-base-content/80">${languages}</span>
                    </p>
                </div>
            </div>
            
            ${country.borders && country.borders.length > 0 ? `
                <div class="pt-4">
                    <p class="text-sm lg:text-base font-semibold mb-4">Border Countries:</p>
                    <div class="flex flex-wrap gap-2">
                        ${country.borders.map(border => `
                            <button 
                                class="border-country-tag" 
                                onclick="window.appHandlers.showCountryDetail('${border}')"
                            >
                                ${getCountryNameByCode(border)}
                            </button>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

export function getCountryNameByCode(code) {
    const allCountries = getAllCountries();
    const country = allCountries.find(c => c.cca3 === code);
    return country ? country.name.common : code;
}

export function renderCountries(countries) {
    if (countries.length === 0) {
        showNoResults(true);
        showCountriesGrid(false);
        return;
    }
    
    showNoResults(false);
    showCountriesGrid(true);
    
    countriesGrid.innerHTML = countries.map(country => createCountryCard(country)).join('');
}

export function createCountryCard(country) {
    const population = formatNumber(country.population);
    const capital = country.capital ? country.capital[0] : 'N/A';
    const flagAlt = country.flags.alt || `Flag of ${country.name.common}`;
    
    return `
        <div class="card bg-base-100 shadow-xl country-card border border-base-300" onclick="window.appHandlers.showCountryDetail('${country.cca3}')">
            <figure class="px-0 pt-0">
                <img 
                    src="${country.flags.png}" 
                    alt="${flagAlt}"
                    class="flag-image"
                    loading="lazy"
                    onerror="this.src='https://via.placeholder.com/320x160/e5e7eb/9ca3af?text=Flag+Not+Available'"
                />
            </figure>
            <div class="card-body px-6 py-6">
                <h2 class="card-title text-lg font-bold mb-4">${country.name.common}</h2>
                <div class="space-y-1 text-sm">
                    <p><span class="font-semibold">Population:</span> ${population}</p>
                    <p><span class="font-semibold">Region:</span> ${country.region}</p>
                    <p><span class="font-semibold">Capital:</span> ${capital}</p>
                </div>
            </div>
        </div>
    `;
}
function getCurrentView() {
    return countriesListView.classList.contains('hidden') ? 'detail' : 'list';
}