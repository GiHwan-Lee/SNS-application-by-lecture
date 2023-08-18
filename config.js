import dotenv from "dotenv";
dotenv.config();

function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`${key} is undefined`);
  }
  return value;
}
//required는 실수로 환경변수에 있지도 않은 데이터를 입력했을 때를 방지하기 위해 작성한 것이다.
//process.env[key] 값이 없다면 default로 설정한 undefined가 출력된다.
//혹은 null이라면 Error를 던져준다.

export const config = {
  jwt: {
    secretKey: required("JWT_SECRET"),
    expiresInSec: parseInt(required("JWT_EXPIRES_SEC", 17200)),
  },

  bcrypt: {
    saltRounds: parseInt(required("BCRYPT_SALT_ROUNDS", 12)),
  },

  db: {
    host: required("DB_HOST"),
    user: required("DB_USER"),
    database: required("DB_DATABASE"),
    password: required("DB_PASSWORD"),
    port: required("DB_PORT"),
  },

  port: parseInt(required("PORT", 8080)),

  cors: {
    allowedOrigin: required("CORS_ALLOW_ORIGIN"),
  },
};
