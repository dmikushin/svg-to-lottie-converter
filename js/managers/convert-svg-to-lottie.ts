import {
  getRandomFileName,
  getRandomFileDirectoryName,
  getFileName,
  getFileType,
  getFileTypeFromBase64String
} from "../utilities/file";
import { getBase64StringWithoutPrefix } from "../utilities/string";
import type { ConvertSvgToLottie } from "../types/convert-svg-to-lottie";
import path from "path";
import os from "os";
import fs from "fs";
import util from "util";
import { exec as execCmd } from "child_process";

const exec = util.promisify(execCmd);
const rm = util.promisify(fs.rm);
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

const _getConvertSvgToLottie = (
  tempDirectory: string, 
  tempFilePath: string
): ConvertSvgToLottie => ({
  outputFileDirectory: tempDirectory,
  outputFilePath: tempFilePath,
  removeFile: async () => {
    console.log(`ConvertSvgToLottieManager: Removing processed image from ${tempDirectory}.`);
    await rm(tempDirectory, { 
      recursive: true, 
      force: true 
    });
  }
});

const convertSvgToLottieFromFileUrl = async (
  inputFileUrl: string
): Promise<ConvertSvgToLottie> => {
  try {
    const inputFileType = getFileType(inputFileUrl);
    const tempFileName = getFileName(getRandomFileName(), inputFileType);
    const tempDirectory = path.join(os.tmpdir(), getRandomFileDirectoryName());
    const tempFilePath = `${tempDirectory}/${tempFileName}`;
    await rm(tempDirectory, { recursive: true, force: true });
    await mkdir(tempDirectory);
    console.log(`ConvertSvgToLottieManager: Downloading image from URL ${inputFileUrl} and processing to ${tempFilePath}.`);
    try {
      // TODO: Refactor this to call the Python script to get Lottie JSON
      await exec(`curl -s ${inputFileUrl} | rembg > ${tempFilePath}`);
      return _getConvertSvgToLottie(
        tempDirectory,
        tempFilePath
      );
    }
    catch (error) {
      await rm(tempDirectory, { recursive: true, force: true });
      throw error;
    }
  }
  catch (error) {
    console.error("ConvertSvgToLottieManager: Error removing image background from file.", error);
    throw error;
  }
};

const convertSvgToLottieFromFileBase64 = async (
  inputFileBase64: string
): Promise<ConvertSvgToLottie> => {
  try {
    const inputFileType = getFileTypeFromBase64String(inputFileBase64);
    const tempFileName = getFileName(getRandomFileName(), inputFileType);
    const tempDirectory = path.join(os.tmpdir(), getRandomFileDirectoryName());
    const tempUnprocessedFilePath = `${tempDirectory}/unprocessed_${tempFileName}`;
    const tempProcessedFilePath = `${tempDirectory}/processed_${tempFileName}`;
    await rm(tempDirectory, { recursive: true, force: true });
    await mkdir(tempDirectory);
    console.log(`ConvertSvgToLottieManager: Saving base64 to ${tempUnprocessedFilePath} and processing to ${tempProcessedFilePath}.`);
    try {
      const inputFileBase64WithoutPrefix = 
        getBase64StringWithoutPrefix(inputFileBase64);
      if (!inputFileBase64WithoutPrefix)
        throw new Error(`ConvertSvgToLottieManager: Cannot write base64 to ${tempUnprocessedFilePath}.`);
      await writeFile(
        tempUnprocessedFilePath, 
        inputFileBase64WithoutPrefix, 
        { encoding: "base64" }
      );
      // TODO: Refactor this to call the Python script to get Lottie JSON
      await exec(`rembg -o ${tempProcessedFilePath} ${tempUnprocessedFilePath}`);
      return _getConvertSvgToLottie(
        tempDirectory,
        tempProcessedFilePath
      );
    }
    catch (error) {
      await rm(tempDirectory, { recursive: true, force: true });
      throw error;
    }
  }
  catch (error) {
    console.error("ConvertSvgToLottieManager: Error removing image background from file.", error);
    throw error;
  }
};

export {
  convertSvgToLottieFromFileUrl,
  convertSvgToLottieFromFileBase64
};