import { getServerSession } from 'next-auth';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { user } from '../db/migrations/schema';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Fetch the user from the database
        const dbUser = await db
          .select()
          .from(user)
          .where(eq(user.email, credentials.email))
          .limit(1);
        
        if (dbUser.length === 0) {
          throw new Error('Invalid email or password');
        }

        const foundUser = dbUser[0];

        // If the password is empty, the user should log in using Google
        if (!foundUser.password) {
          throw new Error('You are registered with us through Google. Please use Google to sign in.');
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(credentials.password, foundUser.password);

        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }
        
        // Return the user object if valid
        return {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
        };
      },
    }),
  ],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user id to the token if it's a credentials login
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user id to session from token
      session.user.id = token.id;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
};

export default NextAuth(authOptions);

export async function auth() {
  return await getServerSession(authOptions);
}
