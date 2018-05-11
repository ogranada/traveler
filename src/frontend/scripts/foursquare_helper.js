
/**
 * 
 * @param {Object} Base information to get venues.
 * @returns {Promise} Promise with venues results.
 */
export function loadFoursquareInformation({ lng, lat, category, distance }) {
  return fetch('/api/v1/fsq/locations', {
    method: 'POST',
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      ll: `${lat},${lng}`,
      query: category,
      radius: distance
    })
  }).then((response) => {
    return response.json();
  });
}

/**
 * Get Foursquare categories
 * @returns {Promise} Promise with categories results.
 */
export function getCategories() {
  return fetch('/api/v1/fsq/categories', {
    method: 'POST',
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    body: '{}'
  }).then((response) => {
    return response.json();
  });
}

export default {
  getCategories,
  loadFoursquareInformation
};
