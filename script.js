// Schedule data
const busSchedule = [
    { time: '06:15', type: 'CTB', status: 'Scheduled' },
    { time: '07:10', type: 'PRIVATE', status: 'Scheduled' },
    { time: '07:45', type: 'CTB', status: 'Scheduled' },
    { time: '09:15', type: 'PRIVATE', status: 'Scheduled' },
    { time: '10:30', type: 'CTB', status: 'Scheduled' },
    { time: '11:15', type: 'PRIVATE', status: 'Scheduled' },
    { time: '13:15', type: 'PRIVATE', status: 'Scheduled' },
    { time: '14:20', type: 'CTB', status: 'Scheduled' },
    { time: '15:25', type: 'PRIVATE', status: 'Scheduled' },
    { time: '16:15', type: 'CTB', status: 'Scheduled' },
    { time: '17:15', type: 'PRIVATE', status: 'Scheduled' }
];

// Notification System
let notificationsEnabled = false;

document.getElementById('notifyToggle').addEventListener('click', async () => {
    if (!notificationsEnabled) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            notificationsEnabled = true;
            showToast('Notifications enabled successfully!');
            document.getElementById('notifyToggle').innerHTML = `
                <i class="fas fa-bell-slash mr-2"></i>
                Disable Notifications
            `;
        }
    } else {
        notificationsEnabled = false;
        showToast('Notifications disabled');
        document.getElementById('notifyToggle').innerHTML = `
            <i class="fas fa-bell mr-2"></i>
            Enable Notifications
        `;
    }
});

// Toast notification function
function showToast(message) {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
    }).showToast();
}

// Initialize map with custom marker
const map = L.map('map').setView([7.461843074956415, 80.38382383676365], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Custom marker with popup
const busStopIcon = L.divIcon({
    html: '<i class="fas fa-bus text-3xl text-indigo-600"></i>',
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

L.marker([7.461843074956415, 80.38382383676365], { icon: busStopIcon })
    .addTo(map)
    .bindPopup('<strong>Piscal Watta Bus Stop</strong><br>Main Bus Terminal');

// Update clock and date
function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    const dateStr = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    document.getElementById('clock').textContent = timeStr;
    document.getElementById('date').textContent = dateStr;
}

// Initialize clock
updateClock();
setInterval(updateClock, 1000);

// Populate and update schedule
function populateSchedule() {
    const tbody = document.getElementById('schedule-body');
    tbody.innerHTML = '';

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    busSchedule.forEach(bus => {
        const [hours, minutes] = bus.time.split(':').map(Number);
        const busTime = hours * 60 + minutes;

        const row = document.createElement('tr');
        const timeClass = busTime > currentTime ? 'text-gray-900' : 'text-gray-500';
        const statusClass = busTime > currentTime ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800';
        const status = busTime > currentTime ? 'Upcoming' : 'Departed';

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap ${timeClass}">
                <div class="flex items-center">
                    <i class="far fa-clock mr-2"></i>
                    ${bus.time}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <i class="fas fa-${bus.type === 'CTB' ? 'bus' : 'shuttle-van'} mr-2"></i>
                    ${bus.type}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                    ${status}
                </span>
            </td>
        `;

        if (busTime > currentTime) {
            if (!document.querySelector('.current')) {
                row.classList.add('current');
                
                // Send notification for upcoming bus
                if (notificationsEnabled) {
                    const timeUntil = busTime - currentTime;
                    if (timeUntil <= 15) { // Notify if bus is coming in 15 minutes or less
                        new Notification('Upcoming Bus Alert', {
                            body: `Next bus to Kurunegala is arriving in ${timeUntil} minutes`,
                            icon: '/path/to/bus-icon.png'
                        });
                    }
                }
            }
        }

        tbody.appendChild(row);
    });
}

// Simulate weather data (you can replace this with a real weather API)
function updateWeather() {
    const weatherInfo = document.getElementById('weatherInfo');
    const temp = Math.floor(Math.random() * 10) + 25; // Random temperature between 25-35°C
    weatherInfo.innerHTML = `
        <i class="fas fa-sun mr-2"></i>
        ${temp}°C
    `;
}

// Initialize schedule and weather
populateSchedule();
updateWeather();

// Update schedule every minute
setInterval(populateSchedule, 60000);
// Update weather every 5 minutes
setInterval(updateWeather, 300000);

// Initial load
window.addEventListener('load', () => {
    showToast('Welcome to Bus Schedule App!');
});
