"use server"

export async function validateBuildEnvironment(): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = []

  // Critical environment variables that must be present during build
  const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      errors.push(`Missing required environment variable: ${envVar}`)
    }
  }

  // Validate Supabase URL format if present
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("https://")) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL must be a valid HTTPS URL")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export async function getSafeEnvVar(key: string, fallback = ""): Promise<string> {
  return process.env[key] || fallback
}
