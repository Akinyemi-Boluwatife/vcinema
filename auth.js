import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { createServiceRoleClient } from "./app/_lib/supabase";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ account, profile }) {
      if (account.provider !== "google") return true;
      return profile.email_verified === true;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        try {
          const supabase = createServiceRoleClient();
          const { data, error } = await supabase
            .from("users")
            .upsert(
              {
                email: profile.email,
                name: profile.name,
                image: profile.picture,
                provider: "google",
                provider_id: profile.sub,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "email" }
            )
            .select("id")
            .single();
          if (error) console.error("Failed to upsert user to Supabase:", error);
          if (data?.id) token.userId = data.id;
        } catch (err) {
          console.error("Supabase user upsert threw:", err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.userId) session.user.id = token.userId;
      return session;
    },
  },
});
