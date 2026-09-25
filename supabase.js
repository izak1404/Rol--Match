import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gkgfkicjklwlpboxqlmt.supabase.co'
const supabaseKey = 'sb_publishable_NiQyULzoR2LUb5jRGJNPLg_xl-4sWKT'

export const supabase = createClient(supabaseUrl, supabaseKey)