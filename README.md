# 🌍 DisasterNearYou

**DisasterNearYou** is a web application built at the UC Davis Hackathon to help communities quickly share and access critical, real-time information during earthquake-related emergencies. The platform allows users to report damage, visualize hazards on an interactive map, and stay informed about their surroundings when it matters most.

Built in just **24 hours**, this project focuses on clarity, speed, and community-driven awareness during disasters.

---

## 🚨 Features

### 📍 Interactive Map Reporting
Drop pins on a map to report earthquake-related damage.

### 📷 Photo & Description Uploads
Attach images and detailed descriptions to each report.

### 🧭 Real-Time Address Resolution
Automatically converts coordinates into human-readable addresses.

### 🔄 Draggable Pins
Adjust pin locations easily, with addresses updating in real time.

### 👀 Community Visibility
View reports submitted by other users to identify nearby hazards.

### 🔐 User Authentication
Sign in and register with a simple login system, including a **“Remember Me”** option.

---

## 🛠️ Tech Stack

**Frontend**
- HTML
- CSS
- JavaScript

**Mapping & Geolocation**
- [Leaflet.js](https://leafletjs.com/) – Interactive maps and draggable pins
- [OpenStreetMap](https://www.openstreetmap.org/) – Base map tiles
- [Nominatim Reverse Geocoding API](https://nominatim.org/) – Converts coordinates to addresses

**Data & State Management**
- Web Storage API (`localStorage`)
- User login sessions
- Pin data (location, description, photo, timestamp)

---

## 🧠 How It Works

1. Users log in or register.
2. Users drop pins on a map to report earthquake damage.
3. Each pin stores:
   - Latitude & longitude
   - Auto-generated address
   - Description
   - Photo
   - Timestamp
4. Pins can be dragged to refine location accuracy.
5. Other users can view all submitted reports to stay informed.

---

## 🌎 Why This Project Matters

Earthquakes strike without warning, often leaving communities scrambling for reliable, up-to-date information. **DisasterNearYou** addresses this gap by enabling crowdsourced, location-based reporting, helping users:

- Identify nearby hazards
- Make informed decisions quickly
- Reduce confusion during emergencies

The goal is to **empower communities, save time, and improve safety** when every second counts.

---

## 🚀 Future Improvements

- Backend database integration for persistent, scalable storage
- Real user authentication and authorization
- Live updates across users (real-time syncing)
- Integration with official disaster response APIs
- Mobile-friendly enhancements and accessibility improvements

---

## 👥 Team

Built with ❤️ at the UC Davis Hackathon by:

- Zahra Ghausi
- Arya Dev Kaushal
- Nina Tkachuk

Special thanks to Emma Van Hoogmoed for support and guidance during the hackathon.
