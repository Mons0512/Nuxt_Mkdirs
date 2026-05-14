export default defineNuxtRouteMiddleware(async function (to, from) {
  if (!process.client) {
    return
  }

  const { $supabase } = useNuxtApp()
  const auth = useAuth()

  const error = to.query.error
  const errorDescription = to.query.error_description
  const errorCode = to.query.error_code
  const token = to.query.token
  const type = to.query.type

  if (error || errorCode) {
    console.error('Auth callback error:', error, errorCode, errorDescription)
    
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    
    const authError = useState('auth-error', function () { return '' })
    
    if (errorCode === 'otp_expired' || (errorDescription && errorDescription.toLowerCase().includes('expired'))) {
      authError.value = 'Verification link has expired. Please request a new verification email.'
    } else {
      authError.value = errorDescription || error || 'Authentication failed. Please try again.'
    }
    
    return
  }

  if (token && type) {
    try {
      console.log('Processing verification link with token and type:', type)
      
      const { data, error: verifyError } = await $supabase.auth.verifyOtp({
        token_hash: token as string,
        type: type as any,
      })
      
      if (verifyError) {
        console.error('Error verifying OTP:', verifyError)
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, document.title, window.location.pathname)
        }
        const authError = useState('auth-error', function () { return '' })
        authError.value = 'Verification failed or link expired. Please request a new verification email.'
        return
      }

      if (data.session) {
        console.log('Verification successful, got session')
        const response = await $fetch('/api/auth/callback/hash', {
          method: 'POST',
          body: { 
            access_token: data.session.access_token, 
            refresh_token: data.session.refresh_token,
            type: type as string,
          }
        })

        if (response.success) {
          console.log('Session sent to server, cookie set')
          await auth.fetchSession()
          
          if (typeof window !== 'undefined') {
            window.history.replaceState({}, document.title, window.location.pathname)
          }
          
          return navigateTo('/', { replace: true })
        }
      }
    } catch (err) {
      console.error('Failed to process verification:', err)
      
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, document.title, window.location.pathname)
      }
      
      const authError = useState('auth-error', function () { return '' })
      let errorMessage = ''
      if (err && typeof err === 'object') {
        errorMessage = (err as any).data?.message || (err as any).message || ''
      }
      const isExpired = errorMessage.toLowerCase().includes('expired') || 
                       errorMessage.toLowerCase().includes('invalid')
      
      if (isExpired) {
        authError.value = 'Verification link has expired. Please request a new verification email.'
      } else {
        authError.value = 'Verification failed. Please try again or request a new verification email.'
      }
    }
    return
  }

  try {
    let session = null
    
    const { data: { session: supabaseSession }, error: sessionError } = await $supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Error getting session:', sessionError)
    } else if (supabaseSession) {
      session = supabaseSession
    }

    if (!session && typeof window !== 'undefined' && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      
      if (accessToken && refreshToken) {
        console.log('Found access token in URL hash, setting session')
        const { data: setSessionData, error: setSessionError } = await $supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        
        if (setSessionError) {
          console.error('Error setting session from hash:', setSessionError)
        } else if (setSessionData.session) {
          session = setSessionData.session
        }
      }
    }

    if (session) {
      console.log('Processing session callback')
      const response = await $fetch('/api/auth/callback/hash', {
        method: 'POST',
        body: { 
          access_token: session.access_token, 
          refresh_token: session.refresh_token,
          type: session.user.email_confirmed_at ? 'signup' : undefined
        }
      })

      if (response.success) {
        console.log('Session sent to server, cookie set')
        await auth.fetchSession()
        
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, document.title, window.location.pathname)
        }
        
        return navigateTo('/', { replace: true })
      }
    }
  } catch (err) {
    console.error('Failed to process auth callback:', err)
    
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    
    const authError = useState('auth-error', function () { return '' })
    let errorMessage = ''
    if (err && typeof err === 'object') {
      errorMessage = (err as any).data?.message || (err as any).message || ''
    }
    const isExpired = errorMessage.toLowerCase().includes('expired') || 
                     errorMessage.toLowerCase().includes('invalid')
    
    if (isExpired) {
      authError.value = 'Verification link has expired. Please request a new verification email.'
    } else {
      authError.value = 'Verification failed. Please try again or request a new verification email.'
    }
  }
})
