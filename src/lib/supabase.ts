import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fuchzqapqauerudxoawy.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'super_admin' | 'admin'
          company_id: string | null
          created_at: string
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          owner_name: string
          company_type: string
          created_at: string
          is_active: boolean
        }
      }
      calls: {
        Row: {
          id: string
          company_id: string
          type: 'inbound' | 'outbound'
          duration: number
          status: string
          created_at: string
          caller_name: string | null
          caller_phone: string | null
        }
      }
      appointments: {
        Row: {
          id: string
          company_id: string
          client_name: string
          scheduled_at: string
          status: string
          created_at: string
        }
      }
      leads: {
        Row: {
          id: string
          company_id: string
          name: string
          email: string | null
          phone: string | null
          source: string
          status: string
          created_at: string
        }
      }
    }
  }
}
