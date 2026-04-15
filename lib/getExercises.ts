import { supabase } from './supabase'

export async function getExercises() {
  const { data, error } = await supabase
    .from('exercises')
    .select('id, name')

  if (error) {
    console.error('getExercises error:', error)
    return []
  }

  return data
}
