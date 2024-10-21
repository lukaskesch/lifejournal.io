import NextAuth, { NextAuthOptions, AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "../../../../db/index";
import { users } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
