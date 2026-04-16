import { supabase } from "./supabase"

export async function getLastWorkoutSession() {
  const { data, error } = await supabase
    .from("workout_sessions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("getLastWorkoutSession error:", error)
    return null
  }

  return data
}
