export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await useFetch('/api/auth/session')

  if (!session.value?.user) {
    return navigateTo('/admin/login')
  }

  if (session.value.user.role !== 'ADMIN') {
    return navigateTo('/admin/login')
  }
})
