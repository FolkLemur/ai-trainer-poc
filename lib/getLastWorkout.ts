import { supabase } from './supabase'

export async function getLastSetsForExercise(exerciseId: string) {
  const { data, error } = await supabase
    .from('workout_sets')
    .select('*')
    .eq('exercise_id', exerciseId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getLastSets error:', error)
    return []
  }

  if (!data || data.length === 0) return []

  // znajdź najnowszy session_id
  const lastSessionId = data[0].session_id

  // zwróć tylko sety z tej sesji
  const lastSessionSets = data.filter(
    (set) => set.session_id === lastSessionId
  )

  // opcjonalnie: posortuj sety poprawnie
  return lastSessionSets.sort((a, b) => a.set_number - b.set_number)
}
