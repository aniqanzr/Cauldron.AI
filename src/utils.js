import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// This helper is required for your Sidebar and UI components to work
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// This is the missing function your app was looking for
export const createPageUrl = (pageName) => {
  if (!pageName) return "/";
  // Converts "User Profile" to "/user-profile"
  return `/${pageName.toLowerCase().replace(/\s+/g, '-')}`;
};