/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await UserServices.createUserIntoDB(req.body);
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "User created successfully",
            data: user,
        });
        // res.status(httpStatus.CREATED).json({
        //     message: "User created successfully",
        //     user,
        // });
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
        // res.status(httpStatus.OK).json({
        //     success: true,
        //     message: "All user retrieve successfully",
        //     users,
        // });
    }
);

// const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const users = await UserServices.getAllUsersFromDB();
//         res.status(httpStatus.OK).json({
//             success: true,
//             message: "All user retrieve successfully",
//             users,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

export const UserControllers = {
    createUser,
    getAllUsers,
};
