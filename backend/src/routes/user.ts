// Redirect request to Particular method on Controller
import express from "express";
import { body } from "express-validator";

import {
  deactivateUser,
  getUser,
  updateUser,
  changePassword,
  deactivateUserCallback,
  addFavQues,
  showFavQues,
  removeFavQues
} from "../controllers/user";
import { isAuthenticated } from "../middlewares/isAuth";
import { isPasswordValid } from "../controllers/auth";
import { validateRequest } from "../helper/validateRequest";

const router = express.Router();

// User should be authenticate
// User should be authorize
//Get /user/:userId
router.get("/", isAuthenticated, getUser);

// User should be authenticate
// User should be authorize
//Put /user/
router.put("/", isAuthenticated, updateUser);

//PATCH /user/deactivate
router.patch("/deactivate", isAuthenticated, deactivateUser);

// Get request Verify Email for deactivate user's account
// GET  /user/deactivate/:token
router.get("/deactivate/:token", deactivateUserCallback)

//Post /user/addfavques
router.post("/addfavques", isAuthenticated,addFavQues );

//Get /user/favques
router.get("/favques", isAuthenticated,showFavQues );

//Post /user/removefavques
router.post("/removefavques", isAuthenticated,removeFavQues );

//Put  /user/changepassword
router.put(
  "/changepassword",
  isAuthenticated,
  [
    body("newPassword")
      .trim()
      .isLength({ min: 8 })
      .custom((password: String) => {
        return isPasswordValid(password)
          .then((status: Boolean) => {
            if (!status)
              return Promise.reject(
                "Enter a valid password, having atleast 8 characters including 1 small alphabet, 1 capital albhabet, 1 digit and 1 special character($,@,!,#,*)."
              );
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }),
  ],
  validateRequest,
  changePassword
);

export default router;
