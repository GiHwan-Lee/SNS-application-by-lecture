import express from "express";
import "express-async-errors";
import { body } from "express-validator"; // 유효성 검사를 위한 라이브러리
import { validate } from "../middleware/validator.js"; // 사용자 정의 유효성 검사 미들웨어
import * as authController from "../controller/auth.js"; // 인증 컨트롤러
import { isAuth } from "../middleware/auth.js"; // 인증 확인 미들웨어

const router = express.Router();

// 로그인 및 회원가입 시 사용되는 유효성 검사 미들웨어
const validateCredential = [
  body("username") // 사용자 이름 유효성 검사
    .trim()
    .notEmpty()
    .withMessage("pleas write at least 5 character"),
  body("password") // 비밀번호 유효성 검사
    .trim()
    .isLength({ min: 5 })
    .withMessage("pleas write at least 5 character"),
  validate, // 사용자 정의 유효성 검사 미들웨어 호출
];

// 회원가입 시 사용되는 유효성 검사 미들웨어
const validateSignup = [
  ...validateCredential, // 위에서 정의한 크리덴셜 유효성 검사 포함
  body("name").notEmpty().withMessage("write your name"), // 이름 유효성 검사
  body("email") // 이메일 유효성 검사
    .isEmail()
    .normalizeEmail()
    .withMessage("invalid email"),
  body("url") // URL 유효성 검사 (선택 사항)
    .isURL()
    .withMessage("invalid URL")
    .optional({ nullable: true, checkFalsy: true }),
  validate, // 사용자 정의 유효성 검사 미들웨어 호출
];

// 라우터 설정
router.post("/signup", validateSignup, authController.signup); // 회원가입 라우트
router.post("/login", validateCredential, authController.login); // 로그인 라우트
router.get("/me", isAuth, authController.me); // 현재 로그인된 사용자의 세션을 유지하며, 필요한 경우 클라이언트에 사용자 정보를 전달하는 라우트

export default router; // 라우터를 외부로 내보냄
