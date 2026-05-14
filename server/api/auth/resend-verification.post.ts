
import { z } from 'zod'
import { supabase } from '../../utils/supabase'

const config = useRuntimeConfig()

const ResendVerificationSchema = z.object({
  email: z.string().email('Invalid email')
})

export default defineEventHandler(async function (event) {
  const body = await readBody(event)

  const validatedFields = ResendVerificationSchema.safeParse(body)
  if (!validatedFields.success) {
    throw createError({
      statusCode: 400,
      message: validatedFields.error.errors[0].message
    })
  }

  const { email } = validatedFields.data

  try {
    // Check if user exists
    const { data, error: getUserError } = await supabase.auth.admin.getUserByEmail(email)
    
    if (getUserError || !data || !data.user) {
      // For security reasons, we don't reveal if the email exists
      return {
        success: true,
        message: 'If an account exists with this email, a verification link has been sent.'
      }
    }

    const user = data.user

    // Check if email is already verified
    if (user.email_confirmed_at) {
      return {
        success: true,
        message: 'Email is already verified.',
        alreadyVerified: true
      }
    }

    // Resend verification email
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: config.public.siteUrl
      }
    })

    if (resendError) {
      console.error('Resend verification error:', resendError)
      // Still return success for security
    }

    return {
      success: true,
      message: 'If an account exists with this email, a verification link has been sent.'
    }
  } catch (error) {
    console.error('Resend verification error:', error)
    // Always return success for security reasons
    return {
      success: true,
      message: 'If an account exists with this email, a verification link has been sent.'
    }
  }
})
