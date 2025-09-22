import { createClient } from '@/lib/supabase/browser'
import { User } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

export const signUp = async (email: string, password: string, name: string) => {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  if (error) throw error
  return data
}

export const signIn = async (email: string, password: string) => {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export const signOut = async () => {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async (): Promise<User | null> => {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  
  return user
}

export const resetPassword = async (email: string) => {
  const supabase = createClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) throw error
}

export const updatePassword = async (password: string) => {
  const supabase = createClient()
  
  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) throw error
}

export const updateProfile = async (updates: { name?: string; avatar_url?: string }) => {
  const supabase = createClient()
  
  const { error } = await supabase.auth.updateUser({
    data: updates,
  })

  if (error) throw error
}