import { useState, useEffect } from 'react';

export function Home() {
  const [races, setRaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await fetch('/api/races/2026');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'There was a problem fetching races');
        }

        const data = await response.json();
        setRaces(data.MRData.RaceTable.Races);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRaces();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (races.length === 0) {
    return <p>No races returned</p>;
  }

  return (
    <>
      {races.map((race) => (
        <div key={race.round}>
          Round {race.round} - {race.raceName} ({race.date})
        </div>
      ))}
    </>
  );
}
