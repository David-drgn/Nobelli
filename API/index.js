const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const supabase = require("./Modules/BD/supabase");
const crypto = require("./Modules/Crypto/crypto");

require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "20mb" }));

app.get("/api/connect", async (req, res) => {
  try {
    // let { data, error } = await supabase.from("teste").select("*");

    const { data, error } = await supabase.from("teste").insert({}).select();

    if (error) throw error;

    res.status(200).json({
      erro: false,
      mensagem: "Conexão realizada com sucesso",
      dados: data,
    });
  } catch (error) {
    res.status(500).json({
      erro: true,
      mensagem: "Erro ao conectar com Supabase",
      detalhes: error.message,
    });
  }
});

//Getters

app.get("/api/clienteGet", async (req, res) => {
  try {
    let { data, error } = await supabase
      .from("cliente")
      .select("*, eventos(*), venda(*)");

    if (error) throw error;

    res.status(200).json({
      erro: false,
      data,
    });
  } catch (error) {
    res.status(500).json({
      erro: true,
      mensagem: "Erro ao conectar com Supabase",
      detalhes: error.message,
    });
  }
});

app.get("/api/produtosGet", async (req, res) => {
  try {
    let { data, error } = await supabase.from("produto").select("*");

    if (error) throw error;

    res.status(200).json({
      erro: false,
      data,
    });
  } catch (error) {
    res.status(500).json({
      erro: true,
      mensagem: "Erro ao conectar com Supabase",
      detalhes: error.message,
    });
  }
});

// Starter

app.listen(port, () => {
  console.log(`Aplicação rodando na porta: ${port}`);
});
