import type { Request } from "express";
import { isNil } from "lodash";
import { isValidSvgFileType } from "./file";
import { isValidSvgBase64String } from "./string";
import type { ConvertSvgToLottieRequestPayload } from "../types/convert-svg-to-lottie";
import type { ValidationResult } from "../types/responses";
import ErrorCodeTypes from "../constants/error-code-types";
import { getFileType } from "../utilities/file";

/**
 * @function convertSvgToLottieValidator
 * Return whether the payload is valid
 * @param {Object} payload
 */
const convertSvgToLottieValidator = async (
  { body }: Request
): Promise<ValidationResult> => {
  const {
    inputFile,
    inputFileBase64,
    inputFileUrl
  } = body as ConvertSvgToLottieRequestPayload;
  if (!isNil(inputFile)) {
    // TODO: Add support for posting as file...
    return {
      errorCode: ErrorCodeTypes.UNSUPPORTED_INPUT_FILE_TYPE,
      error: "The input file type is not yet supported"
    }
  }
  if (!isNil(inputFileBase64)) {
    if (!isValidSvgBase64String(inputFileBase64)) return {
      errorCode: ErrorCodeTypes.UNSUPPORTED_INPUT_FILE_TYPE,
      error: "The input file must be a valid base64 encoded string for an svg"
    }
  }
  if (!isNil(inputFileUrl)) {
    if (!isValidSvgFileType(getFileType(inputFileUrl))) return {
      errorCode: ErrorCodeTypes.UNSUPPORTED_INPUT_FILE_TYPE,
      error: "The input file must be of type svg"
    }
  }
  if (isNil(inputFile) && isNil(inputFileBase64) && isNil(inputFileUrl)) {
    return {
      errorCode: ErrorCodeTypes.INVALID_INPUT_FILE_TYPE,
      error: "An input file must be specified"
    }
  }
  return {
    errorCode: undefined,
    error: undefined
  }
};

export {
  convertSvgToLottieValidator
};