"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { handleGoogleSignIn } from "@/lib/auth/googleSignInServerAction";
import { handleCredentialSignin } from "@/lib/auth/credentialsSigninServerAction";

export function GoogleSignInButton() {
  const handleClick = () => {
    signIn("google");
  };

  return (
    <button
      onClick={() => handleGoogleSignIn()}
      className="w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-xl  transition-colors duration-300 bg-neutral-800 text-white rounded-lg focus:shadow-outline hover:bg-orange-500"
    >
      <Image src={"/google.png"} alt="Google Logo" width={20} height={20} />
      <span className="ml-4">Continue with Google</span>
    </button>
  );
}


export function CredentialsSignInButton() {
  const handleClick = () => {
    signIn();
  };

  return (
    <button
      onClick={() => handleCredentialSignin()}
      className="w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-xl transition-colors duration-300 bg-neutral-800  text-white rounded-lg focus:shadow-outline hover:bg-slate-200"
    >
      {/* <Image src={githubLogo} alt="Github Logo" width={20} height={20} /> */}
      <span className="ml-4">Continue with Email</span>
    </button>
  );
}