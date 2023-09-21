import type { Request, Response } from "express";
import type { ValidationResult } from "../types/responses";

export type OnRequestHandler = (req: Request, resp: Response) => void | Promise<void>;

export type OnRequestValidator = (req: Request, resp: Response) => Promise<ValidationResult>;