// client.js
document.addEventListener('DOMContentLoaded', () => {
    const deadline = '2023-08-29 08:23:00';

    function getTimeRemaining(endtime) {
        const total = Date.parse(endtime) - Date.now();
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((total / (1000 * 60)) % 60);
        const seconds = Math.floor((total / 1000) % 60);

        return { days, hours, minutes, seconds };
    }

    function updateTimer() {
        const timer = getTimeRemaining(deadline);

        document.getElementById('days').textContent = timer.days;
        document.getElementById('hours').textContent = timer.hours;
        document.getElementById('minutes').textContent = timer.minutes;
        document.getElementById('seconds').textContent = timer.seconds;
    }

    // Update the timer immediately
    updateTimer();

    // Update the timer every second
    setInterval(updateTimer, 1000);
});