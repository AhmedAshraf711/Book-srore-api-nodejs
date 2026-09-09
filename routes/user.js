const express = require("express");
const router = express.Router();
const User = require("../models/User");
const validateUpdateUser = require("../validation/user/validateUpdateUser");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { verifyToken , verifyTokenAndAuthorization, verifyTokenAdmin}  = require("../middlewares/verifyToken");

// Update User
router.put(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    // if (req.user.id !== req.params.id) {
    //   return res
    //     .status(403)
    //     .json({ message: "You are not allowed to update this user" });
    // }
    const { error } = validateUpdateUser.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const UpdatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
        },
      },
      { new: true },
    ).select("-password");

    res
      .status(200)
      .json({ message: "User updated successfully", data: UpdatedUser });
  }),
);

// Delete User
router.delete(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    // if (req.user.id !== req.params.id) {
    //   return res
    //     .status(403)
    //     .json({ message: "You are not allowed to update this user" });
    // } middleware replaced this 
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  }),
);

// Get User
router.get(
  "/:id",
    verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    // if (req.user.id !== req.params.id) {
    //   return res
    //     .status(403)
    //     .json({ message: "You are not allowed to update this user" });
    // }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User fetched successfully", data: user });
  }),
);
router.get("/",verifyTokenAdmin,asyncHandler(async (req,res)=>{
      const users = await User.find().select("-password");
      res.status(200).json({message: "All Users",data:users});
}));

module.exports = router;
