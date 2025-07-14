/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

const createUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await UserServices.createUserIntoDB(req.body);
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "User created successfully",
            data: user,
        });
    }
);

// ! update
const updateUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        // const token = req.headers.authorization;
        // const verifiedToken = jwt.verify(
        //     token as string,
        //     envVars.JWT_ACCESS_SECRET
        // ) as JwtPayload;

        const verifiedToken = req.user;

        const payload = req.body;
        const user = await UserServices.updateUserIntoDB(
            id,
            payload,
            verifiedToken
        );
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "User updated successfully",
            data: user,
        });
    }
);

const getAllUsers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await UserServices.getAllUsersFromDB();
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "All users retrieve successfully",
            data: result.data,
            meta: result.meta,
        });
    }
);

export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser,
};
