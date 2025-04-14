import { type AuthResponse, type BasicAuthCredentials } from "@/lib/shadcn/registry/types"

export async function validateBasicAuth(credentials: BasicAuthCredentials): Promise<boolean> {
  const { username, password } = credentials
  
  return (
    username === "admin" &&
    password === "admin"
  )
}

export async function authenticateWithBasicAuth(credentials: BasicAuthCredentials): Promise<AuthResponse> {
  try {
    const isValid = await validateBasicAuth(credentials)

    if (!isValid) {
      return {
        success: false,
        message: "Invalid credentials"
      }
    }

    return {
      success: true,
      message: "Authentication successful"
    }
  } catch (error) {
    console.error("Basic auth error:", error)
    return {
      success: false,
      message: "Something went wrong during authentication"
    }
  }
} 