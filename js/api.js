import { showSkeletonLoaders, hideSkeletonLoaders, showDetailLoading, showError } from './utils.js';

// Global variables
let allCountries = [];
let filteredCountries = [];

// API functions
export async function fetchCountries() {
    try {
        showSkeletonLoaders(true);
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,borders,population,region,capital,cca3');
        
        if (!response.ok) {
            throw new Error(` status: ${response.status}`);
        }
        
        const data = await response.json();
        allCountries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        filteredCountries = [...allCountries];
        
        hideSkeletonLoaders();
        return { allCountries, filteredCountries };
    } catch (error) {
        console.error('Error fetching countries:', error);
        hideSkeletonLoaders();
        showError(' Please try again.');
        throw error;
    }
}

export async function fetchCountryDetails(countryCode) {
    try {
        showDetailLoading(true);
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        const data = await response.json();
        showDetailLoading(false);
        return data[0];
    } catch (error) {
        console.error('Error:', error);
        showDetailLoading(false);
        throw error;
    }
}

export function getAllCountries() {
    return allCountries;
}

export function getFilteredCountries() {
    return filteredCountries;
}

export function setAllCountries(countries) {
    allCountries = countries;
}

export function setFilteredCountries(countries) {
    filteredCountries = countries;
}