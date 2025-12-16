# ☀️ Premium Weather App

A stunning, modern weather application with real-time weather data, beautiful glassmorphism UI, and comprehensive features built with vanilla JavaScript.

![Weather App](https://img.shields.io/badge/status-active-success.svg)
![API](https://img.shields.io/badge/API-OpenWeatherMap-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🌍 Core Functionality
- **Real-time Weather Data** - Current weather conditions for any city worldwide
- **5-Day Forecast** - Extended weather predictions with daily breakdowns
- **Geolocation Support** - Automatic weather detection for your current location
- **City Search** - Search any city globally with instant results
- **Unit Conversion** - Toggle between Celsius and Fahrenheit
- **Dark Mode** - Beautiful dark theme with smooth transitions

### 🎨 Premium Design
- **Glassmorphism Effects** - Modern frosted glass UI components
- **Dynamic Backgrounds** - Weather-based animated gradient backgrounds
- **Smooth Animations** - Professional CSS animations throughout
- **Loading Skeletons** - Shimmer loading states for better UX
- **Responsive Design** - Perfect experience on all devices
- **Modern Typography** - Clean Inter font family

### 📊 Detailed Weather Information
- Current temperature with "feels like" indicator
- Weather conditions with animated icons
- Wind speed (km/h or mph)
- Humidity percentage
- Atmospheric pressure
- Visibility distance
- Sunrise and sunset times

## 🚀 Quick Start

### Prerequisites
- Node.js installed on your system
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <your-repo-url>
   cd weather-app
   ```

2. **Start the server**
   ```bash
   node server.js
   ```

3. **Open your browser**
   ```
   Navigate to: http://localhost:3000
   ```

That's it! The app includes a demo API key and is ready to use immediately.

### Alternative Server Options

**Using Python:**
```bash
python -m http.server 3000
```

**Using npx:**
```bash
npx http-server -p 3000
```

## 🔑 API Configuration

The app uses the **free OpenWeatherMap API** and includes a demo API key for immediate testing.

### Get Your Own API Key (Optional)

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Open `app.js` and replace the API key:
   ```javascript
   const API_KEY = 'your_api_key_here';
   ```

> **Note:** The free tier allows 1,000 API calls per day, which is more than enough for personal use.

## 💻 Technologies Used

| Technology | Purpose |
|------------|---------|
| **HTML5** | Structure and semantics |
| **CSS3** | Styling with custom properties |
| **JavaScript (ES6+)** | Logic and API integration |
| **OpenWeatherMap API** | Weather data source |
| **Font Awesome** | Modern icon library |
| **Google Fonts (Inter)** | Typography |

## 🎯 Usage Guide

### Search for a City
1. Type the city name in the search box
2. Press Enter or click the search icon
3. Weather data will load automatically

### Use Geolocation
- Click the location icon (crosshair) in the search box
- Allow location access when prompted
- Your local weather will display

### Toggle Temperature Units
- Click the °C/°F button in the header
- Units will switch and data will refresh

### Enable Dark Mode
- Click the moon/sun icon in the header
- Your preference is saved automatically

## 📱 Browser Compatibility

✅ Chrome (latest)  
✅ Firefox (latest)  
✅ Safari (latest)  
✅ Edge (latest)  
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Design Features

### Color Scheme
- **Light Mode:** Purple gradient with golden accents
- **Dark Mode:** Deep blues with warm highlights
- **Glassmorphism:** Frosted glass effects with backdrop blur

### Responsive Breakpoints
- **Desktop:** 1400px containers
- **Tablet:** 768px adaptive layout
- **Mobile:** 480px single-column design

### Animations
- Smooth page transitions (300ms ease)
- Floating weather icons
- Shimmer loading effects
- Staggered forecast card animations

## 📁 Project Structure

```
weather-app/
├── index.html          # Main HTML structure
├── styles.css          # Premium CSS design system
├── app.js              # JavaScript with API integration
├── server.js           # Node.js development server
├── 404.html            # Custom error page
└── README.md           # This file
```

## 🌐 API Endpoints Used

The app uses free OpenWeatherMap API endpoints:

```javascript
// Current Weather
GET /data/2.5/weather

// 5-Day Forecast  
GET /data/2.5/forecast

// Geocoding
GET /geo/1.0/direct
```

## 🔧 Customization

### Change Default City
In `app.js`, modify the fallback city:
```javascript
searchCity('Your City'); // Line in getUserLocation() function
```

### Adjust Colors
In `styles.css`, update CSS custom properties:
```css
:root {
    --color-primary: #667eea;
    --color-accent: #f6d365;
    /* Add your colors */
}
```

### Modify Animations
Adjust animation speeds in `styles.css`:
```css
.weather-card {
    animation: fadeInUp 0.6s ease; /* Change duration */
}
```

## 🐛 Troubleshooting

### Weather data not loading?
- Check your internet connection
- Verify the API key is valid
- Check browser console for errors
- Ensure you're not exceeding API rate limits (1000/day)

### Geolocation not working?
- Allow location access in browser settings
- Use HTTPS or localhost (geolocation requirement)
- Try searching for a city manually

### Dark mode not working?
- Clear browser localStorage
- Disable browser extensions that modify CSS
- Check console for JavaScript errors

### Styles not loading?
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Verify `styles.css` file exists

## 🚀 Future Enhancements

Possible additions for future versions:
- [ ] Hourly forecast (24-hour breakdown)
- [ ] Weather alerts and warnings
- [ ] Air quality index
- [ ] Interactive weather maps
- [ ] City favorites and search history
- [ ] Progressive Web App (PWA) features
- [ ] Weather animations (rain, snow effects)
- [ ] Multiple language support

## 📄 License

This project is licensed under the MIT License - feel free to use it for personal or commercial projects.

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons by [Font Awesome](https://fontawesome.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)

## 📧 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the browser console for errors
3. Ensure you're using a modern browser

---

**Made with ❤️ using modern web technologies**

Enjoy your premium weather experience! ☀️🌧️❄️