import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { isActiveUser } from "../controllers/user";
import ProjectError from "../helper/error";
import Blacklist from "../models/blacklistedToken";

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const secretKey = process.env.SECRET_KEY || "";
    const authHeader = req.get("Authorization");

    if (!authHeader) {
      const err = new ProjectError("Not authenticated");
      err.statusCode = 401;
      throw err;
    }

    const token = authHeader.split(" ")[1];

    // Check if the token is in the Blacklist

    const blacklistItem = await Blacklist.findOne({ token });

    if (blacklistItem) {
      const err = new ProjectError("Not authenticated!");
      err.statusCode = 403;
      throw err;
    }

    let decodedToken: { userId: String; iat: Number; exp: Number };
    try {
      decodedToken = <any>jwt.verify(token, secretKey);
    } catch (error) {
      const err = new ProjectError("Not authenticated");
      err.statusCode = 401;
      throw err;
    }

    if (!decodedToken) {
      const err = new ProjectError("Not authenticated");
      err.statusCode = 401;
      throw err;
    }

    //isActiveUser in user controller else inactive user
    if (!(await isActiveUser(decodedToken.userId))) {
      const err = new ProjectError("User is deactivated!");
      err.statusCode = 422;
      throw err;
    }

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    next(error);
  }
};

export { isAuthenticated };
