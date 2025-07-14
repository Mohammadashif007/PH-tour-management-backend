import { NextFunction, Request, Response } from "express";
import AppError from "../ErrorHelpers/AppError";
import httpStatus from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth =
    (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.headers.authorization;
            if (!accessToken) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    "No token received"
                );
            }
            const verifiedToken = verifyToken(
                accessToken,
                envVars.JWT_ACCESS_SECRET
            ) as JwtPayload;

            if (!authRoles.includes(verifiedToken.role)) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    "You are not permitted to view this route!!"
                );
            }
            req.user = verifiedToken;
            next();
        } catch (error) {
            // throw new AppError(httpStatus.UNAUTHORIZED, "something wrong")
            next(error);
        }
    };
