import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { title, page } = req.query;

    const response = await axios.get(`${process.env.MARVEL_API_URL}/comics`, {
      params: {
        apiKey: process.env.MARVEL_API_KEY,
        title,
        page,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
