const sequelize = require("../config/database");

const User = require("./User");
const Cours = require("./Cours");
const Question = require("./Question");
const Assist = require("./Assist");

User.hasMany(Assist, { foreignKey: "userId" });
Cours.hasMany(Question, { foreignKey: "coursId" });
Cours.hasMany(Assist, { foreignKey: "coursId" });

sequelize.sync({ force: true }) // Recrée la base à chaque démarrage
  .then(() => console.log("Base de données synchronisée"))
  .catch(err => console.error("Erreur de synchronisation :", err));

module.exports = { User, Cours, Question, Assist };
