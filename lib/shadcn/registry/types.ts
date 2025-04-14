export interface AuthResponse {
  success: boolean
  message: string
  token?: string
}

export interface BasicAuthCredentials {
  username: string
  password: string
} 