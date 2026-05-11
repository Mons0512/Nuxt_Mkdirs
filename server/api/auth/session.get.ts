import { supabase } from '../../utils/supabase';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'sb-access-token');

  if (!token) {
    return { user: null };
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    deleteCookie(event, 'sb-access-token');
    return { user: null };
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.user_metadata?.full_name,
      image: user.user_metadata?.avatar_url,
      link: user.user_metadata?.link,
      role: user.user_metadata?.role || 'USER',
    },
  };
});
