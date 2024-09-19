const express = require("express");
const router = express.Router();
const User = require("../models/user");

// User Registration
router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findAll({ where: { email: req.body.email } });
    if (existingUser) {
      return res.json({
        status: false,
        message: 'User already registered',
        data: ''
      });
    }
    
    const newUser = await 'User'.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      accountType: req.body.accountType,
      entityName: req.body.entityName,
      dateOfInCorporation: req.body.dateOfInCorporation,
      title: req.body.title,
      mobileNo: req.body.mobileNo,
      skills: req.body.skills,
      image: req.body.image,
      street: req.body.street,
      h_number: req.body.h_number,
      city: req.body.city,
      postalCode: req.body.postalCode,
      country: req.body.country
    });

    return res.json({
      status: true,
      message: 'Successfully registered',
      data: newUser
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: false,
      message: 'Registration failed',
      data: ''
    });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findAll({ 
      where: { email: req.body.email, password: req.body.password } 
    });

    if (user) {
      return res.json({
        status: true,
        message: 'User logged in successfully',
        data: user
      });
    } else {
      return res.json({
        status: false,
        message: 'Login failed',
        data: ''
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      status: false,
      message: 'Login failed',
      data: ''
    });
  }
});

// Get All Users
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json({
      status: true,
      message: 'Users list',
      data: users
    });
  } catch (error) {
    return res.json({
      status: false,
      message: 'Failed to fetch users',
      data: ''
    });
  }
});

// Delete User
router.post("/deleteUser", async (req, res) => {
  try {
    const user = await User.findAll({ where: { email: req.body.email } });
    if (user) {
      await User.destroy({ where: { id: user.id } });
      return res.json({
        status: true,
        message: 'User deleted successfully',
        data: ''
      });
    } else {
      return res.json({
        status: false,
        message: 'User not found',
        data: ''
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      message: 'Failed to delete user',
      data: ''
    });
  }
});

module.exports = router;
