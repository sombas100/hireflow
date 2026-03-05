import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs"; 

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }, 
      },

      async authorize(credentials) {
       
        const email = typeof credentials?.email === "string"
          ? credentials.email.toLowerCase().trim()
          : "";

        const password = typeof credentials?.password === "string"
          ? credentials.password
          : "";

        const role = typeof credentials?.role === "string"
          ? credentials.role
          : undefined;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, name: true, passwordHash: true, role: true, email: true },
        });

        if (!user?.passwordHash) return null;

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return null;

        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, 
        };
      },
    }),
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});