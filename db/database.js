import SQ from "sequelize";
import { config } from "../config.js";

const { host, port, user, database, password } = config.db;

export const sequelize = new SQ.Sequelize(database, user, password, {
  host,
  port,
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
//dialectOptions에서 ssl은 require true라서 ssl을 사용하여 연결을 하겠다는 의미인데,
//rejectUnauthorized가 false라서 ssl 인증서가 미인증이더라도 연결을 일단 허용하겠다는 의미이다. 이거 수정해야 한다. true로 되도록.
