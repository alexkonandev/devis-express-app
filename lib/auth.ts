// lib/auth.ts
import { auth, currentUser } from "@clerk/nextjs/server";

export async function getClerkUserId() {
  // ⚠️ AJOUTEZ 'await' ICI
  const { userId } = await auth();
  return userId;
}

export async function getCurrentUser() {
  // currentUser() est aussi async
  const user = await currentUser();
  return user;
}
