import type { Request, Response } from "express";
import { RequestWithRawBody } from "../types/requests";
import { convertSvgToLottie } from "./convert-svg-to-lottie";
import { convertSvgToLottieValidator } from "../validators/convert-svg-to-lottie";
import type { 
  OnRequestHandler, 
  OnRequestValidator 
} from "../types/services";
import { isNil, get, set } from "lodash";
import ErrorCodeTypes from "../constants/error-code-types";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Busboy = require("busboy");

const BUSBOY_CONFIG = {
  limits: {
    // NOTE: Max request limit on Google Cloud Functions is 10MB so we 
    // limit our request field size to 7.5MB in binary bytes to prevent 
    // this limit being met. What this means is that the base64 encoded
    // image passed to the POST request must be less than 7.5MB.
    fieldSize: 7864320
  }
};

const _getMultipartFormDataFields = async (
  request: Request
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ [key: string]: any }> => new Promise(
  resolve => {
    const { headers, rawBody } = request as RequestWithRawBody;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields: { [key: string]: any } = {};
    const busboy = new Busboy({ 
      ...BUSBOY_CONFIG, 
      headers 
    });
    busboy.on(
      "field", 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (name: string, value?: any) => 
        fields[name] = value
    );
    busboy.on(
      "finish", 
      () => resolve(fields)
    );
    busboy.end(rawBody);
  }
);

/**
 * @function onRequestHandlerWithValidator
 * Utility function to wrap a service method with validation
 * @param {Function} handler
 * @param {Function} validator
 */
export const onRequestHandlerWithValidator = (
  handler: OnRequestHandler,
  validator: OnRequestValidator
) => async (
  request: Request, 
  response: Response
): Promise<void> => {
  const validationResult = await validator(request, response);
  if (!isNil(get(validationResult, ["errorCode"]))) {
    response.status(400).send({
      success: false,
      ...validationResult
    });
    return undefined;
  }
  return handler(request, response);
};

/**
 * @function onMultipartFormDataPostRequestHandler
 * Utility function to wrap a service method with multipart form data
 * @param {Function} handler
 */
export const onMultipartFormDataPostRequestHandler = (
  handler: OnRequestHandler
) => async (
  request: Request, 
  response: Response
): Promise<void> => {
  const ERROR = "The request must be POST with a valid multipart form data body.";
  const { method } = request;
  if (method !== "POST") {
    response.status(405).send({
      success: false,
      errorCode: ErrorCodeTypes.INVALID_REQUEST,
      error: ERROR
    });
    return undefined;
  }
  const fields = await _getMultipartFormDataFields(request);
  console.log("Services: Processing request with fields", fields);
  set(request, ["body"], fields);
  return handler(request, response);
};

export default {
  convertSvgToLottie: onMultipartFormDataPostRequestHandler(
    onRequestHandlerWithValidator(
      convertSvgToLottie,
      convertSvgToLottieValidator
    )
  )
};