/* FILE: weatherapp.js — Simulated local weather forecaster and 5-day outlook */
(function() {
  const CONDITIONS = [
    { name: 'Sunny', icon: '☀️', tempRange: [24, 34] },
    { name: 'Cloudy', icon: '⛅', tempRange: [18, 26] },
    { name: 'Rainy', icon: '🌧️', tempRange: [15, 22] },
    { name: 'Snowy', icon: '❄️', tempRange: [0, 8] }
  ];

  let weatherData = null;

  function generateWeather(seedOffset = 0) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const condIdx = (Math.floor(Date.now() / 3600000) + seedOffset) % CONDITIONS.length;
    const currentCond = CONDITIONS[condIdx];
    const currentTemp = Math.floor(Math.random() * (currentCond.tempRange[1] - currentCond.tempRange[0])) + currentCond.tempRange[0];

    const forecast = [];
    for (let i = 1; i <= 5; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const dayName = days[d.getDay()];
      const fCond = CONDITIONS[(condIdx + i) % CONDITIONS.length];
      const maxT = Math.floor(Math.random() * (fCond.tempRange[1] - fCond.tempRange[0])) + fCond.tempRange[0];
      const minT = maxT - Math.floor(Math.random() * 6 + 3);
      forecast.push({ day: dayName, condition: fCond.name, icon: fCond.icon, maxT, minT });
    }

    return {
      location: 'Metropolis (Local)',
      condition: currentCond.name,
      icon: currentCond.icon,
      temp: currentTemp,
      forecast
    };
  }

  function render(container) {
    if (!weatherData) weatherData = generateWeather();

    const forecastHtml = weatherData.forecast.map(f => `
      <div class="forecast-row">
        <span style="font-weight: 500; width: 45px;">${f.day}</span>
        <span style="font-size: 18px;">${f.icon}</span>
        <span style="color: var(--text-muted); font-size: 13px; flex: 1; margin-left: 10px;">${f.condition}</span>
        <span style="font-weight: 600;">${f.maxT}° <span style="color: var(--text-muted); font-weight: 400; font-size: 12px;">/ ${f.minT}°</span></span>
      </div>
    `).join('');

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between;">
        <div>
          <div class="weather-hero">
            <div style="font-size: 14px; color: var(--text-muted);">${weatherData.location}</div>
            <div style="font-size: 48px; margin: 4px 0;">${weatherData.icon}</div>
            <div class="weather-temp">${weatherData.temp}°C</div>
            <div style="font-size: 16px; font-weight: 500; color: var(--text-muted);">${weatherData.condition}</div>
          </div>
          <div class="forecast-list">
            ${forecastHtml}
          </div>
        </div>
        <button id="weather-refresh-btn" class="btn-primary" style="margin-top: 14px; width: 100%;">🔄 Refresh Weather</button>
      </div>
    `;

    container.querySelector('#weather-refresh-btn').onclick = () => {
      weatherData = generateWeather(Math.floor(Math.random() * 100) + 1);
      window.animations.showToast('Weather updated');
      render(container);
    };
  }

  window.weatherApp = {
    mount(container) {
      render(container);
    },

    unmount() {}
  };
})();
