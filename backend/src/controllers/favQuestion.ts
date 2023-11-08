import { RequestHandler } from "express";
import { ReturnResponse } from "../utils/interfaces";

import User from "../models/user";
import favQuestion from "../models/favQuestion";
import ProjectError from "../helper/error";

const addFavQuestion: RequestHandler = async (req, res, next) => {
    let resp: ReturnResponse;
    const userId = req.userId;
    const options = req.body.options;
    const question = req.body.question;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        const err = new ProjectError("User does not exist");
        err.statusCode = 401;
        throw err;
      }
      
      const favQues = new favQuestion({ question, options,userId });    
      await favQues.save();
      resp = { status: "success", message: "Question added to Favourites!", data: {} };
      res.status(200).send(resp);
    }
    catch (error) {
      next(error);
    }
  };
  
  const showFavQuestion: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    let resp: ReturnResponse;
    try {
      const favQues = await favQuestion.find({userId}); 
        resp = { status: "success", message: "Favourite Questions!", data: {favQues} };
        res.status(200).send(resp);
    } 
    catch (error) {
      next(error);
    }
  }
  
  //user will get favourites only when he is authenticated,and once he get the id from fav collection he can delete it.
  
  const removeFavQuestion: RequestHandler = async (req, res, next) => {
  
    const questionId = req.params.favquestionId;
    try {
      await favQuestion.deleteOne({_id:questionId});
      const resp: ReturnResponse = {
        status: "success",
        message: "Question removed from favourites successfully",
        data: {},
      };
      res.status(200).send(resp);
    }
    catch (error) {
      next(error);
    }
  }

export {addFavQuestion, showFavQuestion, removeFavQuestion};