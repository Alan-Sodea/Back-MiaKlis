const express = require("express");
const router = express.Router();
const { Cours } = require("../models");
const authenticateUser = require("../middleware/authCheck");

// Ajouter un cours
router.post("/", async (req, res) => {

    const {email, password} = req.body
    if (!(email && password))return res.status(500).json({error : "You must be connected"})
    const datas = await authenticateUser(email, password)


    if (datas.error) res.status(500).json({error : datas.error})
    
    try {
        const cours = await Cours.create(req.body);
        res.json(cours);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtenir tous les cours
router.get("/", async (req, res) => {

    const {email, password} = req.query
    if (!(email && password))return res.status(500).json({error : "You must be connected"})
    const datas = await authenticateUser(email, password)
    
    if (datas.error) res.status(500).json({error : datas.error})
        
    const cours = await Cours.findAll();

    res.json(cours);
});

module.exports = router;
