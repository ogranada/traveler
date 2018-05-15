/* globals */

import { startAnimation, stopAnimation } from './animation.js';
import { initMaps, createMarker, getMapInstance, updateMarkersCluster, cleanMarkers } from './map_utils.js';
import foursquare from './foursquare_helper.js';

/**
 * Execute a method on dom content loaded.
 * @param {Function} fn callback to be executed on ready event.
 */
function ready(fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

/**
 * Execute a fallback action to get an aproximate location
 */
function loadFallbackGeolocation() {
  document.querySelector('.Content').innerHTML = `
  <div class="Fallback">
    <p class="Fallback-aww">:(</p>
    <p class="Fallback-message">Your GPS is disabled. Please enable it.</p>
  </div>
  `;
}

/**
 * Ask user for geolocation permissions and enable geolocation.
 */
function askForGeolocation() {
  const options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000
  };
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    } else {
      reject(new Error('Geolocation API is not supported.'));
    }
  });
}

/**
 * Prepare information to add a marker to map
 * @param {Object} data 
 */
function addPlaceToMap(data) {
  const position = data.venue.location;
  const name = data.venue.name;
  const category = data.venue.categories[0];
  createMarker(getMapInstance(), position, name, category);
  updateMarkersCluster();
}

/**
 * Load Categories used by foursquare
 */
async function loadCategories() {
  const categorySelector = document.querySelector('.Category-selector');
  const categories = await foursquare.getCategories();
  if (categorySelector) {
    categories.response.categories.map(category => {
      const opt = document.createElement('option');
      opt.text = category.name;
      opt.name = category.name;
      categorySelector.appendChild(opt);
    });
  }
}

/**
 * Initialize initial application values and configurations
 */
async function initializeApplication() {
  try {
    const position = await askForGeolocation();
    const current_location = { lat: position.coords.latitude, lng: position.coords.longitude };
    initMaps(current_location);
    stopAnimation();
    document.querySelector('.Distance-indicator').value = 1000;
    document.querySelector('.Distance-value').innerHTML = '- 1 Km -';
    introJs().start();
  } catch (error) {
    window.console.log('Error: %s', error);
    loadFallbackGeolocation();
    stopAnimation();
  }
}

/**
 * Start a new search in the Foursquare API
 */
async function startNewSearch() {
  const position = await askForGeolocation();
  cleanMarkers();
  const current_location = { lat: position.coords.latitude, lng: position.coords.longitude };
  const category = document.querySelector('.Category-selector').value;
  const distance = document.querySelector('.Distance-indicator').value;
  createMarker(getMapInstance(), current_location);
  const data = Object.assign(current_location, {
    category,
    distance
  });
  const foursquareAnswer = await foursquare.loadFoursquareInformation(data);
  const total = foursquareAnswer.response.totalResults;
  const groups = [];
  for (let counter = 0; counter <= total; counter++) {
    groups.push(foursquareAnswer.response.groups[`${counter}`]);
  }
  groups.reduce((acc, group) => {
    if (group) {
      group.items.forEach((place) => {
        acc.push(place);
      });
    }
    return acc;
  }, [])
    .map(addPlaceToMap);
}

/**
 * Create bindings between elements and actions.
 */
function initializeEvents() {
  document.querySelector('.Distance-indicator').addEventListener('input', (evt) => {
    document.querySelector('.Distance-value').innerHTML = `- ${evt.target.value / 1000} Km -`;
  });
  document.querySelector('.SearchTrigger-button').addEventListener('click', startNewSearch)
}

/**
 * Entry point
 */
ready(function () {
  startAnimation();
  loadCategories();
  initializeApplication();
  initializeEvents();
  setTimeout(() => 
    introJs().start()
  , 1000)
});

