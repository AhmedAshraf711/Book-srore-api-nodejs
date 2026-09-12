const User = require("../models/User");
const validateUpdateUser = require("../validation/user/validateUpdateUser");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

/**
 * @desc update user
 * @route /api/users/:id
 * @method put 
 * @access private
 */

const updateUser =  asyncHandler(async (req, res) => {
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
  });

/**
 * @desc delete user
 * @route /api/users/:id
 * @method delete 
 * @access private
 */
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  });

  /**
 * @desc get user by id
 * @route /api/users/:id
 * @method get 
 * @access private
 */
const getUserById =  asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User fetched successfully", data: user });
  });

/**
 * @desc get all users
 * @route /api/users
 * @method get 
 * @access private
 */
const getAllUsers = asyncHandler(async (req,res)=>{
      const users = await User.find().select("-password");
      res.status(200).json({message: "All Users",data:users});
});

module.exports = { updateUser, deleteUser , getUserById ,getAllUsers  };