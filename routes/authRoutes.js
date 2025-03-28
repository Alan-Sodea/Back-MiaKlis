const express = require("express");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

const router = express.Router();

// Route d'inscription (register)
router.post("/register", async (req, res) => {
  try {
    const { nom, password, email } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ where: { nom } });
    if (userExists) {
      return res.status(400).json("Nom d'utilisateur déjà enregistré");
    }

    const userExists1 = await User.findOne({ where: { email } });
    if (userExists1) {
      return res.status(400).json("E-mail déjà enregistré");
    }

    // Créer l'utilisateur
    const newUser = await User.create({ nom, password, email });

    res.json({ message: "Utilisateur créé avec succès", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route de connexion (login)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json("Utilisateur non trouvé");
    }

    // Comparer le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json("Mot de passe incorrect");
    }


    res.json({ message: "Connexion réussie", user });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
