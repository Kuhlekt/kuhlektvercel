export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs
    .filter(Boolean)
    .filter((input): input is string => typeof input === "string")
    .join(" ")
    .trim()
}
