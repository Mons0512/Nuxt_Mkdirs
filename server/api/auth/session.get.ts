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

  const { data: profile } = await supabase
    .from('users')
    .select('name, image, link, role')
    .eq('id', user.id)
    .single();

  return {
    user: {
      id: user.id,
      email: user.email,
      name: profile?.name || user.user_metadata?.name,
      image: profile?.image || user.user_metadata?.avatar_url,
      link: profile?.link || user.user_metadata?.link,
      role: profile?.role || 'USER',
    },
  };
});
