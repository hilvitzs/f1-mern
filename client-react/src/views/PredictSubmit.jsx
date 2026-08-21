import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export function PredictSubmit() {
  const [races, setRaces] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [selectedRound, setSelectedRound] = useState('');
  const [podium, setPodium] = useState(['', '', '']);

  const authStore = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [racesRes, driversRes] = await Promise.all([
          fetch('/api/races/2026'),
          fetch('/api/drivers/2026'),
        ]);

        if (!racesRes.ok || !driversRes.ok) {
          const failedResponse = !racesRes.ok ? racesRes : driversRes;
          const errorData = await failedResponse.json();
          throw new Error(errorData.message || 'Failed to load race or driver data');
        }

        const racesData = await racesRes.json();
        const driversData = await driversRes.json();

        setRaces(racesData.MRData.RaceTable.Races);
        setDrivers(driversData.MRData.DriverTable.Drivers);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (podium.some((d) => !d)) {
      setError('Please select all three podium positions');
      return;
    }

    const selectedRace = races.find((race) => race.round === selectedRound);
    if (!selectedRace) {
      setError('Please select a race');
      return;
    }

    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify({
          season: Number(selectedRace.season),
          round: Number(selectedRound),
          predictedPodium: podium,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit prediction');
      }

      setSuccessMessage('Prediction submitted!');
      setSelectedRound('');
      setPodium(['', '', '']);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>Submit a Prediction</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="race">Race</label>
          <select
            id="race"
            value={selectedRound}
            onChange={(e) => setSelectedRound(e.target.value)}
          >
            <option value="" disabled>
              Select a race
            </option>
            {races.map((race) => (
              <option value={race.round} key={race.round}>
                {race.round} - {race.raceName}
              </option>
            ))}
          </select>
        </div>
        {podium.map((_, index) => (
          <div key={`podium-${index}`}>
            <label htmlFor={`podium-${index}`}>Position {index + 1}</label>
            <select
              id={`podium-${index}`}
              value={podium[index]}
              onChange={(e) =>
                setPodium((prev) => {
                  const updated = [...prev];
                  updated[index] = e.target.value;
                  return updated;
                })
              }
            >
              <option value="" disabled>
                Select a driver
              </option>
              {drivers.map((driver) => (
                <option value={driver.driverId} key={driver.driverId}>
                  {driver.givenName} {driver.familyName}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button type="submit">Submit prediction</button>

        {error && <p>{error}</p>}
        {successMessage && <p>{successMessage}</p>}
      </form>
    </>
  );
}
