const express = require("express");
const { Question, Cours } = require("../models");
const authenticateUser = require("../middleware/authCheck");

const router = express.Router();

// Route pour récupérer les questions d'un cours spécifique
router.get("/:coursId", async (req, res) => {

    // const {email, password} = req.query
    // if (!(email && password))return res.status(500).json({error : "You must be connected"})
    // const user = await authenticateUser(email, password)
      
    // if (user.error) res.status(500).json({error : user.error})

    try {
      const { coursId } = req.params;
      // Vérifier si le cours existe
      const cours = await Cours.findAll({
        where: { id : coursId },
      });

      if (!cours) {
        return res.status(404).json({ error: "Cours non trouvé" });
      }

      // Récupérer toutes les questions associées à ce cours
      const questions = await Question.findAll({
        where: { coursId },
      });
      res.json({ coursId, questions });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

module.exports = router;
