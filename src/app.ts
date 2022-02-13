import express from 'express';
import mongoose from 'mongoose';

import UserRoute from './routes/user';

const app = express();

const connectionString = process.env.CONNECTION_STRING || "";

app.use(express.json());

app.get('/',(req, res)=>{
    res.send("Hi hello");
})

//Redirect /user to UserRoute
app.use('/user', UserRoute);

mongoose.connect(connectionString,(err)=>{
    if(err){
        console.log(err);
        return;
    }

    app.listen(process.env.PORT, ()=>{
        console.log("Server Connected");
    });
});

