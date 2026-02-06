
        // Configuration
        const EMERGENCY_CONTACT = '0716145925';
        let currentPosition = {
            latitude: 11.5564,
            longitude: 104.9282,
            accuracy: 100
        };

        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            initBackgroundAnimation();
            updateTime();
            setInterval(updateTime, 1000);
            updateNetworkStatus();
            updateBatteryStatus();
            getLocation();
            checkInstallStatus();
            showMobileInstallBanner();
            
            // Update location every 30 seconds
            setInterval(getLocation, 30000);
        });

        // Show mobile install banner on mobile devices
        function showMobileInstallBanner() {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
            const hasSeenBanner = localStorage.getItem('hideInstallBanner');

            // Show banner on mobile if not installed and user hasn't dismissed it
            if (isMobile && !isStandalone && !hasSeenBanner) {
                // Show after 3 seconds to not be too intrusive
                setTimeout(() => {
                    document.getElementById('mobileInstallBanner').style.display = 'block';
                }, 3000);
            }
        }

        function closeMobileInstallBanner() {
            document.getElementById('mobileInstallBanner').style.display = 'none';
            // Remember user dismissed it (will show again on next visit)
            localStorage.setItem('hideInstallBanner', 'true');
        }

        // Background animation
        function initBackgroundAnimation() {
            const container = document.getElementById('bgAnimation');
            for (let i = 0; i < 10; i++) {
                const shape = document.createElement('div');
                shape.className = 'floating-shape';
                shape.style.width = Math.random() * 100 + 50 + 'px';
                shape.style.height = shape.style.width;
                shape.style.left = Math.random() * 100 + '%';
                shape.style.top = Math.random() * 100 + '%';
                shape.style.animationDelay = Math.random() * 20 + 's';
                shape.style.animationDuration = (Math.random() * 10 + 15) + 's';
                container.appendChild(shape);
            }
        }

        // Check if app is already installed
        function checkInstallStatus() {
            // Check if running as standalone PWA
            if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
                // Hide install button if already installed
                const installBtn = document.getElementById('installBtn');
                if (installBtn) {
                    installBtn.style.display = 'none';
                }
            }
        }

        // Get current location
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        currentPosition = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy
                        };
                        
                        document.getElementById('lat').textContent = currentPosition.latitude.toFixed(6);
                        document.getElementById('lng').textContent = currentPosition.longitude.toFixed(6);
                        document.getElementById('accuracy').textContent = '±' + Math.round(currentPosition.accuracy) + 'm';
                        document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
                    },
                    function(error) {
                        console.error('Location error:', error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            }
        }

        // Send Emergency SMS
        function sendEmergencySMS() {
            const message = `🚨 EMERGENCY ALERT 🚨\n\nI need help!\n\nMy location:\nLatitude: ${currentPosition.latitude.toFixed(6)}\nLongitude: ${currentPosition.longitude.toFixed(6)}\n\nGoogle Maps:\nhttps://maps.google.com/?q=${currentPosition.latitude},${currentPosition.longitude}\n\nTime: ${new Date().toLocaleString()}\nAccuracy: ±${Math.round(currentPosition.accuracy)}m`;
            
            const smsUrl = `sms:${EMERGENCY_CONTACT}?body=${encodeURIComponent(message)}`;
            
            if (confirm(`Send emergency SMS to ${EMERGENCY_CONTACT} with your current location?`)) {
                window.location.href = smsUrl;
            }
        }

        // Share location
        function shareLocation() {
            const shareText = `My location:\n${currentPosition.latitude.toFixed(6)}, ${currentPosition.longitude.toFixed(6)}\nhttps://maps.google.com/?q=${currentPosition.latitude},${currentPosition.longitude}`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'My Location',
                    text: shareText
                }).catch(err => console.error('Share failed:', err));
            } else {
                const smsUrl = `sms:?body=${encodeURIComponent(shareText)}`;
                window.location.href = smsUrl;
            }
        }

        // Make phone call
        function call(number) {
            window.location.href = 'tel:' + number;
        }

        // Navigate
        function navigate(place) {
            const url = `https://maps.google.com/?q=${currentPosition.latitude},${currentPosition.longitude}`;
            window.open(url, '_blank');
        }

        // Tab switching
        function showTab(index) {
            document.querySelectorAll('.tab-btn').forEach((btn, i) => {
                btn.classList.toggle('active', i === index);
            });
            document.querySelectorAll('.tab-content').forEach((content, i) => {
                content.classList.toggle('active', i === index);
            });
        }

        // Currency converter
        function convertUSD() {
            const usd = parseFloat(document.getElementById('usdInput').value) || 0;
            document.getElementById('khrInput').value = (usd * 4100).toFixed(0);
        }

        function convertKHR() {
            const khr = parseFloat(document.getElementById('khrInput').value) || 0;
            document.getElementById('usdInput').value = (khr / 4100).toFixed(2);
        }

        // Temperature converter
        function convertCelsius() {
            const c = parseFloat(document.getElementById('celsiusInput').value);
            if (!isNaN(c)) {
                document.getElementById('fahrenheitInput').value = ((c * 9/5) + 32).toFixed(1);
            }
        }

        function convertFahrenheit() {
            const f = parseFloat(document.getElementById('fahrenheitInput').value);
            if (!isNaN(f)) {
                document.getElementById('celsiusInput').value = ((f - 32) * 5/9).toFixed(1);
            }
        }

        // Distance converter
        function convertKM() {
            const km = parseFloat(document.getElementById('kmInput').value);
            if (!isNaN(km)) {
                document.getElementById('milesInput').value = (km * 0.621371).toFixed(2);
            }
        }

        function convertMiles() {
            const miles = parseFloat(document.getElementById('milesInput').value);
            if (!isNaN(miles)) {
                document.getElementById('kmInput').value = (miles / 0.621371).toFixed(2);
            }
        }

        // Tip calculator
        let tipPercent = 15;

        function setTipPercent(percent) {
            tipPercent = percent;
            document.getElementById('tipPercent').textContent = percent;
            calculateTip();
        }

        function calculateTip() {
            const bill = parseFloat(document.getElementById('billAmount').value) || 0;
            const tip = bill * (tipPercent / 100);
            const total = bill + tip;
            
            document.getElementById('tipAmount').textContent = tip.toFixed(2);
            document.getElementById('totalAmount').textContent = total.toFixed(2);
        }

        // Update time
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                timeZone: 'Asia/Phnom_Penh',
                hour12: false
            });
            document.getElementById('currentTime').textContent = timeString;
        }

        // Update network status
        function updateNetworkStatus() {
            const statusBadge = document.getElementById('networkStatus');
            const statusText = document.getElementById('networkText');
            
            if (navigator.onLine) {
                statusBadge.classList.remove('offline');
                statusBadge.classList.add('online');
                statusText.textContent = 'Online';
            } else {
                statusBadge.classList.remove('online');
                statusBadge.classList.add('offline');
                statusText.textContent = 'Offline';
            }
        }

        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);

        // Update battery status
        async function updateBatteryStatus() {
            if ('getBattery' in navigator) {
                try {
                    const battery = await navigator.getBattery();
                    const level = Math.round(battery.level * 100);
                    document.getElementById('batteryLevel').textContent = level + '%';
                    
                    battery.addEventListener('levelchange', () => {
                        const newLevel = Math.round(battery.level * 100);
                        document.getElementById('batteryLevel').textContent = newLevel + '%';
                    });
                } catch (e) {
                    document.getElementById('batteryLevel').textContent = 'N/A';
                }
            }
        }

        // PWA Install
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show the install prompt banner
            document.getElementById('installPrompt').style.display = 'flex';
            
            // Make the install button pulse to draw attention
            const installBtn = document.getElementById('installBtn');
            if (installBtn) {
                installBtn.style.animation = 'pulse 2s infinite';
            }
        });

        // Listen for successful installation
        window.addEventListener('appinstalled', (evt) => {
            console.log('App installed successfully');
            document.getElementById('installPrompt').style.display = 'none';
            document.getElementById('installBtn').style.display = 'none';
            
            // Show success message
            alert('✅ App installed! You can now use it offline from your home screen.');
        });

        function installApp() {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('PWA installed');
                        document.getElementById('installBtn').style.display = 'none';
                    }
                    deferredPrompt = null;
                    document.getElementById('installPrompt').style.display = 'none';
                });
            }
        }

        function closeInstallPrompt() {
            document.getElementById('installPrompt').style.display = 'none';
        }

        // Manual install prompt with instructions
        function promptInstall() {
            // Try automatic install first - this works on Android Chrome/Edge
            if (deferredPrompt) {
                installApp();
                return;
            }

            // For browsers that support it but haven't triggered beforeinstallprompt yet
            // Try to show a helpful animation/indicator
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isAndroid = /Android/.test(navigator.userAgent);
            const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

            // Already installed
            if (isStandalone) {
                alert('✅ App is already installed on your home screen!');
                return;
            }

            // Show modal with visual instructions
            const modal = document.getElementById('installModal');
            const instructions = document.getElementById('installInstructions');
            
            let instructionsHTML = '';
            
            if (isIOS || isSafari) {
                // iOS Safari - show animated visual guide
                instructionsHTML = `
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="font-size: 48px; animation: bounce 1s infinite;">⬇️</div>
                        <p style="color: #667eea; font-weight: 600; margin-top: 8px;">Look at the bottom of your screen!</p>
                    </div>
                    <div class="install-step">
                        <div class="install-step-number">1</div>
                        <div class="install-step-text">Tap the <strong>Share button</strong> <span style="font-size: 20px;">⎙</span> at the bottom of Safari</div>
                    </div>
                    <div class="install-step">
                        <div class="install-step-number">2</div>
                        <div class="install-step-text">Scroll down and tap <strong>"Add to Home Screen"</strong> <span style="font-size: 18px;">➕</span></div>
                    </div>
                    <div class="install-step">
                        <div class="install-step-number">3</div>
                        <div class="install-step-text">Tap <strong>"Add"</strong> in the top right to confirm</div>
                    </div>
                    <div style="background: #f0f9ff; padding: 12px; border-radius: 8px; margin-top: 16px; border-left: 4px solid #667eea;">
                        <p style="font-size: 13px; color: #1e40af; margin: 0;">💡 After installing, you can use this app offline without internet!</p>
                    </div>
                `;
            } else if (isAndroid) {
                // Android - show animated visual guide
                instructionsHTML = `
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="font-size: 48px; animation: bounce 1s infinite;">☝️</div>
                        <p style="color: #667eea; font-weight: 600; margin-top: 8px;">Look at the top-right corner!</p>
                    </div>
                    <div class="install-step">
                        <div class="install-step-number">1</div>
                        <div class="install-step-text">Tap the <strong>menu button</strong> <span style="font-size: 20px;">⋮</span> in the top-right corner</div>
                    </div>
                    <div class="install-step">
                        <div class="install-step-number">2</div>
                        <div class="install-step-text">Look for <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong> <span style="font-size: 18px;">📥</span></div>
                    </div>
                    <div class="install-step">
                        <div class="install-step-number">3</div>
                        <div class="install-step-text">Tap <strong>"Add"</strong> or <strong>"Install"</strong> to add to your home screen</div>
                    </div>
                    <div style="background: #f0f9ff; padding: 12px; border-radius: 8px; margin-top: 16px; border-left: 4px solid #667eea;">
                        <p style="font-size: 13px; color: #1e40af; margin: 0;">💡 After installing, you can use this app offline without internet!</p>
                    </div>
                `;
            } else {
                // Desktop
                instructionsHTML = `
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="font-size: 48px;">💻</div>
                        <p style="color: #667eea; font-weight: 600; margin-top: 8px;">Desktop Installation</p>
                    </div>
                    <div class="install-step">
                        <div class="install-step-number">1</div>
                        <div class="install-step-text">Look for the <strong>install icon</strong> <span style="font-size: 18px;">⊕</span> in your browser's address bar</div>
                    </div>
                    <div class="install-step">
                        <div class="install-step-number">2</div>
                        <div class="install-step-text">Click the icon and select <strong>"Install"</strong></div>
                    </div>
                    <div class="install-step">
                        <div class="install-step-number">3</div>
                        <div class="install-step-text">The app will be added to your desktop or applications</div>
                    </div>
                `;
            }
            
            instructions.innerHTML = instructionsHTML;
            modal.style.display = 'flex';

            // For iOS, also vibrate to draw attention if supported
            if (isIOS && navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
        }

        function closeInstallModal() {
            document.getElementById('installModal').style.display = 'none';
        }

        // Close modal when clicking outside
        document.getElementById('installModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeInstallModal();
            }
        });

        // Speak phrase (placeholder)
        function speakPhrase(phrase) {
            console.log('Speaking:', phrase);
        }

        // Register service worker for offline support
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                    .then(reg => console.log('Service Worker registered'))
                    .catch(err => console.log('Service Worker registration failed:', err));
            });
        }
  