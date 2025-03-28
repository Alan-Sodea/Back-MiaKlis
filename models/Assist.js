const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Cours = require("./Cours");

const Assist = sequelize.define("Assist", {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
    allowNull: false,
  },
  coursId: {
    type: DataTypes.INTEGER,
    references: {
      model: Cours,
      key: "id",
    },
    allowNull: false,
  },
  score: {
    type: DataTypes.FLOAT, // Pourcentage de réussite
    allowNull: false,
  },
});

module.exports = Assist;
