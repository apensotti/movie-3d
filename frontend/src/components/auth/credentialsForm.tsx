"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

interface CredentialsFormProps {
  csrfToken?: string;
}

export function CredentialsForm(props: CredentialsFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Define the event type as React.FormEvent<HTMLFormElement>
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const signInResponse = await signIn("credentials", {
      email: data.get("email"),
      password: data.get("password"),
      redirect: false,
    });

    if (signInResponse && !signInResponse.error) {
      //Redirect to homepage (/timeline)
      router.push("/");
    } else {
      console.log("Error: ", signInResponse);
      setError("Your Email or Password is wrong!");
    }
  };

  return (
    <form
      className="w-full mt-8 text-xl text-black font-semibold flex flex-col"
      onSubmit={handleSubmit}
    >
      {error && (
        <span className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md">
          {error}
        </span>
      )}
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="w-full px-4 py-4 mb-4 border border-neutral-700 bg-neutral-800 text-white rounded-lg"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="w-full px-4 py-4 mb-1 border border-neutral-700 bg-neutral-800 text-white rounded-lg"
      />

      <a className="text-sm flex justify-end text-blue-700">forgot password?</a>

      <button
        type="submit"
        className="w-full h-12 px-6 mt-4 text-lg text-white transition-colors duration-150 bg-violet-800 rounded-lg focus:shadow-outline hover:bg-orange-500"
      >
        Log in
      </button>
    </form>
  );
}
