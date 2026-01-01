import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


// Stub Prisma client
const prisma = {
  user: {
    findUnique: async ({ where }: { where: { email: string } }) => {
      // Minimal stub: only allow admin@example.com
      if (where.email === "admin@example.com") {
        return {
          id: "1",
          email: "admin@example.com",
          name: "Admin",
          password: "password", // plaintext for stub only
        };
      }
      return null;
    },
  },
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (user && credentials.password === user.password) {
          return { id: user.id, name: user.name, email: user.email };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
