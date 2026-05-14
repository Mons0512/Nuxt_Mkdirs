import { supabaseAdmin } from '../../utils/supabase';

// 这个API端点只用于设置第一个管理员
// 在生产环境中使用后应该删除或禁用
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { userId } = body;

    if (!userId) {
      throw createError({
        statusCode: 400,
        message: 'User ID is required'
      });
    }

    // 获取用户并检查
    const { data: { user }, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (getUserError || !user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      });
    }

    // 更新用户角色为ADMIN
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          ...user.user_metadata,
          role: 'ADMIN',
        }
      }
    );

    if (updateError) {
      console.error('Failed to update user role:', updateError);
      throw createError({
        statusCode: 500,
        message: 'Failed to update user role'
      });
    }

    return {
      success: true,
      message: 'User has been promoted to ADMIN',
      user: {
        id: user.id,
        email: user.email,
        role: 'ADMIN'
      }
    };
  } catch (error: any) {
    console.error('Setup admin error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    });
  }
});
