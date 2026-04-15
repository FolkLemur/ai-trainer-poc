export function getNextWeight(lastSets: any[]) {
  if (!lastSets || lastSets.length === 0) return 0

  const allHitTarget = lastSets.every(
    (set) => set.actual_reps >= set.target_reps
  )

  const lastWeight = lastSets[0].actual_weight || 0

  if (allHitTarget) {
    return lastWeight + 2.5
  }

  return lastWeight
}
