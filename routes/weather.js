const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const router = express.Router();
require("dotenv").config();

const METEOBLUE_API_KEY = process.env.METEOBLUE_API_KEY;

// Carregar o arquivo JSON com as coordenadas das cidades
const cities = JSON.parse(fs.readFileSync(path.join(__dirname, "../cities.json"), "utf8"));

// Rota para buscar a previsão do tempo
router.get("/forecast", async (req, res) => {
  try {
    const { lat, lon, city } = req.query; // Recebe latitude, longitude ou cidade

    let url;
    if (city) {
      // Encontrar as coordenadas da cidade no arquivo JSON
      const cityData = cities.find(c => c.city.toLowerCase() === city.toLowerCase());
      if (!cityData) {
        return res.status(404).json({ error: "Cidade não encontrada" });
      }

      url = `https://my.meteoblue.com/packages/basic-day?apikey=${METEOBLUE_API_KEY}&lat=${cityData.lat}&lon=${cityData.lon}&format=json`;
    } else if (lat && lon) {
      url = `https://my.meteoblue.com/packages/basic-day?apikey=${METEOBLUE_API_KEY}&lat=${lat}&lon=${lon}&format=json`;
    } else {
      return res.status(400).json({ error: "Cidade ou latitude e longitude são obrigatórios" });
    }

    console.log(`Fetching weather data from URL: ${url}`);
    const response = await axios.get(url);
    console.log("Weather data received from API:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching weather data from API:", error);
    res.status(500).json({ error: "Erro ao obter a previsão do tempo" });
  }
});

// Nova rota para fornecer a lista de cidades
router.get("/cities", (req, res) => {
  res.json(cities);
});

module.exports = router;