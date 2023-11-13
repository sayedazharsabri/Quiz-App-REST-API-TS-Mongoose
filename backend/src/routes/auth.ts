// Redirect request to Particular method on Controller
import express from "express";
import { body } from "express-validator";
import { resendRegistrationOTP } from "../controllers/otp";

import {
  activateUser,
  activateUserCallback,
  isPasswordValid,
  isUserExist,
  loginUser,
  registerUser,
  activateAccount,
  forgotPassword,
  forgotPasswordCallback,
  resetPassword,
  verifyRegistrationOTP,
} from "../controllers/auth";
import { validateRequest } from "../helper/validateRequest";

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
      }),
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
    body("confirmPassword")
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
    body("email").trim().isEmail().withMessage("Invalid Credentials!"),
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
      .withMessage("Invalid Credentials!"),
  ],
  validateRequest,
  loginUser
);

//POST /auth/activate account
router.post('/activateaccount', [
  body('key')
  .trim()
  .isLength({min: 8}).withMessage("Invalid Key!"),
  body("email").trim().isEmail().withMessage("Invalid Email!")
], activateAccount)




//Verify Registration otp route
// POST -> /auth/verify-registration-otp/:token  (use params)
router.post("/verify-registration-otp/:token", verifyRegistrationOTP);


// Resend otp for registration
// POST -> /auth/resend-registration-otp/:token  (use Params)
router.get("/resend-registration-otp/:token", resendRegistrationOTP);

router.post(
  "/activate",
  [body("email").trim().isEmail().withMessage("Invalid Email!")],
  activateUser
);


//re-activate link
// GET /user/activate
router.get("/activate/:token", activateUserCallback);

//POST 
router.post(
  "/forgotpassword",
  [body("email").trim().isEmail().withMessage("Invalid Email!")],
  forgotPassword
);

router.get("/forgotpassword/:token",forgotPasswordCallback);

router.post("/forgotpassword/:userId",
[
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
    body("confirmPassword")
      .trim()
      .custom((value: String, { req }) => {
        if (value != req.body.password) {
          return Promise.reject("Password mismatched!");
        }
        return true;
      }),
],
resetPassword
);

export default router;
