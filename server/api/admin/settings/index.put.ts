import { supabaseAdmin } from '../../../utils/supabase'
import { getCurrentUser } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'sb-access-token')
  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const { user, error } = await getCurrentUser(token)
  if (error || !user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const body = await readBody(event)

  // Upsert each setting
  for (const [key, value] of Object.entries(body)) {
    const jsonValue = JSON.stringify(value)
    const { error: dbError } = await supabaseAdmin
      .from('settings')
      .upsert({ key, value: jsonValue, updated_at: new Date().toISOString() }, { onConflict: 'key' })

    if (dbError) {
      console.error(`Failed to update setting ${key}`, dbError)
      throw createError({ statusCode: 500, message: `Failed to update setting: ${key}` })
    }
  }

  return { success: true }
})
