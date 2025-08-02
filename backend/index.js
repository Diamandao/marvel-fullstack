import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import charactersRoutes from "./routes/characters.js";
import comicsRoutes from "./routes/comics.js";

dotenv.config();
const app = express();
app.use(cors());

app.use("/characters", charactersRoutes);
app.use("/comics", comicsRoutes);

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Marvel Proxy");
});

app.get("/character/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.MARVEL_API_URL}/characters/${req.params.id}`,
      {
        params: {
          apikey: process.env.MARVEL_API_KEY,
        },
      }
    );
    res.json(response.data.data.results[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend lancé sur le port ${PORT}`);
});
