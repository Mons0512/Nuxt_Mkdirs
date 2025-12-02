import type { Adapter } from '@auth/core/adapters';
import { uuid } from '@sanity/uuid';

/**
 * Sanity Adapter for Auth.js
 * Ported from the original Next.js project
 */
export function SanityAdapter(): Adapter {
  return {
    async createUser(user) {
      try {
        const existingUser = await getUserByEmail(user.email);
        if (existingUser) {
          return {
            ...existingUser,
            id: existingUser._id,
            email: existingUser.email,
            emailVerified: existingUser.emailVerified
              ? new Date(existingUser.emailVerified)
              : null,
          };
        }

        const createdUser = await sanityClient.create({
          _type: 'user',
          _id: `user.${uuid()}`,
          role: 'USER',
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
        });

        return {
          ...createdUser,
          id: createdUser._id,
        };
      } catch (error) {
        console.error('createUser error:', error);
        throw new Error('Failed to create user');
      }
    },

    async getUser(id) {
      try {
        const user = await getUserById(id);
        if (user) {
          return {
            ...user,
            id: user._id,
            email: user.email,
            emailVerified: user.emailVerified
              ? new Date(user.emailVerified)
              : null,
          };
        }
        return null;
      } catch (error) {
        console.error('getUser error:', error);
        return null;
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      try {
        const account = await getAccountByProviderAccountId(providerAccountId, provider);
        if (!account) {
          return null;
        }

        const user = await getUserById(account.userId);
        if (!user) {
          return null;
        }

        return {
          ...user,
          id: user._id,
          email: user.email,
          emailVerified: user.emailVerified
            ? new Date(user.emailVerified)
            : null,
        };
      } catch (error) {
        console.error('getUserByAccount error:', error);
        return null;
      }
    },

    async updateUser(updatedUser) {
      try {
        const existingUser = await getUserById(updatedUser.id!);
        if (!existingUser) {
          throw new Error(`User not found: ${updatedUser.id}`);
        }

        const patchedUser = await sanityClient
          .patch(existingUser._id)
          .set({
            ...existingUser,
            emailVerified: updatedUser.emailVerified === null
              ? undefined
              : updatedUser.emailVerified,
          })
          .commit();

        return patchedUser as any;
      } catch (error) {
        console.error('updateUser error:', error);
        throw new Error('Failed to update user');
      }
    },

    async deleteUser(userId) {
      try {
        await sanityClient.delete(userId);
      } catch (error) {
        console.error('deleteUser error:', error);
        throw new Error('Failed to delete user');
      }
    },

    async linkAccount(account) {
      try {
        const createdAccount = await sanityClient.create({
          _type: 'account',
          userId: account.userId,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refreshToken: account.refresh_token,
          accessToken: account.access_token,
          expiresAt: account.expires_at,
          tokenType: account.token_type,
          scope: account.scope,
          idToken: account.id_token,
          user: {
            _type: 'reference',
            _ref: account.userId,
          },
        });

        const userToUpdate = await sanityClient.getDocument(account.userId);

        const updatedUserAccounts = {
          _type: 'reference',
          _key: `account.${uuid()}`,
          _ref: createdAccount._id,
        };

        await sanityClient
          .patch(userToUpdate!._id)
          .set({
            emailVerified: new Date().toISOString(),
            accounts: updatedUserAccounts,
          })
          .commit();

        return account;
      } catch (error) {
        console.error('linkAccount error:', error);
        throw new Error('Failed to link account');
      }
    },

    async unlinkAccount({ providerAccountId, provider }) {
      try {
        const account = await getAccountByProviderAccountId(providerAccountId, provider);
        if (!account) {
          return;
        }

        const accountUser = await getUserByIdWithAccounts(account.userId);
        if (accountUser) {
          await sanityClient
            .patch(accountUser._id)
            .set({ accounts: null })
            .commit();
        }

        await sanityClient.delete(account._id);
      } catch (error) {
        console.error('unlinkAccount error:', error);
        throw new Error('Failed to unlink account');
      }
    },

    async getUserByEmail(email) {
      try {
        const user = await getUserByEmail(email);
        if (user) {
          return {
            ...user,
            id: user._id,
            email: user.email,
            emailVerified: user.emailVerified
              ? new Date(user.emailVerified)
              : null,
          };
        }
        return null;
      } catch (error) {
        console.error('getUserByEmail error:', error);
        return null;
      }
    },

    async createVerificationToken({ identifier, expires, token }) {
      try {
        const verificationToken = await sanityClient.create({
          _type: 'verificationToken',
          identifier,
          token,
          expires,
        });

        return verificationToken;
      } catch (error) {
        console.error('createVerificationToken error:', error);
        throw new Error('Failed to create verification token');
      }
    },

    async useVerificationToken({ identifier, token }) {
      try {
        const verToken = await getVerificationTokenByIdentifierAndToken(identifier, token);
        if (!verToken) {
          return null;
        }

        await sanityClient.delete(verToken._id);

        return {
          ...verToken,
          id: verToken._id,
          expires: verToken.expires ? new Date(verToken.expires) : null,
          token: verToken.token,
          identifier: verToken.identifier,
        };
      } catch (error) {
        console.error('useVerificationToken error:', error);
        return null;
      }
    },
  };
}
