/**
 * Account data access functions
 */

export interface Account {
  _id: string;
  _type: 'account';
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refreshToken?: string;
  accessToken?: string;
  expiresAt?: number;
  tokenType?: string;
  scope?: string;
  idToken?: string;
}

/**
 * Get account by user ID
 */
export async function getAccountByUserId(userId: string): Promise<Account | null> {
  try {
    const query = `*[_type == "account" && userId == $userId][0]`;
    const account = await sanityFetch<Account>(query, { userId });
    return account;
  } catch (error) {
    console.error('getAccountByUserId error:', error);
    return null;
  }
}

/**
 * Get account by provider account ID
 */
export async function getAccountByProviderAccountId(
  providerAccountId: string,
  provider: string
): Promise<Account | null> {
  try {
    const query = `*[_type == "account" && providerAccountId == $providerAccountId && provider == $provider][0]`;
    const account = await sanityFetch<Account>(query, { providerAccountId, provider });
    return account;
  } catch (error) {
    console.error('getAccountByProviderAccountId error:', error);
    return null;
  }
}
