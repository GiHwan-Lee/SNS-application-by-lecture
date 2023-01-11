import express from "express";
import {} from "express-async-errors";
import { body } from "express-validator";
import { validate } from "../middleware/validator.js";
import * as authController from "../controller/auth.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

const validateCredential = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("pleas write at least 5 character"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("pleas write at least 5 character"),
  validate,
];
//login에 대한 유효성 검사

const validateSignup = [
  ...validateCredential,
  body("name").notEmpty().withMessage("write your name"),
  body("email").isEmail().normalizeEmail().withMessage("invalid email"),
  body("url")
    .isURL()
    .withMessage("invalid URL")
    .optional({ nullable: true, checkFalsy: true }),
  validate,
];

router.post("/signup", validateSignup, authController.signup);
router.post("/login", validateCredential, authController.login);
router.get("/me", isAuth, authController.me);

export default router;
