import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "express-async-errors";
import * as userRepository from "../data/auth.js";
import { config } from "../config.js";

// 회원가입 함수
export async function signup(req, res) {
  const { username, password, name, email, url } = req.body;

  // 사용자 이름을 기반으로 기존 사용자 확인
  const found = await userRepository.findByUsername(username);
  if (found) {
    return res.status(409).json({ message: `${username} already exists` });
  }

  // 비밀번호 해싱 처리
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);

  // 사용자 생성
  const userId = await userRepository.createUser({
    username,
    password: hashed,
    name,
    email,
    url,
  });

  // 사용자에게 반환할 JWT 토큰 생성
  const token = createJwtToken(userId);

  res.status(201).json({ token, username });
}

// 로그인 함수
export async function login(req, res) {
  const { username, password } = req.body;

  // 사용자 이름으로 사용자 조회
  const user = await userRepository.findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: "Invalid user or password" });
  }

  // 저장된 해시와 사용자가 제출한 비밀번호를 비교
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid user or password" });
  }

  // 로그인 성공 시 JWT 토큰 생성
  const token = createJwtToken(user.id);

  res.status(200).json({ token, username });
}

// JWT 토큰 생성 함수
function createJwtToken(id) {
  // JWT에 사용자 ID를 포함하여 토큰 생성
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

// 현재 로그인된 사용자의 세션을 유지하며, 필요한 경우 클라이언트에 사용자 정보를 전달하기 위해 만든 함수
// 토큰의 userId를 가져와서 data층의 findById에 전달 후 해당 사용자의 계정이 존재하는지를 확인
export async function me(req, res, next) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ token: req.token, username: user.username });
}
