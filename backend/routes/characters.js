import express from "express";
import axios from "axios";

const router = express.Router();

// 🔹 Route pour la liste de personnages avec recherche et pagination
router.get("/", async (req, res) => {
  try {
    const { name, page = 1 } = req.query;

    const response = await axios.get(
      `${process.env.MARVEL_API_URL}/characters`,
      {
        params: {
          apiKey: process.env.MARVEL_API_KEY,
          name,
          page,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Erreur dans GET /characters :", error.message);
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Route pour afficher les détails d'un personnage
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `${process.env.MARVEL_API_URL}/character/${id}`,
      {
        params: {
          apiKey: process.env.MARVEL_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Erreur dans GET /characters/:id :", error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
