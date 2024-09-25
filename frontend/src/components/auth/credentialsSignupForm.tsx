"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { PrismaClient } from "@prisma/client"; // Make sure Prisma is correctly set up
import { register } from "@/lib/actions/register";

interface CredentialsFormProps {
  csrfToken?: string;
}

const prisma = new PrismaClient(); // Initialize Prisma Client

export function CredentialsSignupForm(props: CredentialsFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const ref = useRef<HTMLFormElement>(null);

  // First form submission, only capture email
  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const emailValue = data.get("email");

    // Show password input after the first submission
    if (emailValue) {
      setEmail(emailValue.toString());
      setPasswordVisible(true);
    } else {
      setError("Please enter a valid email.");
    }
  };

  // Second form submission, create user in Prisma
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const password = data.get("password");

    if (email && password) {
      try {
          const r = await register({
            email: data.get("email"),
            password: data.get("password")
          });
          console.log(r);
          
        if (r) {
          // Optionally sign the user in after creation
          const signInResponse = await signIn("credentials", {
            email,
            password: password.toString(),
            redirect: false,
          });
          ref.current?.reset();
          if (signInResponse && !signInResponse.error) {
            router.push("/login"); // Redirect to homepage after successful sign-up
          } else {
            setError("Error signing in the user.");
          }
        }
      } catch (err) {
        console.error("Error creating user:", err);
        setError("Error creating user, user might already exist.");
      }
    } else {
      setError("Please enter both email and password.");
    }
  };

  return (
    <form
      className="w-full mt-8 text-xl text-black font-semibold flex flex-col"
      onSubmit={passwordVisible ? handlePasswordSubmit : handleEmailSubmit} // Conditional form submission
    >
      {error && (
        <span className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md">
          {error}
        </span>
      )}

      {/* Email input is always shown */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        defaultValue={email || ""} // Show email if already submitted
        className="w-full px-4 py-4 mb-2 border border-neutral-700 bg-neutral-800 text-white rounded-lg"
      />

      {/* Password input, only shown after first submission */}
      {passwordVisible && (
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full px-4 py-4 mb-1 border border-neutral-700 bg-neutral-800 text-white rounded-lg"
        />
      )}

      <button
        type="submit"
        className="w-full h-12 px-6 mt-2 text-lg text-white transition-colors duration-150 bg-violet-800 rounded-lg focus:shadow-outline hover:bg-orange-500"
      >
        {passwordVisible ? "Sign Up" : "Continue"} {/* Update button text */}
      </button>
    </form>
  );
}
