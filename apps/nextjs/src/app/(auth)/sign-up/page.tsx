import Link from "next/link";

import { DiscordButton } from "~/modules/auth/components/discord-button";
import { GithubButton } from "~/modules/auth/components/github-button";
import { SignUpForm } from "./_components/sign-up-form";

const SignUpPage = () => {
  return (
    <div className="w-full max-w-md">
      <div className="flex h-full flex-col items-center justify-between rounded-md border border-primary px-8 py-24 shadow-md shadow-primary/20">
        <h2 className="mb-8 text-2xl font-semibold">Create your account</h2>
        <SignUpForm />
        <span className="my-4 flex w-full items-center px-4 text-sm text-muted-foreground before:mx-4 before:block before:h-[1px] before:flex-1 before:bg-muted-foreground/50 before:content-[''] after:mx-4 after:block after:h-[1px] after:flex-1 after:bg-muted-foreground/50 after:content-['']">
          OR
        </span>
        <div className="flex w-full flex-col gap-4 px-8">
          <GithubButton />
          <DiscordButton />
        </div>
        <div className="mt-8 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-bold text-primary hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
