import { config } from "../config.js";
import SQ from "sequelize";

const { host, port, user, database, password } = config.db;

export const sequelize = new SQ.Sequelize(database, user, password, {
  host,

  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
