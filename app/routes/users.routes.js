const express = require("express");
const router = express.Router();
const usersController = require("../controller/users.controller");

// Get user account
router.get("/", usersController.findAll);

// Create new account
router.post("/sign-up", usersController.signUp);

// Login with email
router.post("/sign-in", usersController.signIn);

// Logout from current user
router.post("/sign-out", usersController.signOut);

module.exports = router;
