export default defineNuxtRouteMiddleware(async (to) => {
  // 首先检查要去的是否是登录页面
  if (to.path === '/admin/login') {
    // 如果已经登录并且是ADMIN，直接跳转到后台首页
    const { data: session } = await useFetch('/api/auth/session')
    if (session.value?.user?.role === 'ADMIN') {
      return navigateTo('/admin')
    }
    // 否则继续前往登录页
    return
  }

  // 对其他admin页面进行权限检查
  const { data: session } = await useFetch('/api/auth/session')

  if (!session.value?.user) {
    return navigateTo('/admin/login')
  }

  if (session.value.user.role !== 'ADMIN') {
    return navigateTo('/admin/login')
  }
})
