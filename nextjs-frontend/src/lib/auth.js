import CredentialsProvider from "next-auth/providers/credentials";
import { postRequest } from "./api";
import apiRoutes from "@/routes/api-route";

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const result = await postRequest(apiRoutes.LOGIN, credentials);

        if (result?.status == false) return Promise.reject(new Error(result?.message));
        let obj = { user: result?.data, token: result?.token };

        return obj;
      },
    }),
  ],

  /**
   * @link https://next-auth.js.org/configuration/callbacks#jwt-callback
   */
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (token?.user) session.user = token.user;
      if (token?.token) session.token = token.token;
      return session;
    },
    jwt: async ({ user, token, trigger, session }) => {
      if (trigger === "update") {
        return { ...token, user: { ...session } };
      }
      return { ...token, ...user };
    },
  },
};
