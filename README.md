# 프로젝트 이름

SNS application

# 프로젝트 소개

일반적인 SNS 어플리케이션처럼 사용자들끼리 게시글을 남기고 공유할 수 있습니다.

-이 프로젝트는 크게 '로그인', '게시글 남기기' 기능을 가진 2가지의 API로 이루어져 있고 MVC pattern으로 코드를 작성했습니다.

-유효성 검사 기능을 추가하여 어플리케이션의 완성도를 높였습니다.

-cors 기능을 추가하여 서버에게 아무나 요청을 하는 일이 없도록 하여 서버의 안정성을 높였습니다.

-'로그인' API의 인증 방식으로는 stateless한 JWT를 사용했고, bcrypt를 통해 사용자의 비밀번호를 암호화 하여 보안성을 높였습니다.

-config 파일을 따로 만들어서 사용자의 개인정보와 관련된 내용, port 번호 등의 노출을 최소화하여 보안을 강화했습니다.

-socket을 통해 실시간으로 게시글이 올라오고 수정되고 삭제되는걸 확인할 수 있습니다.

-DB는 MySQL과 ORM Sequelize를 사용했습니다. 다만 서버를 배포할 때는 호스팅 업체의 제약으로 인해 Postgres DB로 배포 했습니다.

-배포는 프론트엔드는 Netlify, 서버는 Heroku에서 각각 진행했습니다.

# 프로젝트 실행 방법

-아래 링크를 클릭하여 이 어플리케이션에 접속할 수 있습니다.

https://calebdwitter.netlify.app/

# 프로젝트 구조 및 파일 설명

## 1. 디렉토리 구조

- `/server` : 서버 애플리케이션 코드가 있는 디렉토리입니다.

## 2. 서버 디렉토리 구조

서버의 코드는 MVC 패턴에 따라 구조화되어 있습니다.

- `/server`
  - `app.js`: 서버 애플리케이션의 진입점입니다. 서버를 시작하고, 필요한 미들웨어를 설정하며, 라우트를 설정합니다.
  - `config.js`: 환경 변수 및 설정 값들을 관리하는 파일입니다.
  - `.env`: 비공개 환경 변수를 저장하는 파일입니다. 이 파일은 git에 올리지 않아야 합니다.
  - `.gitignore`: git이 추적하지 않아야 하는 파일 및 디렉토리를 명시하는 파일입니다.
  - `package.json`: 프로젝트에 대한 메타데이터와 사용하는 패키지를 나열하는 파일입니다.
  - `/connection`
    - `socket.js`: 소켓 연결을 관리하며, 연결 시 JWT 토큰으로 사용자를 확인합니다.
  - `/middleware`
    - `auth.js`: 요청 헤더의 JWT 토큰을 검증하여 사용자 인증을 수행하는 미들웨어입니다.
    - `validator.js`: 요청의 유효성을 express-validator를 통해 검사하며, 오류가 발생할 경우 클라이언트에게 알려주는 미들웨어입니다.
  - `/controller`
    - `auth.js`: 사용자 인증 관련 요청 처리 로직이 구현된 컨트롤러 파일입니다.
    - `tweet.js`: 게시글 관련 요청 처리 로직이 구현된 컨트롤러 파일입니다.
  - `/data`
    - `auth.js`: 사용자 정보 데이터 모델을 정의하고, 사용자 정보에 관한 CRUD 작업을 처리하는 데이터 접근 함수들을 제공합니다.
    - `tweet.js`: 게시글 데이터 모델을 정의하고, 게시글과 관련된 CRUD 작업을 처리하는 데이터 접근 함수들을 제공합니다. 또한 사용자 정보와의 관계를 설정하여 사용자 정보를 포함한 게시글 조회 기능도 지원합니다.
  - `/db`
    - `database.js`: 데이터베이스 연결 코드가 있는 파일입니다.
  - `/router`
    - `auth.js`: 사용자 인증 관련 라우팅을 관리하는 파일입니다. 이 파일은 사용자 인증 관련 요청을 적절한 컨트롤러 메서드에 연결합니다.
    - `tweets.js` : 게시글 관련 라우팅을 관리하는 파일입니다. 이 파일은 게시글 관련 요청을 적절한 컨트롤러 메서드에 연결합니다.

# 기술 스택

- JavaScript: 프로그래밍 언어로, 이 프로젝트에서는 클라이언트와 서버 측 모두의 로직 개발에 사용되었습니다.
- Node.js: 서버 사이드 JavaScript 실행 환경
- Express.js: 웹 애플리케이션 프레임워크
- MySQL: 관계형 데이터베이스 시스템
- dotenv: 환경 변수를 .env 파일에서 프로세스의 환경 변수로 로드
- express-async-errors: Express 라우트와 미들웨어 내에서 비동기 오류를 처리
- Helmet: HTTP 헤더 설정을 통해 애플리케이션 보안을 강화하는 미들웨어
- Morgan: HTTP 요청 로거 미들웨어
- CORS: Cross-Origin Resource Sharing (CORS)을 가능하게 하는 미들웨어
- Nodemon: Node.js 애플리케이션의 개발을 단순화하는 도구 (개발 모드로 설치)

# API 개요

## Auth API

### 1. 가입하기

- `POST /auth/signup`: 사용자 정보를 기반으로 회원가입을 진행하며, 성공 시 JWT 토큰과 사용자 이름을 반환합니다.

### 2. 로그인 하기

- `POST /auth/login`: 사용자 아이디와 비밀번호를 통해 로그인을 진행하며, 성공 시 JWT 토큰과 사용자 이름을 반환합니다.

### 3. 로그인 된 사용자의 세션 유지하기

- `GET /auth/me`: 로그인 한 사용자가 다른 작업을 한 뒤에 다시 이 어플리케이션에 왔을 때 혹은 새로고침을 했을 때 로그인 상태를 유지해주기 위한 API 입니다. 현재 로그인된 사용자의 JWT 토큰과 사용자 이름을 반환합니다.

## Tweet API

### 1. 모든 게시글 가져오기

- `GET /tweets`: 모든 사용자의 게시글을 최신순으로 가져옵니다. 만약 쿼리에 사용자 이름이 포함되어 요청이 들어온 경우, 해당 사용자의 게시글만 가져옵니다.

### 2. 아이디로 특정 게시글 가져오기

- `GET /tweets/:id`: 주어진 ID를 기반으로 특정 게시글을 가져옵니다.

### 3. 새로운 게시글 작성

- `POST /tweets`: 로그인된 사용자를 기반으로 새로운 게시글을 작성하며, 성공 시 해당 게시글 정보를 반환합니다.

### 4. 아이디로 게시글 수정하기

- `PUT /tweets/:id`: 로그인된 사용자가 작성한 트윗만 수정 가능하며, 성공 시 수정된 게시글 정보를 반환합니다.

### 5. 아이디로 게시글 삭제하기

- `DELETE /tweets/:id`: 로그인된 사용자가 작성한 트윗만 삭제 가능하며, 성공 시 204 상태 코드를 반환합니다.

# 디버깅 해결 과정 및 느낀점

프로젝트를 진행하면서 중간 중간에 발생한 작은 오류들은 쉽게 발견해서 해결했지만 2가지의 큰 오류들 때문에 많은 고생을 했습니다.

첫번째는 Auth 관련 오류였습니다. sign-up을 하면 곧바로 log-in이 되도록 구현했는데 실제로 어플리케이션을 사용할 때 sign-up은 되지만 log-in이 안 되면서 auth 오류가 발생했습니다.
새로고침을 한 뒤에 log-in을 하면 그 때는 잘 동작했기 때문에 인과관계를 따져보면서 문제 되는 곳의 코드를 살펴보니 arrow function에서 코드를 잘못 작성 해주면서 발생한 오류인것을
발견했습니다. 이후 수정 했더니 정상적으로 동작했습니다.

두번째는 cors 관련 오류였습니다. 첫번째 오류 이후에 정상적으로 동작하다가 일정 시간이 흐른 뒤에 발생한 오류였습니다. 결과적으로 서버 호스팅 사이트의 환경변수와 서버에서 작성한
환경변수 코드의 내용이 불일치 하여 발생한 오류인것을 확인하여 이를 수정했더니 정상적으로 동작했습니다.

확실히 기존에 웹사이트를 만들었을 때 발생했던 오류와는 스케일이 다른 오류들이었습니다. 꽤 오랜 시간 동안 오류를 해결하기 위해 수 많은 노력을 했고 결과적으로 스스로 해결을 했습니다.
오류를 해결하는 과정 동안 스트레스를 많이 받았었는데 오히려 프로젝트를 진행하면서 부족했던 지식에 대해서 습득할 수 있었던것 같습니다.
또한 잘 안 풀릴 때 급한 마음에 무작정 이것저것 찾아보면서 시도를 하는 것보다는 단 1시간이라도 잠시 휴식을 취한 뒤에 해결하려고 노력하는 방식이 효과적이라는 것도 알게 되었습니다.
