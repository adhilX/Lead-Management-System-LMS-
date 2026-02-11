import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { STATUS_CODES } from "../constants/statusCodes";
import { verifyAccessToken } from "../utils/jwt";

export const tokenChecker = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-access-token"] as string;
  console.log('Token:', token);
  if (!token) {
    res.status(STATUS_CODES.UNAUTHORIZED).json({ error: "Access token missing" });
    return;
  }
  try {
    const decoded = verifyAccessToken(token) as JwtPayload;

    console.log("Authorized:", decoded);
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(STATUS_CODES.UNAUTHORIZED).json({ error: "Invalid or expired token" });
    return
  }
};