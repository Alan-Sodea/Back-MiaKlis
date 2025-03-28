const express = require("express");
const { Assist, Cours, User } = require("../models");
const authenticateUser = require("../middleware/authCheck");

const router = express.Router();

// Route pour terminer un cours
router.post("/", async (req, res) => {

    const {email, password} = req.body

    if (!email, !password) {return res.status(500).json({error: "vous devez être connecté"})}
    const user = await authenticateUser(email, password)
    if (user.error) res.status(500).json({error : user.error})

    try {
        const { coursId, score } = req.body;
        const userId = user.id; // ID de l'utilisateur connecté
        // Vérifier si le cours existe
        const cours = await Cours.findByPk(coursId);
        if (!cours) {
            return res.status(404).json({ error: "Cours non trouvé" });
        }
        
        // Vérifier si l'utilisateur a déjà terminé ce cours
        const assistExist = await Assist.findOne({ where: { userId, coursId } });
        if (assistExist) {
            return res.status(400).json({ error: "Cours déjà terminé par cet utilisateur" });
        }
        
        // Vérifier si l'utilisateur a bien réussi (score >= 80%)
        if (score < 0.8) {
            return res.status(400).json({ error: "Le score est insuffisant pour terminer ce cours" });
        }
        
        // Enregistrer la progression de l'utilisateur
        const assist = await Assist.create({ userId, coursId, score });

        res.json({ message: "Cours terminé avec succès", assist });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route pour récupérer les cours terminés par un utilisateur
router.get("/", async (req, res) => {

    const {email, password} = req.query
    const user = await authenticateUser(email, password)
    
    if (user.error) res.status(500).json({error : user.error})

    try {
      const userId = user.id;
  
      // Récupérer les cours terminés
      const assistRecords = await Assist.findAll({
        where: { userId },
        include: [{ model: Cours, attributes: ["id", "titre", "matiere", "niveau"] }],
      });
  
      res.json(assistRecords);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

  // Route pour récupérer le score d'un étudiant sur un cours spécifique
router.get("/score/:coursId", async (req, res) => {

    const {email, password} = req.query
    if (!(email && password))return res.status(500).json({error : "You must be connected"})
    const user = await authenticateUser(email, password)
    
    if (user.error) res.status(500).json({error : user.error})

    try {
      const userId = user.id; // Récupérer l'ID de l'utilisateur connecté
      const { coursId } = req.params; // Récupérer l'ID du cours depuis l'URL
  
      // Vérifier si un enregistrement existe dans Assist
      const assistRecord = await Assist.findOne({ where: { userId, coursId } });
  
      // Retourner 0 si l'utilisateur n'a pas encore passé le cours
      const score = assistRecord ? assistRecord.score : 0;
  
      res.json({ coursId, userId, score });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});


// Route pour récupérer le score total d'un utilisateur
router.get("/scoretotal", async (req, res) => {
    const {email} = req.query
    if (!(email))return res.status(500).json({error : "You must be connected"})

    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.json({error : "Utilisateur non trouvé"})
    }

    const userId = user.id;

    try {
        // Calcul du score total en additionnant les scores des cours complétés
        const scores = await Assist.findAll({
            where: { userId },
            attributes: ["score"]
        });

        // Calculer la somme des scores
        const totalScore = scores.reduce((acc, curr) => acc + curr.score, 0);

        res.json({ userId, totalScore });
    } catch (error) {
        console.error("Erreur lors du calcul du score total :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.get("/leaderboard", async (req, res) => {
    const users = await User.findAll();


    if (!users) {
        return res.status(500).json({error : "Utilisateur non trouvé"})
    }
    
    let leader_board = [];
    let i = 0;
    while (i < users.length) {
        console.log(i)
        let user = users[i]; 
        const userId = user.id;
        console.log(user)
        try {
            // Calcul du score total en additionnant les scores des cours complétés
            const scores = await Assist.findAll({
                where: { userId },
                attributes: ["score"]
            });
    
            // Calculer la somme des scores
            const totalScore = scores.reduce((acc, curr) => acc + curr.score, 0);

            leader_board.push({
                id: userId,
                email : user.email,
                name : user.nom,
                totalScore: totalScore
            });

            console.log(leader_board)
        } catch (error) {
            console.error("Erreur lors du calcul du score total :", error);
            res.status(500).json({ error: "Erreur serveur" });
        }

        
        i++;
    }

    res.status(200).json({
        leaderboard: leader_board.sort((a, b) => b.totalScore - a.totalScore)
    })
});

// Route pour récupérer le nombre de personnes ayant terminé un cours
router.get("/cours/:id/participants", async (req, res) => {
    const { id } = req.params; // Récupérer l'ID du cours depuis l'URL

    try {
        // Compter le nombre de personnes ayant terminé ce cours
        const participants = await Assist.count({
            where: {
                coursID: id, // L'ID du cours
            }
        });
        res.json({ participants });
    } catch (error) {
        console.error("Erreur lors du calcul du nombre de participants :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});


module.exports = router;
