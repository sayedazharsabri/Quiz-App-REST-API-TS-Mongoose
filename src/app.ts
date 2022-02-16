import express from 'express';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import UserRoute from './routes/user';
import authRoute from './routes/auth';

const app = express();

const connectionString = process.env.CONNECTION_STRING || "";

app.use(express.json());

declare global {
    namespace Express {
        interface Request {
            userId: String;
        }
    }
}

app.get('/', (req, res) => {
    res.send("Hi hello");
})

//Redirect /user to UserRoute
app.use('/user', UserRoute);

//Redirect /auth
app.use('/auth', authRoute);


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

    // email to corresponding email
    // logger for err
    console.log(err);
    res.send("Something went wrong please try after sometimes!");
})

mongoose.connect(connectionString, (err) => {
    if (err) {
        console.log(err);
        return;
    }

    app.listen(process.env.PORT, () => {
        console.log("Server Connected");
    });
});

