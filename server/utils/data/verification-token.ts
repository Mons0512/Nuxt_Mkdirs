/**
 * Verification token data access functions
 */

export interface VerificationToken {
  _id: string;
  _type: 'verificationToken';
  identifier: string;
  token: string;
  expires: string;
}

/**
 * Get verification token by identifier and token
 */
export async function getVerificationTokenByIdentifierAndToken(
  identifier: string,
  token: string
): Promise<VerificationToken | null> {
  try {
    const query = `*[_type == "verificationToken" && identifier == $identifier && token == $token][0]`;
    const verToken = await sanityFetch<VerificationToken>(query, { identifier, token });
    return verToken;
  } catch (error) {
    console.error('getVerificationTokenByIdentifierAndToken error:', error);
    return null;
  }
}

/**
 * Get verification token by email
 */
export async function getVerificationTokenByEmail(email: string): Promise<VerificationToken | null> {
  try {
    const query = `*[_type == "verificationToken" && identifier == $email][0]`;
    const verToken = await sanityFetch<VerificationToken>(query, { email });
    return verToken;
  } catch (error) {
    console.error('getVerificationTokenByEmail error:', error);
    return null;
  }
}

/**
 * Get verification token by token
 */
export async function getVerificationTokenByToken(token: string): Promise<VerificationToken | null> {
  try {
    const query = `*[_type == "verificationToken" && token == $token][0]`;
    const verToken = await sanityFetch<VerificationToken>(query, { token });
    return verToken;
  } catch (error) {
    console.error('getVerificationTokenByToken error:', error);
    return null;
  }
}
