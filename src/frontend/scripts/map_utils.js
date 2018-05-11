/* globals google MarkerClusterer */

if (!window.traveler) {
  window.traveler = {};
  window.traveler.markers = [];
}


/**
 * Styles to change maps colors
 */
const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#32384d'}] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#32384d'}] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855'}] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#e29930'}]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#e29930'}]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f'}]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76'}]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e'}]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37'}]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c'}]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948'}]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#e29930'}]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c'}]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d'}]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c'}]
  }
];

/**
 * Return main map instance.
 * 
 * @returns {Google.maps.Map} main map instance.
 */
export function getMapInstance() {
  if (window.traveler && window.traveler.map) {
    return window.traveler.map;
  }
  return null;
}

function renderTemplate(title, category, position) {
  return `<section class="MapMessage">
  <h1 class="MapMessage-title">${title}</h1>
  <div class="MapMessage-content">
    <div class="MapMessage-iconContainer">
      <img class="MapMessage-icon" src="${category.icon.prefix}bg_64${category.icon.suffix}" />
    </div>
    <div class="MapMessage-section">
      <label class="MapMessage-sectionTitle">Category:</label>
      <span>${category.name}</span>
    </div>
    <div class="MapMessage-section">
      <label class="MapMessage-sectionTitle">Address:</label>
      <span>${position.address}</span>
    </div>
    <div class="MapMessage-section">
      <button class="MapMessage-button">View Where is</button>
    </div>
  </div>
</section>`;
}

/**
 * Create a marker according to passed information
 * 
 * @param {Google.maps.Map} map to be used to place the marker
 * @param {Object} position Marker location.
 * @param {string} title Title to be used by the info pop up.
 * @param {Object} image Image to be used by the info pop up.
 * @returns {Google.maps.Marker}
 */
export function createMarker(map, position, title, category) {
  const CURRENT_LOCATION = 'Your current location';
  const markerTitle = title || CURRENT_LOCATION;
  const marker = new google.maps.Marker({
    position: position,
    map: map,
    title: markerTitle,
    animation: google.maps.Animation.DROP
  });
  let contentString;
  if (title && category) {
    contentString = renderTemplate(title, category, position);
  } else {
    contentString = `<section class="MapMessage">${CURRENT_LOCATION}</section>`;
  }
  if (!window.traveler.infoWindow) {
    window.traveler.infoWindow = new google.maps.InfoWindow({
      content: '',
      maxWidth: 600
    });
  }
  const infoWindow = window.traveler.infoWindow;
  const toggleBounce = function () {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  };
  marker.addListener('click', function () {
    toggleBounce();
    setTimeout(toggleBounce, 1500);
    infoWindow.setContent(contentString);
    infoWindow.open(map, marker);
    const btn = document.querySelector('.gm-style-iw .MapMessage').querySelector('button');
    if (btn) {
      btn.addEventListener('click', () => {
        const panorama = map.getStreetView();
        panorama.setPosition(position);
        panorama.setVisible(true);
      });
    }
  });
  window.traveler.markers.push(marker);
  return marker;
}

/**
 * Remove all markers from map
 */
export function cleanMarkers() {
  if (window.traveler.markers) {
    window.traveler.markers.map((marker) => {
      marker.setMap(null);
    });
    window.traveler.markers = [];
  }
  if(window.traveler.currentLocation){
    window.traveler.currentLocation.setMap(null);
  }
  getMapInstance().getStreetView().setVisible(false);
}

/**
 * Add markers of current search to a cluster to improve visualization.
 */
export function updateMarkersCluster() {
  if (window.traveler.markerCluster && window.traveler.markers) {
    window.traveler.markerCluster.clearMarkers();
    window.traveler.markerCluster.addMarkers(window.traveler.markers);
  }
}

/**
 * Initialize map and center in defined coords
 * @param {Object} center of maps location
 */
export function initMaps(center) {
  const map = new google.maps.Map(document.querySelector('.Map'), {
    center: center,
    zoom: 10,
    styles: MAP_STYLES,
    clickableIcons: false,
    mapTypeId: 'roadmap'
  });
  window.traveler.map = map;
  const marker = createMarker(map, center);
  window.traveler.markerCluster = new MarkerClusterer(map, [marker],
    { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });

}

