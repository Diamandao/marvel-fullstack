import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend lancé sur le port ${PORT}`);
});
