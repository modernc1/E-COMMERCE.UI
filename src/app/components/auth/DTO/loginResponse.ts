export interface LoginResponse {
  success: boolean
  fullName: string
  email: string
  role: string
  message: string
  token: string
  refreshToken: string
}
