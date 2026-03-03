import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // For MVP: accept demo credentials
        if (credentials.email === 'walibdpro@gmail.com' && credentials.password === 'SitePass@123') {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (user) {
            return user;
          }

          // Create user if not exists
          const newUser = await prisma.user.create({
            data: {
              email: credentials.email,
              name: 'Wali',
            },
          });
          return newUser;
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};

export default NextAuth(authOptions);