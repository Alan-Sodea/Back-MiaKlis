const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const insertData = require("./seed")
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const coursRoutes = require("./routes/coursRoutes");
const assistRoutes = require("./routes/assistRoutes");
const questionRoutes = require("./routes/questionRoutes");


const app = express();
app.use(cors({origin: "*"}));
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/cours", coursRoutes);
app.use("/assist", assistRoutes);
app.use("/questions", questionRoutes);

(async () => {
  try {
    await insertData();

    console.log("📌 Données insérées avec succès, démarrage du serveur...");
    
    const PORT = process.env.PORT || 5000;
    await app.listen(PORT, () => {
      console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation des données :", error);
  }
})();
