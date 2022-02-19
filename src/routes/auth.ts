// Redirect request to Particular method on Controller
import express from 'express';
import {registerUser, loginUser, isUserExist} from '../controllers/auth';
import {body} from 'express-validator';

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
        .custom((emailId:String) => {
            return isUserExist(emailId)
                .then((status:Boolean) =>{
                    if(status){
                           return Promise.reject("User already exist!");
                    }
                } )
                .catch((err) => {
                    return Promise.reject(err);
                })
                
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({min:8})
        .withMessage("Enter at least 8 character long password"),
    body('confirm_password')
        .trim()
        .custom((value:String, {req})=>{
            if(value != req.body.password){
                return Promise.reject("Password mismatch!");
            }
            return true;
        })

],registerUser);


// POST /auth/login
router.post('/login', loginUser);


export default router;
