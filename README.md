# Weather Forecast Frontend

Aplicação desenvolvida com Node para consumir a API da Meteoblue.
Essa aplicação é consumida pelo frontend contido nesse repositório:

- https://github.com/rodrigo-92-srb/weather-forecast-frontend

## 1. Pré-requisitos:

- NodeJS
- PostgreSQL
- Git

## 2. Clonar o Repositório:

Abra o terminal e execute o seguinte comando para clonar o repositório para o seu ambiente local:
 
`git clone https://github.com/rodrigo-92-srb/weather-forecast-backend.git`

## 3. Instalar Dependências:

Navegue até o diretório do projeto e instale as dependências necessárias utilizando o npm:

- `cd weather-forecast-backend`

- `npm install`

## 4. Configurar Variáveis de Ambiente:

Se desejar mudar alguma configuração relacionada a API ou banco de dados acesse o arquivo .env na raiz do projeto e ajuste, atualmente o arquivo está dessa forma:
 ```ini
PORT=5000
METEOBLUE_API_KEY=sm4jM8QO0htBfHDY
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=weather_db
DB_PORT=5432
```

Certifique-se de que as informações correspondam às configurações do seu banco de dados PostgreSQL.

## 5. Criar o Banco de Dados no PostgreSQL:

- Acesse o console do PostgreSQL e execute os seguintes comandos para criar o banco de dados e a tabela necessária:

``` sql
CREATE DATABASE weather_db;

\c weather_db

CREATE TABLE forecasts (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  temp_min FLOAT NOT NULL,
  temp_max FLOAT NOT NULL,
  conditions TEXT NOT NULL,
  wind_speed FLOAT NOT NULL,
  wind_direction TEXT NOT NULL,
  precipitation_probability FLOAT NOT NULL
);
```

## 6. Iniciar a Aplicação:

Com todas as configurações concluídas, inicie a aplicação utilizando o comando:

`npm start`

A aplicação estará disponível em `http://localhost:5000`.



