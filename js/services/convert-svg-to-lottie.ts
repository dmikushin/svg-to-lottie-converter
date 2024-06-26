import type { Request, Response } from "express";
import { isNil } from "lodash";
import ErrorCodeTypes from "../constants/error-code-types";
import type { 
  ConvertSvgToLottieRequestPayload,
  ConvertSvgToLottie
} from "../types/convert-svg-to-lottie";
import { 
  convertSvgToLottieFromFileUrl,
  convertSvgToLottieFromFileBase64 
} from "../managers/convert-svg-to-lottie";

export const convertSvgToLottie = async (
  { body }: Request, 
  response: Response
): Promise<void> => {
  const {
    inputFile,
    inputFileBase64,
    inputFileUrl
  } = body as ConvertSvgToLottieRequestPayload;
  try {
    let convertSvgToLottieFile: ConvertSvgToLottie;
    if (!isNil(inputFile)) {
      // TODO: Add support for posting as file...
      return undefined;
    }
    else if (!isNil(inputFileBase64)) {
      convertSvgToLottieFile = await convertSvgToLottieFromFileBase64(
        inputFileBase64
      );
    }
    else if (!isNil(inputFileUrl)) {
      convertSvgToLottieFile = await convertSvgToLottieFromFileUrl(
        inputFileUrl
      );
    }
    else {
      return undefined;
    }
    const {
      outputJson, 
      removeFile
    } = convertSvgToLottieFile;
    response.send(outputJson);
    removeFile();
  }
  catch (error) {
    console.error(
      "ConvertSvgToLottieService: Error converting SVG to Lottie.", 
      error,
    );
    response.status(500).send({
      success: false,
      errorCode: ErrorCodeTypes.GENERIC_ERROR,
      error: "Unable to process request"
    });
  }
};

export default {
  convertSvgToLottie
};