const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const loginUserSchema = require("../validation/user/validateLoginUser");
const registerUserSchema = require("../validation/user/validateRegisterUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @desc Create User Account 
 * @route /api/auth/register
 * @method post 
 * @access public
 */
const createUser = asyncHandler(async(req,res)=>{
    const {error} = registerUserSchema.validate(req.body);
    if(error){
       return res.status(400).json({message:error.details[0].message});
    }
    const userExists = await User.findOne({email:req.body.email});
    if(userExists){
        return res.status(400).json({message:"User already exists"});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);
    const user = new User({
        email:req.body.email,
        username:req.body.username,
        password:hashedPassword
    });
    const result = await user.save();
    const token = null;
    const {password,...data} = result._doc;
    res.status(201).json({message:"User registered successfully",data,token});
});


/**
 * @desc user Login
 * @route /api/auth/login
 * @method post 
 * @access public
 */
const userLogin = asyncHandler(async(req,res)=>{
    const {error} = loginUserSchema.validate(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }   
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return res.status(400).json({message:"Invalid email or password"});
    }
    const validPassword = await bcrypt.compare(req.body.password,user.password);
    if(!validPassword){
        return res.status(400).json({message:"Invalid email or password"});
    }
    const token = jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.JWT_SECRET_KEY,{expiresIn:'1h'});
    const {password,...data} = user._doc;
    res.status(200).json({message:"User logged in successfully",data,token});
});

const forgetPassword = asyncHandler((req,res)=>{
      res.render("forgot-password");
});


module.exports = { createUser, userLogin , forgetPassword};