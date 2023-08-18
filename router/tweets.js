import express from "express";
import "express-async-errors";
import * as tweetController from "../controller/tweet.js";
import { body } from "express-validator";
import { validate } from "../middleware/validator.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

const validateTweet = [
  body("text")
    .trim()
    .isLength({ min: 3 })
    .withMessage("pleas write at least 3 character"),
  validate,
];

router.get("/", isAuth, tweetController.getTweets);

router.get("/:id", isAuth, tweetController.getTweet);

router.post("/", isAuth, validateTweet, tweetController.createTweet);

router.put("/:id", isAuth, validateTweet, tweetController.updateTweet);

router.delete("/:id", isAuth, tweetController.deleteTweet);

//이렇게 isAuth를 tweet의 모든 부분에 넣어준 이유는 tweet의 모든 요청을 me를 통해 token을 가지고 있는 상태일 때만 가능하도록 하기 위함이다.
//또한 isAuth를 사용해야 req.userId를 가져올 수도 있다.
//req.userId를 통해 사용자가 누구인지를 식별할 수 있다.
export default router;
