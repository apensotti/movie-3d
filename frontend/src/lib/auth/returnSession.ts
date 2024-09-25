"use server";

import { auth } from "./authConfig";

export const returnSession = async () => {
  const session = await auth();
  return session;
};