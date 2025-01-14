
//Library
import express from "express";
import passport from "passport";

// Models

import {UserModel} from "../../database/user";

const Router=express.Router();

/*
Route   /signup
Des     Register new user
Params  none
Access  public 
Method post
*/
Router.post("/signup",async(req,res)=>{
    try {
        await UserModel.findByEmailAndPhone(req.body.credentials);
    
        // save to DB
        const newUser=await UserModel.create(req.body.credentials);

        //generate JWT token
        const token=newUser.generateJwtToken();

        // return
       return res.status(200).json({token,status:"Success"})
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
});

/*
Route   /signin
Des     Signin with email and password
Params  none
Access  public 
Method post
*/

Router.post("/signin",async(req,res)=>{
    try {
       const user= await UserModel.findByEmailAndPassword(req.body.credentials);
    
       

        //generate JWT token
        const token=user.generateJwtToken();

        // return
       return res.status(200).json({token,status:"Success"})
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
});

/*
Route   /google
Des     google Signin
Params  none
Access  public 
Method Get
*/

Router.get("/google",passport.authenticate("google",{scope:[
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ],}))


/*
Route   /google/callback
Des     Google Signin Callback
Params  none
Access  public 
Method Get
*/
Router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
      return res.json(
          {token:req.session.passport.user.token}
      );
    }
  );

export default Router;