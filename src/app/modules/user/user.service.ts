import AppError from "../../ErrorHelpers/AppError";
import { IAuthsProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUserIntoDB = async (payload: Partial<IUser>) => {
    console.log(payload);
    const { email, password, ...rest } = payload;
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exist");
    }

    const hashedPassword = await bcryptjs.hash(
        password as string,
        Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProviders: IAuthsProvider = {
        provider: "credentials",
        providerId: email as string,
    };

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProviders],
        ...rest,
    });
    console.log(user);
    return user;
};

const updateUserIntoDB = async (
    id: string,
    payload: Partial<IUser>,
    decodedToken: JwtPayload
) => {
    // ! is user exist
    const isUserExist = await User.findById(id);
    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    // ! user field update authority
    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }

        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    // ! isActive, isDeleted, isVerified field update authority
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (payload.role === Role.USER || payload.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    // ! hash password
    if (payload.password) {
        payload.password = await bcryptjs.hash(
            payload.password,
            envVars.BCRYPT_SALT_ROUND
        );
    }

    // ! update user
    const newUpdatedUser = await User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    return newUpdatedUser;
};

const getAllUsersFromDB = async () => {
    const users = await User.find({});
    const totalUsers = await User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers,
        },
    };
};

export const UserServices = {
    createUserIntoDB,
    getAllUsersFromDB,
    updateUserIntoDB,
};
