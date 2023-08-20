import { validationResult } from "express-validator";

// express-validator를 통한 요청 유효성 검사 미들웨어
export const validate = (req, res, next) => {
  // validationResult 함수를 사용해 요청에서 발생한 검증 오류를 가져옴
  const errors = validationResult(req);

  // 오류가 없을 경우 다음 미들웨어나 라우터 핸들러로 진행
  if (errors.isEmpty()) {
    return next();
  }

  // 발생한 첫 번째 오류를 응답으로 반환 (클라이언트에게 오류 메시지를 보여주기 위함)
  return res.status(400).json({ message: errors.array()[0].msg });
};
