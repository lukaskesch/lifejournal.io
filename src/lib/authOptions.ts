import { NextAuthOptions, Session, User, Account } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { users } from "../db/schema";
import db from "@/db";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile'
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      if (!user.email) return false;
      if (!account?.provider) return false;
      if (!db) return false;
      
      try {
        // Check if user exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .limit(1)
          .then(res => res[0]);

        if (!existingUser) {
          // Create new user
          await db.insert(users).values({
            id: uuidv4(),
            googleUserId: account.provider === 'google' ? account.providerAccountId : null,
            email: user.email,
            name: user.name || null,
            image: user.image || null,
          });
        } else {
          // Update existing user
          await db
            .update(users)
            .set({
              name: user.name || existingUser.name,
              image: user.image || existingUser.image,
            })
            .where(eq(users.email, user.email));
        }
        
        return true;
      } catch (error) {
        console.error('Error in signIn:', error);
        return false;
      }
    },
    async session({ session }: { session: Session }): Promise<Session> {
      if (session.user?.email && db) {
        try {
          const dbUser = await db
            .select()
            .from(users)
            .where(eq(users.email, session.user.email))
            .limit(1)
            .then(res => res[0]);

          if (dbUser) {
            session.user.id = dbUser.id;
          }
        } catch (error) {
          console.error('Error fetching user session:', error);
        }
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET
};
