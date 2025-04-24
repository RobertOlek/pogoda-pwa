function getWeather() {
    const city = document.getElementById("city").value.trim();
    const date = document.getElementById("date").value;
    if (!city || !date) return;
  
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
      .then(res => res.json())
      .then(data => {
        if (!data.results || data.results.length === 0) {
          document.getElementById("weather").innerText = "Nie znaleziono miasta.";
          return;
        }
  
        const { latitude, longitude, name, country } = data.results[0];
  
        fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${date}&end_date=${date}&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FWarsaw`)
          .then(res => res.json())
          .then(data => {
            if (!data.daily || !data.daily.temperature_2m_max) {
              document.getElementById("weather").innerText = "Brak danych pogodowych.";
              return;
            }
  
            const max = data.daily.temperature_2m_max[0];
            const min = data.daily.temperature_2m_min[0];
            const info = `📅 ${date}<br>🌍 ${name}, ${country}<br>🌡️ Max: ${max}°C | Min: ${min}°C`;
            document.getElementById("weather").innerHTML = info;
  
            const historyEntry = `${name} (${date}) — Max: ${max}°C, Min: ${min}°C`;
            addToHistory(historyEntry);
          });
      });
  }
  
  function addToHistory(entry) {
    const list = document.getElementById("history");
    const li = document.createElement("li");
    li.textContent = entry;
    list.prepend(li);
  
    // localStorage
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    history.unshift(entry);
    history = history.slice(0, 10); // max 10 wpisów
    localStorage.setItem("weatherHistory", JSON.stringify(history));
  }
  
  function loadHistory() {
    const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    const list = document.getElementById("history");
    list.innerHTML = "";
    history.forEach(entry => {
      const li = document.createElement("li");
      li.textContent = entry;
      list.appendChild(li);
    });
  }
  
  window.onload = loadHistory;
  