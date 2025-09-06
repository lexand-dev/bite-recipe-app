import type { BetterAuthOptions } from "better-auth";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { oAuthProxy } from "better-auth/plugins";

import { db } from "@bite/db/client";

export function initAuth(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;

  discordClientId: string;
  discordClientSecret: string;

  githubClientId: string;
  githubClientSecret: string;
}) {
  const config = {
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    baseURL: options.baseUrl,
    secret: options.secret,
    plugins: [
      oAuthProxy({
        /**
         * Auto-inference blocked by https://github.com/better-auth/better-auth/pull/2891
         */
        currentURL: options.baseUrl,
        productionURL: options.productionUrl,
      }),
      expo(),
      nextCookies(),
    ],
    socialProviders: {
      discord: {
        clientId: options.discordClientId,
        clientSecret: options.discordClientSecret,
        // change to production URL when deploying
        redirectURI: `${options.productionUrl}/api/auth/callback/discord`,
      },
      github: {
        clientId: options.githubClientId,
        clientSecret: options.githubClientSecret,
        // change to production URL when deploying
        redirectURI: `${options.productionUrl}/api/auth/callback/github`,
      },
    },
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },
    trustedOrigins: ["expo://", "bite-recipe-app://"],
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
