import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';

const authOptions = NextAuth({
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
            // Return compatible user object
            return {
              id: user.id,
              email: user.email || credentials.email,
              name: user.name || 'Wali',
            };
          }

          // Create user if not exists
          const newUser = await prisma.user.create({
            data: {
              email: credentials.email,
              name: 'Wali',
            },
          });
          
          return {
            id: newUser.id,
            email: newUser.email || credentials.email,
            name: newUser.name || 'Wali',
          };
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
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
});

export { authOptions as GET, authOptions as POST };