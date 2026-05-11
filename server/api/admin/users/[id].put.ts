import { getCurrentUser, updateUserRole, getUserById } from '../../../utils/auth';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'sb-access-token');
  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const { user, error } = await getCurrentUser(token);
  if (error || !user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, message: 'Forbidden' });
  }

  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, message: 'User ID is required' });
  }

  const body = await readBody(event);
  
  // If role is being updated, use our dedicated function
  if (body.role) {
    const success = await updateUserRole(id, body.role);
    if (!success) {
      throw createError({ statusCode: 500, message: 'Failed to update user role' });
    }
  }

  // Get updated user and return
  const updatedUser = await getUserById(id);
  if (!updatedUser) {
    throw createError({ statusCode: 404, message: 'User not found' });
  }

  return updatedUser;
});
