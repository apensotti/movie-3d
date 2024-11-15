"use client";

import Image from "next/image";
import googleLogo from "@/public/google.png";
import githubLogo from "@/public/github.png";
import { GoogleSignInButton } from "@/components/auth/authButtons";
import { redirect } from "next/navigation";
import { CredentialsForm } from "@/components/auth/credentialsForm";
import { getCsrfToken } from "next-auth/react";

export default function LoginPage() {

    return (
      <div className="w-full flex flex-col items-center justify-center bg-neutral-900 min-h-screen py-2">
        <div className="flex flex-col items-center mt-10 p-10 shadow-xl rounded-lg bg-neutral-850">
          <h1 className="mt-02 mb-4 text-4xl font-bold">Login</h1>
          <CredentialsForm />
          <span className="text-2xl font-semibold text-white text-center mt-8">
            Or
          </span>
          {/* <CredentialsSignInButton /> */}
          <GoogleSignInButton />
        </div>
      </div>
    );
}