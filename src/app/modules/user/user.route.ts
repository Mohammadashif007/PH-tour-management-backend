/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import { object, ZodObject } from "zod";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewars/validationRequest";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../../ErrorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Role } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewars/checkAuth";

const router = express.Router();

router.post(
    "/register",
    validateRequest(createUserZodSchema),

    UserControllers.createUser
);
router.get(
    "/all-users",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    UserControllers.getAllUsers
);

router.patch(
    "/:id", validateRequest(updateUserZodSchema),
    checkAuth(...Object.values(Role)),
    UserControllers.updateUser
);

export const UserRoutes = router;
