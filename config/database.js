const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "../database.sqlite"), // Fichier SQLite
    logging: false, // Désactiver les logs SQL
});

module.exports = sequelize;
