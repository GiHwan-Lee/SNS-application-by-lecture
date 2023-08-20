import SQ from "sequelize";
import { sequelize } from "../db/database.js";

const DataTypes = SQ.DataTypes;

// 사용자 정보에 대한 데이터 모델을 정의합니다.
export const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true, // 자동으로 증가하는 ID 값
      allowNull: false, // NULL 값 허용 안 함
      primaryKey: true, // 기본 키로 설정
    },
    username: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    url: DataTypes.TEXT,
  },
  { timestamps: false } // createdAt과 updatedAt 컬럼 자동 생성을 하지 않음
);

// 주어진 사용자 이름으로 DB에 있는 사용자 정보를 컨트롤러에게 전달합니다.
export async function findByUsername(username) {
  return User.findOne({ where: { username } });
}

// 주어진 ID로 DB에 있는 사용자 정보를 컨트롤러에게 전달합니다.
export async function findById(id) {
  return User.findByPk(id);
}

// 새로운 사용자 정보를 생성하고, 해당 사용자의 ID를 반환하여 컨트롤러에게 전달합니다.
export async function createUser(user) {
  return User.create(user).then((data) => data.dataValues.id);
}
