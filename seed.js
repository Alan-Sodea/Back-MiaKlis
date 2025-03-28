const { Cours, Question } = require("./models");
const sequelize = require("./config/database");

const coursData = [
    { titre: "Introduction à la Physique", matiere: "Science", time: 120, niveau: "Débutant", liste_chapitres: "Chapitre 1, Chapitre 2", cours: "Cours de physique", video: "https://video.com/1" },
    { titre: "Programmation en Python", matiere: "Technology", time: 150, niveau: "Débutant", liste_chapitres: "Chapitre 1, Chapitre 2", cours: "Cours de Python", video: "https://video.com/2" },
    { titre: "Les bases de l'électricité", matiere: "Engineering", time: 180, niveau: "Intermediaire", liste_chapitres: "Chapitre 1, Chapitre 2", cours: "Cours d'électricité", video: "https://video.com/3" },
    { titre: "Introduction aux mathématiques discrètes", matiere: "Mathematics", time: 160, niveau: "Avancé", liste_chapitres: "Chapitre 1, Chapitre 2", cours: "Cours de math discrètes", video: "https://video.com/4" }
];

const questionsByCours = {
    "Introduction à la Physique": [
        { question: "Quelle est l'unité de la force ?", case1: "Newton", case2: "Joule", case3: "Watt", case4: "Pascal", bonne_reponse: 1 },
        { question: "Quelle est la vitesse de la lumière ?", case1: "300 000 km/s", case2: "150 000 km/s", case3: "3 000 km/s", case4: "30 000 km/s", bonne_reponse: 1 }
    ],
    "Programmation en Python": [
        { question: "Comment affiche-t-on un message en Python ?", case1: "print()", case2: "echo()", case3: "show()", case4: "display()", bonne_reponse: 1 },
        { question: "Quel symbole est utilisé pour les commentaires en Python ?", case1: "//", case2: "/* */", case3: "#", case4: "--", bonne_reponse: 3 }
    ],
    "Les bases de l'électricité": [
        { question: "Quelle est l'unité de la résistance électrique ?", case1: "Ohm", case2: "Volt", case3: "Ampère", case4: "Watt", bonne_reponse: 1 },
        { question: "Quel composant stocke de l'énergie sous forme électrique ?", case1: "Résistance", case2: "Condensateur", case3: "Transistor", case4: "Diode", bonne_reponse: 2 }
    ],
    "Introduction aux mathématiques discrètes": [
        { question: "Que signifie P en logique propositionnelle ?", case1: "Probabilité", case2: "Proposition", case3: "Produit", case4: "Priorité", bonne_reponse: 2 },
        { question: "Quel est un exemple de structure discrète ?", case1: "Graphe", case2: "Dérivée", case3: "Intégrale", case4: "Équation différentielle", bonne_reponse: 1 }
    ]
};

async function insertData() {
    try {
        await sequelize.sync({force : true}); // Ne pas utiliser force:true pour éviter la suppression des données

        // Vérifier si la table Cours contient déjà des données
        const count = await Cours.count();
        if (count > 0) {
            console.log("🔹 La base de données contient déjà des données. Aucun enregistrement ajouté.");
            return;
        }

        // Insérer les cours
        const insertedCours = await Cours.bulkCreate(coursData);
        console.log("✅ Cours insérés avec succès !");

        let questionsData = [];

        for (let cours of insertedCours) {
            if (questionsByCours[cours.titre]) {
                questionsByCours[cours.titre].forEach(q => {
                    questionsData.push({ ...q, coursId: cours.id });
                });
            }
        }

        await Question.bulkCreate(questionsData);
        console.log("✅ Questions insérées avec succès !");
    } catch (error) {
        console.error("❌ Erreur lors de l'insertion des données :", error);
    }
}

module.exports = insertData;
