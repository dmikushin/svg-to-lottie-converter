export interface ConvertSvgToLottieRequestPayload {
  inputFile?: string,
  inputFileBase64?: string,
  inputFileUrl?: string
}

export interface ConvertSvgToLottie {
  outputFileDirectory: string,
  outputJson: string,
  removeFile: () => void
}