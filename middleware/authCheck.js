const { User } = require("../models");
const bcrypt = require("bcryptjs");


const authenticateUser = async (email, password) => {
  
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return {error : "Utilisateur non trouvé"}
    }
    
    // Comparer le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: "Mot de passe incorrect" };
    }
  
    return user

}

module.exports = authenticateUser;
