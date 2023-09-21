import { toLower } from "lodash";
import MimeTypes from "../constants/mime-types";
import FileTypes from "../constants/file-types";

/**
 * @function getFileType
 * Return the file type of a passed image URL
 * @param {String} urlOrPath
 */
export const getFileType = (urlOrPath: string): string => {
  const parts = urlOrPath.split(".");
  return parts[parts.length - 1];
};

/**
 * @function getFileTypeFromBase64String
 * Return the file type of a passed base64 encoded string
 * @param {String} str
 */
export const getFileTypeFromBase64String = (str: string): string => {
  if (str.indexOf(MimeTypes.SVG) !== -1) 
    return FileTypes.SVG;
  return "Unknown";
};

/**
 * @function getFileName
 * Return a file name
 * @param {String} name
 * @param {String} type
 */
export const getFileName = (name: string, type: string): string => (
  `${toLower(name).replace(/[^A-Za-z0-9_-]{1,}/g, "")}.${type}`
);

/**
 * @function getFileNameWithoutExtension
 * Return a file name
 * @param {String} name
 */
export const getFileNameWithoutExtension = (name: string): string => name.split(".")[0];

/**
 * @function getRandomFileDirectoryName
 * Return a new random file directory name
 * @param {String} prefix
 */
export const getRandomFileDirectoryName = (prefix?: string): string => 
 `${prefix ? `${prefix}_` : ""}${String(Math.round(Math.random()*1000000000000))}`;

/**
 * @function getRandomFileName
 * Return a new random file name
 * @param {String} prefix
 */
export const getRandomFileName = (prefix?: string): string => 
  `${prefix ? `${prefix}_` : ""}${String(Math.round(Math.random()*1000000000000))}`;