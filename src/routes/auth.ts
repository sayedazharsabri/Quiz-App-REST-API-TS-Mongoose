// Redirect request to Particular method on Controller
import express from 'express';
import {registerUser, loginUser, isUserExist} from '../controllers/auth';
import {body} from 'express-validator';
import ProjectError from '../helper/error';

const router = express.Router();

// POST /auth/
router.post('/', [
    body('name')
        .trim()
        .not()
        .isEmpty()
        .isLength({min:4})
        .withMessage("Please enter a valid name, minimum 4 character long"),
    body('email')
        .trim()
        .isEmail()
        .custom(emailId => {
            return isUserExist(emailId)
                .then((status) =>{
                    if(status){
                           return Promise.reject("User already exist!");
                    }
                } )
                .catch((err) => {
                    return Promise.reject(err);
                })
                
        })
        .normalizeEmail()
],registerUser);


// POST /auth/login
router.post('/login', loginUser);


export default router;
