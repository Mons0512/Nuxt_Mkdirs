/**
 * User data access functions
 */
import type { Account } from './account';

export interface User {
  _id: string;
  _type: 'user';
  name?: string;
  email: string;
  password?: string;
  image?: string;
  emailVerified?: string;
  role?: 'USER' | 'ADMIN';
  link?: string;
}

export interface UserWithAccounts extends User {
  accounts?: Account[];
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const query = `*[_type == "user" && email == $email][0]`;
    const user = await sanityFetch<User>(query, { email });
    return user;
  } catch (error) {
    console.error('getUserByEmail error:', error);
    return null;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const query = `*[_type == "user" && _id == $userId][0]`;
    const user = await sanityFetch<User>(query, { userId });
    return user;
  } catch (error) {
    console.error('getUserById error:', error);
    return null;
  }
}

/**
 * Get user by ID with accounts
 */
export async function getUserByIdWithAccounts(userId: string): Promise<UserWithAccounts | null> {
  try {
    const query = `*[_type == "user" && _id == $userId][0] {
      ...,
      accounts[]->
    }`;
    const user = await sanityFetch<UserWithAccounts>(query, { userId });
    return user;
  } catch (error) {
    console.error('getUserByIdWithAccounts error:', error);
    return null;
  }
}
