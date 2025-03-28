const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Cours = require("./Cours");

const Question = sequelize.define("Question", {
    coursId: {
      type: DataTypes.INTEGER,
      references: {
        model: Cours,
        key: "id",
      },
      allowNull: false,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    case1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    case2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    case3: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    case4: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bonne_reponse: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 4,
      },
    },
  });

module.exports = Question;
