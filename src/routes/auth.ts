// Redirect request to Particular method on Controller
import express from "express";
import { body } from "express-validator";

import { validateRequest } from "../helper/validateRequest";


import {
  registerUser,
  loginUser,
  activateUser,
  isUserExist,
  isPasswordValid,
} from "../controllers/auth";

const router = express.Router();

// POST /auth/
router.post(
  "/",
  [
    body("name")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 4 })
      .withMessage("Please enter a valid name, minimum 4 character long"),
    body("email")
      .trim()
      .isEmail()
      .custom((emailId: String) => {
        return isUserExist(emailId)
          .then((status: Boolean) => {
            if (status) {
              return Promise.reject("User already exist!");
            }
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      })
      .normalizeEmail(),
    body("password")
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
    body("confirm_password")
      .trim()
      .custom((value: String, { req }) => {
        if (value != req.body.password) {
          return Promise.reject("Password mismatched!");
        }
        return true;
      }),
  ],
  validateRequest,
  registerUser
);

// POST /auth/login
router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid Email!"),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .custom((password: String) => {
        return isPasswordValid(password)
          .then((status: Boolean) => {
            if (!status) return Promise.reject();
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      })
      .withMessage("Invalid Password!"),
  ],
  validateRequest,
  loginUser
);

//POST /auth/activate account
router.post(
  "/activate",
  [
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid Email!"),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .custom((password: String) => {
        return isPasswordValid(password)
          .then((status: Boolean) => {
            if (!status) return Promise.reject();
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      })
      .withMessage("Invalid Password!"),
  ],
  activateUser
);

export default router;
