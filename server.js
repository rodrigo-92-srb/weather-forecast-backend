require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { Pool } = require("pg");
const cron = require('node-cron');

const app = express();
const port = process.env.PORT || 5000;
const weatherRoutes = require("./routes/weather");

// Configurar CORS
app.use(cors());

app.use(express.json());
app.use("/api/weather", weatherRoutes);

// Configuração do banco de dados
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Rota de teste
app.get("/", (req, res) => {
  res.send("API de Clima funcionando!");
});

// Rota para salvar previsão do tempo
app.post("/api/weather/save", async (req, res) => {
    try {
      const { date, temp_min, temp_max, conditions, wind_speed, wind_direction, precipitation_probability } = req.body;
  
      const query = `
        INSERT INTO forecasts (date, temp_min, temp_max, conditions, wind_speed, wind_direction, precipitation_probability)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
  
      const values = [date, temp_min, temp_max, conditions, wind_speed, wind_direction, precipitation_probability];
  
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao salvar previsão do tempo" });
    }
});

// Rota para buscar previsões salvas
app.get("/api/weather/reports", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM forecasts ORDER BY date ASC");
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao obter previsões salvas" });
    }
});

// Função para buscar dados da API da Meteoblue e salvar no banco de dados
async function fetchAndSaveWeatherData() {
  try {
    const lat = '-19.469'; // Substitua pela latitude desejada
    const lon = '-42.5367'; // Substitua pela longitude desejada
    const METEOBLUE_API_KEY = process.env.METEOBLUE_API_KEY;
    const url = `https://my.meteoblue.com/packages/basic-day?apikey=${METEOBLUE_API_KEY}&lat=${lat}&lon=${lon}&format=json`;

    const response = await axios.get(url);
    const weatherData = response.data.data_day;

    const { time, temperature_min, temperature_max, precipitation_probability, windspeed_mean, winddirection, predictability } = weatherData;

    for (let i = 0; i < time.length; i++) {
      const date = time[i];
      const temp_min = temperature_min[i];
      const temp_max = temperature_max[i];
      const conditions = predictability[i]; // Ajuste conforme necessário
      const wind_speed = windspeed_mean[i];
      const wind_direction = winddirection[i];
      const precipitation_prob = precipitation_probability[i];

      const query = `
        INSERT INTO forecasts (date, temp_min, temp_max, conditions, wind_speed, wind_direction, precipitation_probability)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

      const values = [date, temp_min, temp_max, conditions, wind_speed, wind_direction, precipitation_prob];

      const result = await pool.query(query, values);
      console.log('Dados de previsão do tempo salvos:', result.rows[0]);
    }
  } catch (error) {
    console.error('Erro ao buscar ou salvar dados de previsão do tempo:', error);
  }
}

// Configurar cron job para executar a cada 6 horas
cron.schedule('0 */6 * * *', fetchAndSaveWeatherData);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});