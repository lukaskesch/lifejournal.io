import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "../../../../../db/index";
import { users } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";

const handler = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const userArray = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.username))
          .limit(1);

        const user = userArray[0];

        console.log(user);
        if (!user) {
          return null;
        }

        // const isPasswordValid = await bcrypt.compare(
        //   credentials.password,
        //   user.password,
        // );
        //
        // if (!isPasswordValid) {
        //   return null;
        // }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  // session: {
  //   strategy: "database",
  //   maxAge: 30 * 24 * 60 * 60, // 30 days
  //   updateAge: 24 * 60 * 60, // 24 hours
  // },
  // secret: process.env.NEXTAUTH_SECRET,
  // callbacks: {
  //   session: async ({ session, user }) => {
  //     if (session?.user) {
  //       session.user.id = user.id;
  //     }
  //     return session;
  //   },
  // },
});

export { handler as GET, handler as POST };
