"use server"
import { cookies } from "next/headers"

export async function setRole(role: string) {
  const cookieStore = await cookies();
  cookieStore.set("mock_role", role, { path: "/" });
}

export async function getRole() {
  const cookieStore = await cookies();
  const role = cookieStore.get("mock_role")?.value || "CITIZEN";
  return role;
}
