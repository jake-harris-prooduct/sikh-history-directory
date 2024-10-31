// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// lib/utils.ts
// Add this alongside your other utility functions

export const getGoogleDriveImageUrl = (fileId: string): string => {
  if (!fileId) return "/api/placeholder/400/400"
  return `https://drive.google.com/uc?export=view&id=${fileId}`

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
