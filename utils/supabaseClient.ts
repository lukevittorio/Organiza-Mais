import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'

const supabaseUrl = 'https://ilgmnrwuirdllnzristw.supabase.co'
const supabasePublishableKey = 'sb_publishable_wLI7GVy6NXAach6KAL9JRw_JIY57Hzt'

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        lock: processLock,
    },
})