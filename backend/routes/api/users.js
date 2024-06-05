const express = require("express");
const bcrypt = require("bcryptjs");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Username is required"),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("firstName")
    .exists({ checkFalsy: true })
    .isAlpha()
    .isLength({ min: 3, max: 30 })
    .withMessage("FirstName must be between 3 and 30 letters long"),
  check("firstName")
    .exists({ checkFalsy: true })
    .isAlpha()
    .withMessage("Firstname can only be composed of letters"),
  check("lastName")
    .exists({ checkFalsy: true })
    .isAlpha()
    .isLength({ min: 3, max: 30 })
    .withMessage("Last Name must be between 3 and 30 letters long"),
  check("lastName")
    .exists({ checkFalsy: true })
    .isAlpha()
    .withMessage("Firstname can only be composed of letters"),

  // check("password")
  //   .exists({ checkFalsy: true })
  //   .isLength({ min: 6 })
  //   .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

const router = express.Router();

// Sign up
router.post("/", validateSignup, async (req, res) => {
  try {
    const { firstName, lastName, email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
      firstName,
      lastName,
      email,
      username,
      hashedPassword,
    });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      if (error.errors[0].path === "email") {
        return res.status(500).json({
          message: "User already exists",
          errors: {
            email: "User with that email already exists",
          },
        });
      } else if (error.errors[0].path === "username") {
        return res.status(500).json({
          message: "User already exists",
          errors: {
            username: "User with that username already exists",
          },
        });
      }
    }
  }
});

module.exports = router;
