import { getSocketIO } from "../connection/socket.js";
import * as tweetRepository from "../data/tweet.js";

// 사용자 이름(username)을 기반으로 해당 사용자의 모든 트윗을 조회하거나,
// 지정되지 않은 경우 모든 사용자의 트윗을 가져옵니다.
export async function getTweets(req, res) {
  const username = req.query.username;
  const data = await (username
    ? tweetRepository.getAllByUsername(username)
    : tweetRepository.getAll());
  res.status(200).json(data);
}

// 주어진 ID를 기반으로 특정 트윗을 조회합니다.
export async function getTweet(req, res, next) {
  const id = req.params.id;
  const data = await tweetRepository.getById(id);
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
}

// 새로운 트윗을 생성하고, 해당 트윗을 소켓을 통해 전달합니다.
export async function createTweet(req, res, next) {
  const { text } = req.body;
  const tweet = await tweetRepository.create(text, req.userId);
  res.status(201).json(tweet);
  getSocketIO().emit("tweets", tweet);
}

// 주어진 ID의 트윗을 수정합니다.
// 단, 트윗의 작성자와 현재 요청 사용자가 동일해야 합니다.
export async function updateTweet(req, res, next) {
  const id = req.params.id;
  const text = req.body.text;
  const tweet = await tweetRepository.getById(id);

  if (!tweet) {
    return res.sendStatus(404);
  }
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403);
  }

  const updated = await tweetRepository.update(id, text);
  res.status(200).json(updated);
}

// 주어진 ID의 트윗을 삭제합니다.
// 단, 트윗의 작성자와 현재 요청 사용자가 동일해야 합니다.
export async function deleteTweet(req, res, next) {
  const id = req.params.id;
  const tweet = await tweetRepository.getById(id);

  if (!tweet) {
    return res.sendStatus(404);
  }
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403);
  }

  await tweetRepository.remove(id);
  res.sendStatus(204);
}
