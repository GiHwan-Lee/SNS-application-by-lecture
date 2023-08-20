import SQ from "sequelize";
import { config } from "../config.js";

// DB 설정값 가져오기
const { host, port, user, database, password } = config.db;

// Sequelize 인스턴스 생성(Mysql과는 달리 sequelize는 pool을 자동으로 생성해주기에 따로 pool 생성 코드 필요 없음)
export const sequelize = new SQ.Sequelize(database, user, password, {
  host, // DB 호스트 주소
  port, // DB 포트 번호
  dialect: "postgres", // 사용할 데이터베이스의 종류. 여기서는 PostgreSQL 사용
  logging: false, // 쿼리 로깅을 비활성화. 활성화할 경우 쿼리가 콘솔에 출력됨
  dialectOptions: {
    ssl: {
      require: true, // SSL 연결 필요
      rejectUnauthorized: false, // 인증되지 않은 SSL 연결을 허용
    },
  },
});
