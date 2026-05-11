import { supabase } from '../../utils/supabase';
import { clearAuthCookies } from '../../utils/supabase';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'sb-access-token');

  if (token) {
    await supabase.auth.signOut();
  }

  clearAuthCookies(event);

  return { success: true };
});
