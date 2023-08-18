// 필요한 모듈들을 임포트합니다.
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import "express-async-errors";

// express 앱 인스턴스를 생성합니다.
const app = express();

// CORS 설정을 위한 옵션 객체입니다.
const corsOption = {
  origin: config.cors.allowedOrigin, // 허용된 출처 설정
  credentials: true, // 인증 정보를 허용
  optionSuccessStatus: 200, // 성공 상태 코드 설정
};

// 미들웨어 설정
app.use(express.json()); // JSON 파싱을 위한 미들웨어
app.use(helmet()); // 보안을 위한 HTTP 헤더 설정 미들웨어
app.use(cors(corsOption)); // CORS 미들웨어를 설정된 옵션으로 사용
app.use(morgan("tiny")); // 로깅을 위한 미들웨어

// 라우터 설정
app.use("/tweets", tweetsRouter);
app.use("/auth", authRouter);

// 404 에러 처리를 위한 미들웨어
app.use((req, res) => {
  res.sendStatus(404);
});

// 서버에 대한 오류 처리 미들웨어
app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

// 데이터베이스와 동기화한 후 서버를 시작합니다.
sequelize.sync().then(() => {
  console.log(`Server is started... ${new Date()}`);
  const server = app.listen(config.port); // 설정된 포트에서 서버를 시작
  initSocket(server); // 소켓 초기화 함수 호출
});
