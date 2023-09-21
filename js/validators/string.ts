import MimeTypes from "../constants/mime-types";

/**
 * @function isValidSvgBase64String
 * Return whether the string is a valid image base64 encoded string
 * @param {String} str
 */
export const isValidSvgBase64String = (str: string): boolean => (
  str.startsWith(`data:${MimeTypes.SVG};base64,`)
);