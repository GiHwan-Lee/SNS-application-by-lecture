import jwt from "jsonwebtoken";
import { config } from "../config.js";
import * as userRepository from "../data/auth.js";

const AUTH_ERROR = { message: "Authentication Error" };

export const isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!(authHeader && authHeader.startsWith("Bearer "))) {
    return res.status(401).json(AUTH_ERROR);
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json(AUTH_ERROR);
    }
    req.userId = user.id;
    req.token = token;
    next();
  });
};
//여기서 user의 id를 가져온 뒤, 이를 req.userId 라는 이름으로 할당시켰다.
//이런 식으로 개발자는 원하는 데이터를 다른 곳에서 사용하고 싶을 때 req.~~ 의 형태로 지정할 수 있다.
//이렇게 생성된 req는 아무곳에서나 사용이 가능한건 아니다. 지금 auth.js middleware에 있는 isAuth를 실행시킨 곳에서만 사용이 가능하다.
//즉, req.~~를 생성했다고 해서 다른 모든 req에 req.~~가 들어 있게 되는건 아니라는 것이다.
//auth router를 보자. router의 get의 me를 보면 isAuth를 실행시켰다.
//isAuth가 잘 실행된다면, 그 후 authController.me가 실행이 된다.
//이렇게 앞서 isAuth를 실행시켰다면 authController.me에서는 이제 req.userId를 가져올 수 있게 된다.
//그래서 auth controller의 me 함수에서 req.userId를 가져온 것이다.

//tweet 부분에서도 req.userId를 사용하여 userId를 외래키로 설정했는데, 이게 가능한 이유는 tweets router에도 isAuth가 있기 때문이다.
//tweet의 router를 보자. 모든 요청에 isAuth가 들어있다. 결국 tweet의 모든 req에는 이제 req.userId가 있는 것이다.

//req.token = token을 해준 이유는 auth controller me 함수 부분을 보면 알 수 있다.
//마지막에 res.status(200).json({ token: req.token, username: user.username }); 이 코드에서 req.token을 사용해서 res 해주도록 하고 있는데
//req.token의 값이 없기 때문에 이곳에서 req.token을 해준 것이다.
//마치 isAuth의 userId 처럼 router에서 다음에 실행될 함수인 authController.me에서 req.token을 사용해야 하기에 이렇게 따로 넣어줘야 하는 것이다.
