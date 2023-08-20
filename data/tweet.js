import SQ from "sequelize";
import { sequelize } from "../db/database.js";
import { User } from "./auth.js";

const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

// tweet 데이터 모델을 정의합니다.
const Tweet = sequelize.define("tweet", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// User 모델(테이블)과 Tweet 모델(테이블)의 관계를 설정합니다. 각 트윗은 한 사용자에게 속합니다.
Tweet.belongsTo(User);

// 사용자 정보를 포함한 게시글 조회를 위한 설정입니다.
const INCLUDE_USER = {
  attributes: [
    "id",
    "text",
    "createdAt",
    "userId",
    [Sequelize.col("user.name"), "name"],
    [Sequelize.col("user.username"), "username"],
    [Sequelize.col("user.url"), "url"],
  ],
  include: {
    model: User,
    attributes: [],
  },
};

// 게시글을 최신순으로 정렬하기 위한 설정입니다.
const ORDER_DESC = {
  order: [["createdAt", "DESC"]],
};

// 모든 게시글을 조회한 뒤 데이터를 컨트롤러에게 전달합니다.
export async function getAll() {
  return Tweet.findAll({ ...INCLUDE_USER, ...ORDER_DESC });
}

// 주어진 사용자 이름으로 게시글을 조회한 뒤 데이터를 컨트롤러에게 전달합니다.
export async function getAllByUsername(username) {
  return Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    include: {
      ...INCLUDE_USER.include,
      where: { username },
    },
  });
}

// 주어진 ID로 게시글을 조회한 뒤 데이터를 컨트롤러에게 전달합니다.
export async function getById(id) {
  return Tweet.findOne({
    where: { id },
    ...INCLUDE_USER,
  });
}

// 새로운 게시글을 생성한 뒤 해당 게시글을 반환하여 컨트롤러에게 전달합니다.
export async function create(text, userId) {
  return Tweet.create({ text, userId }) //
    .then((data) => getById(data.dataValues.id));
}

// 주어진 ID의 게시글 내용을 업데이트합니다.
export async function update(id, text) {
  return Tweet.findByPk(id, INCLUDE_USER).then((tweet) => {
    tweet.text = text;
    return tweet.save();
  });
}

// 주어진 ID의 게시글을 삭제합니다.
export async function remove(id) {
  return Tweet.findByPk(id).then((tweet) => {
    tweet.destroy();
  });
}
