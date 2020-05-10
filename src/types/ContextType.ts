import { Request, Response } from "express";

export interface ContextType {
  req: Request;
  res: Response;
  payload?: { userId: string; email: string; iat: number };
}
