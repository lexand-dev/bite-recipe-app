import Link from "next/link";

import { SignInForm } from "./_components/sign-in-form";

const SignInPage = () => {
  return (
    <div className="w-full max-w-md">
      <div className="flex h-full flex-col items-center justify-between rounded-md border border-primary px-8 py-24 shadow-md shadow-primary/20">
        <h1 className="mb-8 text-2xl font-semibold">Sign In</h1>
        <SignInForm />
        <p className="mt-8 text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/sign-up" className="font-medium underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
