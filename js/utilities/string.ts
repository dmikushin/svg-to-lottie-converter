/**
 * @function getBase64StringWithoutPrefix
 * Return a base64 encoded string without the `data:type:base64;,` prefix
 * @param {String} str
 */
 export const getBase64StringWithoutPrefix = (str: string): string | undefined => 
  str.split(";base64,").pop();