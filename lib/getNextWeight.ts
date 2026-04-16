export function getNextWeight(lastSets: any[]) {
  if (!lastSets || lastSets.length === 0) return 0

  const last = lastSets[0]

  // PRIORYTET: user target
  const baseWeight = Math.max(
  lastSet.target_weight || 0,
  lastSet.actual_weight || 0
)

  const targetReps = last.target_reps || 0
  const actualReps = last.actual_reps || 0

  // czy osiągnięto target?
  const hitTarget = actualReps >= targetReps

  if (!hitTarget) {
    return baseWeight
  }

  // progresja
  const isDumbbell = baseWeight <= 20 // prosty heuristic (możemy poprawić później)

  const increment = isDumbbell ? 1 : 2.5

  return baseWeight + increment
}
