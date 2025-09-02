import { useState } from "react";
import useFetch from "./hooks/useFetch";
import useLocalStorage from "./hooks/useLocalStorage";
import useToggle from "./hooks/useToggle";
import useWindowSize from "./hooks/useWindowSize";
import "./App.css";

export default function App() {
  const [city, setCity] = useLocalStorage("lastCity", "Jakarta");
  const [input, setInput] = useState("");
  const [unit, toggleUnit] = useToggle(true);
  const size = useWindowSize();

  // Step 1: geocoding
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
  const { data: geoData, loading: geoLoading } = useFetch(geoUrl);

  const lat = geoData?.results?.[0]?.latitude;
  const lon = geoData?.results?.[0]?.longitude;

  // Step 2: weather
  const weatherUrl =
    lat && lon
      ? `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius&timezone=auto`
      : null;
  const { data: weatherData, loading: weatherLoading } = useFetch(weatherUrl);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      setCity(input);
      setInput("");
    }
  };

  const temp = weatherData?.current_weather?.temperature;
  const tempDisplay =
    temp != null ? (unit ? temp : temp * 1.8 + 32).toFixed(1) : null;

  return (
    <div className="app">
      <h1>Aplikasi Cuaca</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Masukkan kota..."
        />
        <button type="submit">Cari</button>
      </form>

      {geoLoading && <p>Mencari lokasi...</p>}
      {weatherLoading && <p>Loading cuaca...</p>}

      {weatherData?.current_weather && (
        <div className="weather-card">
          <h2>{city}</h2>
          <p>Suhu: {tempDisplay}° {unit ? "C" : "F"}</p>
          <p>Angin: {weatherData.current_weather.windspeed} km/h</p>
          <button onClick={toggleUnit}>
            Ubah ke °{unit ? "F" : "C"}
          </button>
        </div>
      )}

      <p className="screen">
        Lebar: {size.width}px | Tinggi: {size.height}px
      </p>
    </div>
  );
}