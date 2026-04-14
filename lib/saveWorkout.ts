import { supabase } from './supabase'

export async function saveWorkout(exercises: any[]) {
  // 1. create session
  const { data: session, error: sessionError } = await supabase
    .from('workout_sessions')
    .insert({})
    .select()
    .single()

  if (sessionError) {
    console.error('session error:', sessionError)
    return
  }

  const sessionId = session.id

  // 2. prepare sets
  const sets = exercises.flatMap((exercise) =>
    exercise.sets.map((set: any, index: number) => ({
      session_id: sessionId,
      exercise_id: null, // poprawimy później
      set_number: index + 1,
      actual_reps: set.reps,
      actual_weight: set.weight,
      target_weight: set.targetWeight,
      target_reps: set.targetReps,
    }))
  )

  // 3. save sets
  const { error: setsError } = await supabase
    .from('workout_sets')
    .insert(sets)

  if (setsError) {
    console.error('sets error:', setsError)
  }

  console.log('Workout saved 🔥')
}
