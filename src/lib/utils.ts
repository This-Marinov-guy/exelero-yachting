import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO, isValid } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format date for account/dashboard display: DD/MM/YY */
export function formatAccountDate(dateInput: string): string {
  if (!dateInput) return "—"
  try {
    const d = dateInput.length === 10 ? parseISO(dateInput) : new Date(dateInput)
    return isValid(d) ? format(d, "dd/MM/yy") : "—"
  } catch {
    return "—"
  }
}
