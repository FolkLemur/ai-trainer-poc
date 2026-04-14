import { supabase } from './supabase'

export async function getFirstPlanDay() {
  const { data, error } = await supabase
    .from('plan_days')
    .select(`
      id,
      name,
      order_index,
      plan_exercises (
        order_index,
        target_sets,
        target_reps,
        exercises (
          name,
          rest_time
        )
      )
    `)
    .order('order_index', { ascending: true })
    .limit(1)

  if (error) {
    console.error(error)
    return null
  }

  return data
}
