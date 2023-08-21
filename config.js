// 'dotenv' 모듈을 임포트하여 .env 파일로부터 환경 변수를 읽어옵니다.
import dotenv from "dotenv";
dotenv.config();

// 필요한 환경 변수 또는 기본값을 가져오는 함수입니다. 만약 env 값이 없다면, default로 undefined가 출력 됩니다.
// 그리고 만약 두 값 모두 제공되지 않으면 오류를 발생시킵니다.
function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`${key} is undefined`);
  }
  return value;
}

export const config = {
  jwt: {
    // JWT 인증 설정입니다.
    secretKey: required("JWT_SECRET"), // JWT 서명 및 검증을 위한 시크릿 키
    expiresInSec: parseInt(required("JWT_EXPIRES_SEC", 17200)), // JWT 토큰의 만료 시간
  },

  bcrypt: {
    // 비밀번호 해싱을 위한 bcrypt 설정입니다.
    saltRounds: parseInt(required("BCRYPT_SALT_ROUNDS", 12)), // bcrypt 해싱을 위한 솔트 라운드 수
  },

  db: {
    // 데이터베이스 설정입니다.
    host: required("DB_HOST"), // 데이터베이스 호스트 이름
    user: required("DB_USER"), // 데이터베이스 사용자 이름
    database: required("DB_DATABASE"), // 사용하는 데이터베이스의 이름
    password: required("DB_PASSWORD"), // 데이터베이스 비밀번호
    port: required("DB_PORT"), // 데이터베이스 포트 번호
  },

  // 서버 포트 설정입니다.
  port: parseInt(required("PORT", 8080)),

  cors: {
    // CORS(교차 출처 리소스 공유) 설정입니다.
    allowedOrigin: required("CORS_ALLOW_ORIGIN"), // API에 접근이 허용되는 출처를 지정합니다.
  },
};
