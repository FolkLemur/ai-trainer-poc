import { supabase } from "./supabase"

export async function getLastWorkoutSession() {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from("workout_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("getLastWorkoutSession error:", error)
    return null
  }

  return data
}