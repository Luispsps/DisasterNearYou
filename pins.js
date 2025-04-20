let pins = [];
let pinMarkers = [];

// Load pins from storage
function loadPins() {
    try {
        const storedPins = localStorage.getItem('earthquakePins');
        if (storedPins) {
            pins = JSON.parse(storedPins);
            displayPins();
        }
    } catch (error) {
        console.error('Error loading pins:', error);
        pins = [];
    }
}

// Save pins to storage
function savePins() {
    try {
        localStorage.setItem('earthquakePins', JSON.stringify(pins));
    } catch (error) {
        console.error('Error saving pins:', error);
    }
}

// Add new pin
function addPin(pinData) {
    const newPin = {
        id: Date.now().toString(),
        userId: localStorage.getItem('currentUser'),
        ...pinData,
        timestamp: new Date().toISOString()
    };
    
    pins.push(newPin);
    savePins();
    displayPins();
    return newPin;
}

// Update pin location and address
async function updatePinLocation(pinId, newLocation) {
    const pin = pins.find(p => p.id === pinId);
    if (pin) {
        pin.location = newLocation;
        // Get new address for the updated location
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLocation.lat}&lon=${newLocation.lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            pin.address = data.display_name || 'Unknown Location';
            savePins();
            displayPins(); // Refresh the display to show new address
        } catch (error) {
            console.error('Error updating address:', error);
        }
    }
}

// Display pins on map
function displayPins() {
    // Clear existing pin markers
    pinMarkers.forEach(marker => map.removeLayer(marker));
    pinMarkers = [];
    
    // Add new pin markers
    pins.forEach(pin => {
        const marker = L.marker([pin.location.lat, pin.location.lng], {
            draggable: true,
            icon: L.divIcon({
                className: 'pin-marker',
                html: '<div class="pin-dot"></div>',
                iconSize: [30, 30]
            })
        }).addTo(map);
        
        marker.bindPopup(`
            <div class="pin-popup">
                <h4>Location Details</h4>
                <p class="address">${pin.address || 'Unknown Location'}</p>
                <hr>
                <p class="description">${pin.description}</p>
                <img src="${pin.image}" alt="Damage photo" style="max-width: 200px;">
                <p class="timestamp">Reported: ${new Date(pin.timestamp).toLocaleString()}</p>
                <p class="user">By: ${pin.userId}</p>
            </div>
        `);
        
        // Add dragend event listener
        marker.on('dragend', function(e) {
            const newLocation = {
                lat: e.target.getLatLng().lat,
                lng: e.target.getLatLng().lng
            };
            updatePinLocation(pin.id, newLocation);
        });
        
        pinMarkers.push(marker);
    });
}

// Initialize pins when page loads
window.addEventListener('load', loadPins);