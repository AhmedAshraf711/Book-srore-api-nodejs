const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const loginUserSchema = require("../validation/user/validateLoginUser");
const registerUserSchema = require("../validation/user/validateRegisterUser");
const validateChangePassword = require("../validation/user/validateChangePassword")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

/**
 * @desc Create User Account 
 * @route /api/auth/register
 * @method post 
 * @access public
 */
module.exports.createUser = asyncHandler(async(req,res)=>{
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
module.exports.userLogin = asyncHandler(async(req,res)=>{
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

/**
 *  @desc    Get Forgot Password View
 *  @route   /password/forgot-password
 *  @method  GET
 *  @access  public
 */
module.exports.getForgotPasswordView = asyncHandler((req, res) => {
  res.render("forgot-password");
});

/**
 *  @desc    Send Forgot Password Link
 *  @route   /password/forgot-password
 *  @method  POST
 *  @access  public
 */
module.exports.sendForgotPasswordLink = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const secret = process.env.JWT_SECRET_KEY + user.password;
  const token = jwt.sign({ email: user.email, id: user.id }, secret, {
    expiresIn: "10m",
  });

  const link = `http://localhost:3001/api/auth/reset-password/${user._id}/${token}`;

  const transporter = nodemailer.createTransport({
     service: "gmail",
     auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
     }
  });

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: user.email,
    subject: "Reset Password",
    html: `<div>
              <h4>Click on the link below to reset your password</h4>
              <p>${link}</p>
          </div>`
  }

  transporter.sendMail(mailOptions, function(error, success){
    if(error){
      console.log(error);
      res.status(500).json({message: "something went wrong"});
    } else {
      console.log("Email sent: " + success.response);
      res.render("link-send");
    }
  });
});

/**
 *  @desc    Get Reset Password View
 *  @route   /password/reset-password/:userId/:token
 *  @method  GET
 *  @access  public
 */
module.exports.getResetPasswordView = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const secret = process.env.JWT_SECRET_KEY + user.password;
  try {
    jwt.verify(req.params.token, secret);
    res.render("reset-password", { email: user.email });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error" });
  }
});

/**
 *  @desc    Reset The Password
 *  @route   /password/reset-password/:userId/:token
 *  @method  POST
 *  @access  public
 */
module.exports.resetThePassword = asyncHandler(async (req, res) => {
  const { error } = validateChangePassword.validate(req.body);
   if(error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const secret = process.env.JWT_SECRET_KEY + user.password;
  try {
    jwt.verify(req.params.token, secret);

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user.password = req.body.password;

    await user.save();
    res.render("success-password");
  } catch (error) {
    console.log(error);
    res.json({ message: "Error" });
  }
});
