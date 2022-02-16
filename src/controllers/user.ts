import { Request, Response, NextFunction } from 'express';

import User from '../models/user';

interface ReturnResponse {
    status: "success" | "error",
    message: String,
    data: {}
}

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    let resp: ReturnResponse;

    try {
        const userId = req.params.userId;

        if (req.userId != req.params.userId) {
            const err = new Error("You are not authorized!");
            throw err;
        }
        const user = await User.findById(userId, { name: 1, email: 1 });
        if (!user) {
            resp = { status: "error", message: "No user found", data: {} };
            res.send(resp);
        } else {
            resp = { status: "success", message: "User found", data: user };
            res.send(resp);
        }
    } catch (error:any) {
        next(error);
    }

}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {

    let resp: ReturnResponse;
    try {

        if (req.userId != req.body._id) {
            const err = new Error("You are not authorized!");
            // err.statusCode = 123;
            throw err;
        }

        const userId = req.body._id;
        const user = await User.findById(userId);
        user.name = req.body.name;
        await user.save();
        resp = { status: "success", message: "User Updated", data: {} };
        res.send(resp);
    } catch (error) {
        next(error);
    }
}


export { getUser, updateUser }