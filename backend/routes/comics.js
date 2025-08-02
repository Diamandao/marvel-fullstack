import express from "express";
import axios from "axios";

const router = express.Router();

// 🔹 Route GET pour la liste de comics
router.get("/", async (req, res) => {
  try {
    const { title, page = 1, characterId } = req.query;

    const limit = 100;
    const skip = (page - 1) * limit;

    const params = {
      apiKey: process.env.MARVEL_API_KEY,
      skip,
      limit,
    };

    if (title) {
      params.title = title;
    }

    if (characterId) {
      params.characterId = characterId;
    }

    const response = await axios.get(`${process.env.MARVEL_API_URL}/comics`, {
      params,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Erreur backend /comics :", error.message);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des comics." });
  }
});

// 🔹 Route GET pour les détails d’un comic
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `${process.env.MARVEL_API_URL}/comic/${id}`,
      {
        params: {
          apiKey: process.env.MARVEL_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Erreur backend /comic/:id :", error.message);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du comic." });
  }
});

export default router;
