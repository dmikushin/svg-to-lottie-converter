export interface ValidationResult {
  errorCode?: string,
  error?: string
}

export interface Response extends ValidationResult {
  success: boolean
}