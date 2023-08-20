import jwt from "jsonwebtoken";
import { config } from "../config.js";
import * as userRepository from "../data/auth.js";

// 인증 실패 시 반환될 에러 메시지
const AUTH_ERROR = { message: "Authentication Error" };

// JWT를 통해 사용자 인증하는 미들웨어
export const isAuth = async (req, res, next) => {
  // HTTP 헤더에서 "Authorization" 값을 가져옴
  const authHeader = req.get("Authorization");

  // "Authorization" 헤더가 있는지, 그리고 'Bearer '로 시작하는지 확인
  if (!(authHeader && authHeader.startsWith("Bearer "))) {
    return res.status(401).json(AUTH_ERROR);
  }

  // 토큰 부분만 추출
  const token = authHeader.split(" ")[1];

  // 추출한 토큰이 유효한지 검증
  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    // 토큰 검증에서 오류가 발생하면 401 에러 반환
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }

    // 토큰에 저장된 id를 사용해 사용자 정보를 조회
    const user = await userRepository.findById(decoded.id);

    // 해당하는 사용자가 없으면 401 에러 반환
    if (!user) {
      return res.status(401).json(AUTH_ERROR);
    }

    // 토큰에서 해석된 사용자 ID를 req 객체에 저장
    req.userId = user.id;
    // 토큰을 req 객체에 저장
    req.token = token;

    // 다음 미들웨어/라우터 핸들러로 진행
    next();
  });
};
