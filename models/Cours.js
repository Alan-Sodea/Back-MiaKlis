const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cours = sequelize.define("Cours", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true, // Auto-incrément
      primaryKey: true,    // Clé primaire
      allowNull: false,    // Ne peut pas être null
    },
    titre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    matiere: {
      type: DataTypes.ENUM("Science", "Technology", "Engineering", "Mathematics"),
      allowNull: false,
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    niveau: {
      type: DataTypes.ENUM("Débutant", "Intermediaire", "Avancé"),
      allowNull: false,
    },
    liste_chapitres: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cours: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    video: {
      type: DataTypes.STRING,
      allowNull: true,
    },
})

module.exports = Cours;
