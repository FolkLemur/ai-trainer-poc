export function getNextWeight(lastSets: any[]) {
  if (!lastSets || lastSets.length === 0) return 0

  // sprawdzamy czy user zrobił target
  const allHitTarget = lastSets.every(
    (set) => set.actual_reps >= set.target_reps
  )

  // KLUCZ: bazujemy na target_weight, NIE actual_weight
  const lastTargetWeight = lastSets[0].target_weight || 0

  if (allHitTarget) {
    return lastTargetWeight + 2.5
  }

  return lastTargetWeight
}
