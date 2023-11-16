import BlacklistedToken from "../models/blacklistedToken";
import ProjectError from "../helper/error";
import { ReturnResponse } from "../utils/interfaces";
import { RequestHandler } from "express";
import jwt, { decode } from "jsonwebtoken";

// Function to clear the blacklist
export const clearBlacklist = async () => {

    try {
        const currentDate = Math.floor(Date.now() / 1000);

        const tokens = await BlacklistedToken.deleteMany({
            expiryAt: { $lt: currentDate },
        }).exec();

        if (tokens) {
            console.log('Blacklist Cleared!');
        }

        else {
            console.log("Something went wrong while clearing blacklist!")
        }

    } catch (error) {
        console.log(error)
    }
}


 // Check if the token is in the Blacklist

export const blacklistedTokenCheck = async ( token : any) =>{
    
    const blacklistItem = await BlacklistedToken.findOne({ token });

    if (blacklistItem) {
      const err = new ProjectError("Not authenticated!");
      err.statusCode = 403;
      throw err;
    }
 
}


export const logOut: RequestHandler = async (req, res, next) => {
    let resp: ReturnResponse;
    try {
      const authHeader = req.get("Authorization");
  
      if (!authHeader) {
        const err = new ProjectError("Something went wrong!");
        err.statusCode = 424;
        throw err;
      }
  
        const token = authHeader.split(" ")[1];
  
        let decodedToken: { userId: String; iat: Number; exp: Number };
        const secretKey = process.env.SECRET_KEY || "";
        decodedToken = <any>jwt.verify(token, secretKey);
  
        const expiryAt = decodedToken.exp;
  
        const blacklistedToken = new BlacklistedToken({ token, expiryAt });
        const result = await blacklistedToken.save();
        if (!result) {
          resp = { status: "error", message: "Something went wrong!", data: {} };
          res.status(424).send(resp);
        } else {
          resp = { status: "success", message: "Logged out succesfully!", data: {} };
          res.status(200).send(resp);
        }
  
      }
  
    catch (error) {
      next(error);
    }
  }