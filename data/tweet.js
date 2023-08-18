import SQ from "sequelize";
import { sequelize } from "../db/database.js";
import { User } from "./auth.js";

const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

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

Tweet.belongsTo(User);

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

const ORDER_DESC = {
  order: [["createdAt", "DESC"]],
};

export async function getAll() {
  return Tweet.findAll({ ...INCLUDE_USER, ...ORDER_DESC });
}

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

export async function getById(id) {
  return Tweet.findOne({
    where: { id },
    ...INCLUDE_USER,
  });
}

export async function create(text, userId) {
  return Tweet.create({ text, userId }) //
    .then((data) => getById(data.dataValues.id));
}
//여기서도 controller에서 보면 req.userId를 매개변수에 넣어줬고 이를 받아서 DB에 userId와 함께 트윗 정보를 저장한다.

export async function update(id, text) {
  return Tweet.findByPk(id, INCLUDE_USER).then((tweet) => {
    tweet.text = text;
    return tweet.save();
  });
}

export async function remove(id) {
  return Tweet.findByPk(id).then((tweet) => {
    tweet.destroy();
  });
}

//create 함수 외에 update나 remove에는 userId가 없는 이유는 굳이 이를 통해 트윗글을 식별하기 보다는 기본키인 id가 있기 때문에 id를 활용하는게 낫기 때문이다.
