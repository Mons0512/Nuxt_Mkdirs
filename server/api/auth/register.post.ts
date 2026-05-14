
import { z } from 'zod'
import { supabase } from '../../utils/supabase'

const config = useRuntimeConfig()

const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export default defineEventHandler(async function (event) {
  const body = await readBody(event)

  const validatedFields = RegisterSchema.safeParse(body)
  if (!validatedFields.success) {
    throw createError({
      statusCode: 400,
      message: validatedFields.error.errors[0].message
    })
  }

  const { name, email, password } = validatedFields.data

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role: 'USER'
      },
      emailRedirectTo: config.public.siteUrl
    }
  })

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return {
    success: true,
    message: data.user?.email_confirmed_at 
      ? 'Account created successfully!' 
      : 'Confirmation email sent! Please check your email.'
  }
})
