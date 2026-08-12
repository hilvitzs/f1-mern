export function scorePrediction(predictedPodium, actualPodium) {
  let points = 0;

  predictedPodium.forEach((driverId, index) => {
    if (actualPodium[index] === driverId) {
      points += 3; // exact position match
    } else if (actualPodium.includes(driverId)) {
      points += 1; // right driver, wrong position
    }
  });

  return points;
}