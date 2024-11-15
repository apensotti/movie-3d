"use client";

import { GoogleSignInButton } from "@/components/auth/authButtons";
import { CredentialsSignupForm } from "@/components/auth/credentialsSignupForm";

export default function LoginPage() {

    return (
      <div className="w-full flex flex-col items-center justify-center bg-neutral-900 min-h-screen py-2">
        <div className="flex flex-col items-center mt-10 p-10 shadow-xl bg-neutral-850 rounded-lg">
          <h1 className="mt-02 mb-4 text-4xl font-bold">Signup</h1>
          <CredentialsSignupForm />
          <span className="text-2xl font-semibold text-white text-center mt-8">
            Or
          </span>
          {/* <CredentialsSignInButton /> */}
          <GoogleSignInButton />
        </div>
      </div>
    );
}