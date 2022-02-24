import { RequestHandler } from 'express';

import User from '../models/user';
import ProjectError from '../helper/error';
import {ReturnResponse} from '../utils/interfaces';

const getUser:RequestHandler = async (req, res, next) => {
    let resp: ReturnResponse;

    try {
        const userId = req.params.userId;

        if (req.userId != req.params.userId) {
            const err = new ProjectError("You are not authorized!");
            err.statusCode = 401;
            err.data = { hi: "its error" };
            throw err;
        }
        const user = await User.findById(userId, { name: 1, email: 1 });
        if (!user) {

            const err = new ProjectError("No user exist");
            err.statusCode = 401;
            throw err;
        } else {
            resp = { status: "success", message: "User found", data: user };
            res.status(200).send(resp);
        }
    } catch (error: any) {
        next(error);
    }

}

const updateUser:RequestHandler = async (req, res, next) => {

    let resp: ReturnResponse;
    try {

        if (req.userId != req.body._id) {
            const err = new ProjectError("You are not authorized!");
            err.statusCode = 401;
            throw err;
        }

        const userId = req.body._id;
        const user = await User.findById(userId);
        if (!user) {
            const err = new ProjectError("No user exist");
            err.statusCode = 401;
            throw err;
        }

        user.name = req.body.name;
        await user.save();

        resp = { status: "success", message: "User Updated", data: {} };
        res.send(resp);
    } catch (error) {
        next(error);
    }
}


export { getUser, updateUser }