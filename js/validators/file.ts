import { indexOf, toLower } from "lodash";

/**
 * @function isValidFileType
 * Return whether the file type is in a passed array of file types
 * @param {String} type
 * @param {Array} validTypes
 */
export const isValidFileType = (type: string, validTypes: Array<string> = []): boolean => 
  indexOf(validTypes, toLower(type)) !== -1;

/**
 * @function isValidSvgFileType
 * Return whether the file type is in a passed array of file types
 * @param {String} type
 */
export const isValidSvgFileType = (type: string): boolean => 
  isValidFileType(type, ["svg"]);