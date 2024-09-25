"use server";

import { signIn } from "./authConfig";

export const handleCredentialSignin = async () => {
  try {
    await signIn("credentials", { redirectTo: "/" });
  } catch (error) {
    throw error;
  }
};