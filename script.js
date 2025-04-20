let map;
let markers = [];
let userLocation = null;
let tempMarker = null;

// Initialize map
function initMap() {
    // Create map centered on a default location
    map = L.map('map').setView([20, 0], 2);
    
    // Add map tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setView([userLocation.lat, userLocation.lng], 10);
                
                // Add user location marker
                L.marker([userLocation.lat, userLocation.lng], {
                    icon: L.divIcon({
                        className: 'user-location-marker',
                        html: '<div class="user-location-dot"></div>',
                        iconSize: [20, 20]
                    })
                }).addTo(map).bindPopup('Your Location');
            },
            (error) => {
                console.error('Error getting location:', error);
            }
        );
    }

    // Add click handler for adding pins
    map.on('click', function(e) {
        if (document.getElementById('pinFormContainer').style.display === 'block') {
            // Remove existing temporary marker if any
            if (tempMarker) {
                map.removeLayer(tempMarker);
            }
            
            // Create a new temporary marker
            tempMarker = L.marker(e.latlng, {
                draggable: true,
                autoPan: true,
                icon: L.divIcon({
                    className: 'temp-pin-marker',
                    html: '<div class="temp-pin-dot"></div>',
                    iconSize: [30, 30]
                })
            }).addTo(map);

            // Get address for the clicked location
            getAddressFromCoordinates(e.latlng.lat, e.latlng.lng)
                .then(address => {
                    if (address) {
                        tempMarker.bindPopup(`Location: ${address}`).openPopup();
                    }
                });
        }
    });
}

// Get address from coordinates using Nominatim
async function getAddressFromCoordinates(lat, lng) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        return data.display_name || 'Unknown Location';
    } catch (error) {
        console.error('Error getting address:', error);
        return null;
    }
}

// Initialize when page loads
window.addEventListener('load', () => {
    initMap();
    updateMap();
    // Update map every 5 minutes
    setInterval(updateMap, 5 * 60 * 1000);
});

async function fetchEarthquakeData() {
    try {
        const response = await fetch(
            'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson'
        );
        const data = await response.json();
        return data.features.map(feature => ({
            id: feature.id,
            place: feature.properties.place,
            mag: feature.properties.mag,
            time: new Date(feature.properties.time).toISOString(),
            coordinates: feature.geometry.coordinates,
            isMajor: feature.properties.mag >= 5.0
        }));
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Update map with earthquake data
async function updateMap() {
    const earthquakes = await fetchEarthquakeData();
    
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    // Add new markers
    earthquakes.forEach(eq => {
        const marker = L.circleMarker(
            [eq.coordinates[1], eq.coordinates[0]], 
            {
                radius: eq.mag * 3,
                fillColor: eq.isMajor ? '#ff4444' : '#ffaa44',
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }
        ).addTo(map);
        
        marker.bindPopup(`
            <strong>${eq.place}</strong><br>
            Magnitude: ${eq.mag}<br>
            Time: ${new Date(eq.time).toLocaleString()}
        `);
        
        markers.push(marker);
    });

    // Update the earthquake feed
    updateEarthquakeFeed(earthquakes);
}

// Update the earthquake feed section
function updateEarthquakeFeed(earthquakes) {
    const feed = document.getElementById('feed');
    feed.innerHTML = ''; // Clear existing content

    // Sort earthquakes by magnitude (highest first)
    earthquakes.sort((a, b) => b.mag - a.mag);

    // Create feed items
    earthquakes.forEach(eq => {
        const feedItem = document.createElement('div');
        feedItem.className = 'earthquake-feed-item';
        feedItem.innerHTML = `
            <div class="earthquake-magnitude ${eq.isMajor ? 'major' : ''}">
                ${eq.mag.toFixed(1)}
            </div>
            <div class="earthquake-details">
                <h3>${eq.place}</h3>
                <p class="earthquake-time">${new Date(eq.time).toLocaleString()}</p>
                <p class="earthquake-coordinates">
                    Latitude: ${eq.coordinates[1].toFixed(2)}° 
                    Longitude: ${eq.coordinates[0].toFixed(2)}°
                </p>
            </div>
        `;

        // Add click handler to center map on earthquake
        feedItem.addEventListener('click', () => {
            map.setView([eq.coordinates[1], eq.coordinates[0]], 8);
            markers.find(m => m.getLatLng().lat === eq.coordinates[1] && 
                            m.getLatLng().lng === eq.coordinates[0]).openPopup();
        });

        feed.appendChild(feedItem);
    });
}

// Handle pin form submission
document.getElementById('pinForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const description = document.getElementById('pinDescription').value;
    const imageFile = document.getElementById('pinImage').files[0];
    
    if (!description || !imageFile || !tempMarker) {
        alert('Please fill in all fields and select a location on the map');
        return;
    }
    
    // Get address for the final pin location
    const address = await getAddressFromCoordinates(
        tempMarker.getLatLng().lat,
        tempMarker.getLatLng().lng
    );
    
    const pinData = {
        description,
        location: {
            lat: tempMarker.getLatLng().lat,
            lng: tempMarker.getLatLng().lng
        },
        address: address,
        image: await readFileAsBase64(imageFile),
        userId: localStorage.getItem('currentUser')
    };
    
    addPin(pinData);
    map.removeLayer(tempMarker);
    tempMarker = null;
    document.getElementById('pinForm').reset();
    document.getElementById('pinFormContainer').style.display = 'none';
});

// Helper function to read file as base64
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

