import express from "express";
import "express-async-errors";
import * as tweetController from "../controller/tweet.js";
import { body } from "express-validator";
import { validate } from "../middleware/validator.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

// 게시글 유효성 검사 미들웨어
const validateTweet = [
  body("text")
    .trim()
    .isLength({ min: 3 })
    .withMessage("pleas write at least 3 character"),
  validate,
];

// 모든 게시글 가져오기
router.get("/", isAuth, tweetController.getTweets);

// 아이디로 특정 게시글 가져오기
router.get("/:id", isAuth, tweetController.getTweet);

// 새로운 게시글 작성
router.post("/", isAuth, validateTweet, tweetController.createTweet);

// 아이디로 게시글 수정하기
router.put("/:id", isAuth, validateTweet, tweetController.updateTweet);

// 아이디로 게시글 삭제하기
router.delete("/:id", isAuth, tweetController.deleteTweet);

export default router;
