export function getNextWeight(lastSets: any[]) {
  if (!lastSets || lastSets.length === 0) return 0

  // 🔥 sprawdzamy czy WSZYSTKIE sety spełniają warunki
  const allSetsHit = lastSets.every((set) => {
    const actualReps = set.actual_reps || 0
    const targetReps = set.target_reps || 0

    const actualWeight = set.actual_weight || 0
    const targetWeight = set.target_weight || 0

    return (
      actualReps >= targetReps &&
      actualWeight >= targetWeight
    )
  })

  // 🔥 bierzemy ostatni set (najcięższy / najbardziej reprezentatywny)
  const lastSet = lastSets[lastSets.length - 1]

  // 🔥 bazowy ciężar = lepszy z target vs actual
  const baseWeight = Math.max(
    lastSet.target_weight || 0,
    lastSet.actual_weight || 0
  )

  // ❌ brak progresji jeśli nie dowieziono wszystkich setów
  if (!allSetsHit) {
    return baseWeight
  }

  // ✅ progresja
  const isDumbbell = baseWeight <= 20
  const increment = isDumbbell ? 1 : 2.5

  return baseWeight + increment
}
