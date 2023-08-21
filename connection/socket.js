import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

// Socket 클래스 정의
class Socket {
  constructor(server) {
    // 소켓 서버를 초기화하며, CORS 설정을 적용합니다.
    this.io = new Server(server, {
      cors: {
        origin: config.cors.allowedOrigin,
      },
    });

    // 각 소켓 연결에 대한 미들웨어로, JWT 토큰을 검증하여 인증을 수행합니다.
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }
      jwt.verify(token, config.jwt.secretKey, (error, decoded) => {
        if (error) {
          return next(new Error("Authentication error"));
        }
        next();
      });
    });

    // 새로운 소켓 연결이 발생했을 때 콘솔에 메시지를 출력합니다.
    this.io.on("connection", () => console.log("Socket client connected"));
  }
}

// 전역 소켓 인스턴스
let socket;

// 소켓을 초기화하는 함수입니다.
// initSocket은 서버 시작 시 한 번만 호출되어야 합니다.
export function initSocket(server) {
  if (!socket) {
    socket = new Socket(server);
  }
}

// 초기화된 소켓 인스턴스를 반환하는 함수입니다.
// initSocket 함수가 먼저 호출되어야 합니다.
export function getSocketIO() {
  if (!socket) {
    throw new Error("Please call init first");
  }
  return socket.io;
}
