import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUserIntoDB = async (payload: Partial<IUser>) => {
    const user = await User.create(payload);
    return user;
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
};
