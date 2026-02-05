// Tourism Companion Pro - Enhanced PWA
// Version 2.0.0

// Global State
const state = {
    location: { lat: 11.5564, lng: 104.9282, accuracy: 100 },
    isOnline: navigator.onLine,
    batteryLevel: 100,
    tipPercent: 15,
    deferredPrompt: null
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 Tourism Companion Pro initializing...');
    
    initializeApp();
    registerServiceWorker();
    setupEventListeners();
    startBackgroundTasks();
    createBackgroundAnimation();
    
    console.log('✅ App initialized successfully');
});

function initializeApp() {
    updateLocation();
    updateNetworkStatus();
    updateBatteryStatus();
    updateTime();
    
    // Load saved location from localStorage
    const savedLocation = localStorage.getItem('lastLocation');
    if (savedLocation) {
        state.location = JSON.parse(savedLocation);
        updateLocationDisplay();
    }
}

// ============================================
// PWA FEATURES
// ============================================

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(error => {
                console.error('❌ Service Worker registration failed:', error);
            });
    }
}

function showUpdateNotification() {
    if (confirm('🔄 New version available! Update now?')) {
        window.location.reload();
    }
}

// Install Prompt Handler
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    state.deferredPrompt = e;
    
    const installPrompt = document.getElementById('installPrompt');
    if (installPrompt) {
        installPrompt.style.display = 'flex';
    }
    
    console.log('📱 Install prompt ready');
});

window.installApp = async function() {
    if (!state.deferredPrompt) return;
    
    state.deferredPrompt.prompt();
    const { outcome } = await state.deferredPrompt.userChoice;
    
    console.log(`Install choice: ${outcome}`);
    
    if (outcome === 'accepted') {
        showNotification('✅ App installed successfully!', 'success');
    }
    
    state.deferredPrompt = null;
    closeInstallPrompt();
};

window.closeInstallPrompt = function() {
    const installPrompt = document.getElementById('installPrompt');
    if (installPrompt) {
        installPrompt.style.display = 'none';
    }
};

window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installed successfully');
    showNotification('🎉 App installed! Now works offline', 'success');
});

// ============================================
// LOCATION SERVICES
// ============================================

function updateLocation() {
    if (!navigator.geolocation) {
        console.warn('Geolocation not supported');
        updateLocationDisplay();
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            state.location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: Math.round(position.coords.accuracy)
            };
            
            localStorage.setItem('lastLocation', JSON.stringify(state.location));
            updateLocationDisplay();
            
            console.log('📍 Location updated:', state.location);
        },
        (error) => {
            console.warn('Location error:', error.message);
            updateLocationDisplay();
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}

function updateLocationDisplay() {
    document.getElementById('lat').textContent = state.location.lat.toFixed(6);
    document.getElementById('lng').textContent = state.location.lng.toFixed(6);
    document.getElementById('accuracy').textContent = `±${state.location.accuracy}m`;
    document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
}

window.shareLocation = function() {
    const { lat, lng, accuracy } = state.location;
    const googleMapsUrl = `https://maps.google.com/maps?q=${lat},${lng}`;
    
    const message = `🚨 EMERGENCY LOCATION SHARE\n\n` +
                   `📍 My current position:\n${googleMapsUrl}\n\n` +
                   `Coordinates:\n` +
                   `Latitude: ${lat.toFixed(6)}\n` +
                   `Longitude: ${lng.toFixed(6)}\n` +
                   `Accuracy: ±${accuracy}m\n\n` +
                   `Sent: ${new Date().toLocaleString()}\n` +
                   `From: Tourism Companion Pro`;
    
    // Try Web Share API first
    if (navigator.share) {
        navigator.share({
            title: 'Emergency Location',
            text: message
        }).then(() => {
            showNotification('📤 Location shared successfully', 'success');
        }).catch(err => {
            console.log('Share failed:', err);
            fallbackShare(message);
        });
    } else {
        fallbackShare(message);
    }
};

function fallbackShare(message) {
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    window.open(smsUrl, '_blank');
    showNotification('📱 Opening SMS with location', 'success');
}

// ============================================
// NETWORK & BATTERY STATUS
// ============================================

function updateNetworkStatus() {
    state.isOnline = navigator.onLine;
    
    const statusBadge = document.getElementById('networkStatus');
    const statusText = document.getElementById('networkText');
    
    if (state.isOnline) {
        statusBadge.classList.remove('offline');
        statusBadge.classList.add('online');
        statusText.textContent = 'Online';
    } else {
        statusBadge.classList.remove('online');
        statusBadge.classList.add('offline');
        statusText.textContent = 'Offline Mode';
    }
}

function updateBatteryStatus() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            state.batteryLevel = Math.round(battery.level * 100);
            document.getElementById('batteryLevel').textContent = state.batteryLevel + '%';
            
            battery.addEventListener('levelchange', () => {
                state.batteryLevel = Math.round(battery.level * 100);
                document.getElementById('batteryLevel').textContent = state.batteryLevel + '%';
            });
        });
    }
}

// ============================================
// TIME & DATE
// ============================================

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Phnom_Penh',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// ============================================
// NAVIGATION & TABS
// ============================================

window.showTab = function(index) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach((content, i) => {
        content.classList.toggle('active', i === index);
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ============================================
// PHONE CALLS
// ============================================

window.call = function(number) {
    const cleanNumber = number.replace(/[^0-9+]/g, '');
    
    if (confirm(`📞 Call ${number}?`)) {
        window.location.href = `tel:${cleanNumber}`;
    }
};

window.navigate = function(destination) {
    const { lat, lng } = state.location;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${destination}`;
    
    window.open(url, '_blank');
    showNotification('🧭 Opening directions...', 'success');
};

window.emergencyAction = function() {
    const action = confirm(
        '🚨 EMERGENCY ACTION\n\n' +
        'Choose your action:\n\n' +
        'OK = Share Location\n' +
        'Cancel = Emergency Menu'
    );
    
    if (action) {
        shareLocation();
    } else {
        showEmergencyMenu();
    }
};

function showEmergencyMenu() {
    const choice = confirm(
        '🚨 EMERGENCY SERVICES\n\n' +
        'OK = Medical (119)\n' +
        'Cancel = Police (117)'
    );
    
    if (choice) {
        call('119');
    } else {
        call('117');
    }
}

// ============================================
// CONVERTERS & TOOLS
// ============================================

window.convertUSD = function() {
    const usd = parseFloat(document.getElementById('usdInput').value) || 0;
    const khr = Math.round(usd * 4100);
    document.getElementById('khrInput').value = khr;
};

window.convertKHR = function() {
    const khr = parseFloat(document.getElementById('khrInput').value) || 0;
    const usd = (khr / 4100).toFixed(2);
    document.getElementById('usdInput').value = usd;
};

window.convertCelsius = function() {
    const celsius = parseFloat(document.getElementById('celsiusInput').value);
    if (!isNaN(celsius)) {
        const fahrenheit = ((celsius * 9/5) + 32).toFixed(1);
        document.getElementById('fahrenheitInput').value = fahrenheit;
    }
};

window.convertFahrenheit = function() {
    const fahrenheit = parseFloat(document.getElementById('fahrenheitInput').value);
    if (!isNaN(fahrenheit)) {
        const celsius = ((fahrenheit - 32) * 5/9).toFixed(1);
        document.getElementById('celsiusInput').value = celsius;
    }
};

window.convertKM = function() {
    const km = parseFloat(document.getElementById('kmInput').value);
    if (!isNaN(km)) {
        const miles = (km * 0.621371).toFixed(2);
        document.getElementById('milesInput').value = miles;
    }
};

window.convertMiles = function() {
    const miles = parseFloat(document.getElementById('milesInput').value);
    if (!isNaN(miles)) {
        const km = (miles / 0.621371).toFixed(2);
        document.getElementById('kmInput').value = km;
    }
};

window.setTipPercent = function(percent) {
    state.tipPercent = percent;
    document.getElementById('tipPercent').textContent = percent;
    
    // Update button styles
    document.querySelectorAll('.btn-secondary').forEach(btn => {
        btn.style.background = '#f3f4f6';
        btn.style.color = '#374151';
    });
    event.target.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    event.target.style.color = 'white';
    
    calculateTip();
};

window.calculateTip = function() {
    const billAmount = parseFloat(document.getElementById('billAmount').value) || 0;
    const tipAmount = (billAmount * state.tipPercent / 100).toFixed(2);
    const totalAmount = (billAmount + parseFloat(tipAmount)).toFixed(2);
    
    document.getElementById('tipAmount').textContent = tipAmount;
    document.getElementById('totalAmount').textContent = totalAmount;
};

// ============================================
// PHRASES
// ============================================

window.speakPhrase = function(phraseId) {
    // Haptic feedback if available
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    showNotification('🔊 Playing pronunciation...', 'success');
    
    // In a real app, this would play audio
    console.log('Playing phrase:', phraseId);
};

// ============================================
// UI ENHANCEMENTS
// ============================================

function createBackgroundAnimation() {
    const bgAnimation = document.getElementById('bgAnimation');
    if (!bgAnimation) return;
    
    for (let i = 0; i < 10; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        
        const size = Math.random() * 100 + 50;
        shape.style.width = size + 'px';
        shape.style.height = size + 'px';
        shape.style.left = Math.random() * 100 + '%';
        shape.style.top = Math.random() * 100 + '%';
        shape.style.animationDelay = Math.random() * 20 + 's';
        shape.style.animationDuration = (Math.random() * 10 + 15) + 's';
        
        bgAnimation.appendChild(shape);
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#667eea'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Network status
    window.addEventListener('online', () => {
        updateNetworkStatus();
        showNotification('🌐 Back online!', 'success');
    });
    
    window.addEventListener('offline', () => {
        updateNetworkStatus();
        showNotification('📡 Offline mode active', 'info');
    });
    
    // Visibility change
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            updateLocation();
            updateTime();
            updateBatteryStatus();
            updateNetworkStatus();
        }
    });
    
    // Orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(updateLocation, 500);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Number keys for tabs
        if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            showTab(parseInt(e.key) - 1);
        }
        
        // Escape to close install prompt
        if (e.key === 'Escape') {
            closeInstallPrompt();
        }
    });
}

// ============================================
// BACKGROUND TASKS
// ============================================

function startBackgroundTasks() {
    // Update time every second
    setInterval(updateTime, 1000);
    
    // Update location every 5 minutes
    setInterval(updateLocation, 5 * 60 * 1000);
    
    // Update battery every minute
    setInterval(updateBatteryStatus, 60 * 1000);
    
    // Check network status every 30 seconds
    setInterval(updateNetworkStatus, 30 * 1000);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page loaded in ${loadTime}ms`);
    });
}

// ============================================
// ERROR HANDLING
// ============================================

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================

console.log('%c🌟 Tourism Companion Pro', 'font-size: 24px; font-weight: bold; color: #667eea;');
console.log('%cVersion 2.0.0', 'font-size: 14px; color: #764ba2;');
console.log('%c✅ PWA Features Active', 'font-size: 12px; color: #10b981;');
console.log('%c📱 Works Offline', 'font-size: 12px; color: #10b981;');
console.log('%c🔒 Secure & Private', 'font-size: 12px; color: #10b981;');
console.log('');
console.log('Keyboard Shortcuts:');
console.log('Ctrl/Cmd + 1-5: Switch tabs');
console.log('Esc: Close install prompt');

// Export for debugging
if (typeof window !== 'undefined') {
    window.TourismCompanion = {
        state,
        updateLocation,
        showNotification,
        version: '2.0.0'
    };
}