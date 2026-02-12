import { Request, Response } from 'express';

import { STATUS_CODES } from "../constants/statusCodes";

export const handleControllerError = (
    error: unknown,
    res: Response,
    operation: string,
    statusCode: number = STATUS_CODES.BAD_REQUEST
): void => {
    if (error instanceof Error) {
        console.log(`${operation} ERROR:`, error);
        res.status(statusCode).json({ message: error.message });
        return;
    }
    res.status(statusCode).json({ message: "Unknown error occurred" });
    return;
};