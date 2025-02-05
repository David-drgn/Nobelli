const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const supabase = require("./Modules/BD/supabase");
const crypto = require("./Modules/Crypto/crypto");

require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "20mb" }));

//Login

app.post("/api/login", async (req, res) => {
  try {
    const { login, password, check } = req.body;

    if (login == process.env.LOGIN && password == process.env.PASSWORD) {
      const token = jwt.sign(
        {
          data: "autorizado",
        },
        process.env.SECRET,
        { expiresIn: check? "1y" : "1800000"}
      );

      res.status(200).json({
        erro: false,
        mensagem: "Conexão realizada com sucesso",
        token,
      });
    } else {
      res.status(200).json({
        erro: true,
        mensagem: "Erro ao conectar",
      });
    }
  } catch (error) {
    res.status(500).json({
      erro: true,
      mensagem: "Erro ao conectar com Supabase",
      detalhes: error.message,
    });
  }
});

//Token Realize

function tokenVerify(token) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    return { decoded, erro: false };
  } catch (error) {
    return { erro: true };
  }
}

app.post("/api/verifyToken", async (req, res) => {
  try {
    const { token } = req.body;

    try {
      var decoded = tokenVerify(token);

      if (decoded.erro) throw "Erro ao decodificar o token";

      res.status(200).json({
        erro: false,
        mensagem: "Erro ao conectar com Supabase",
        decoded,
      });
    } catch (err) {
      res.status(200).json({
        erro: true,
        mensagem: "Erro ao conectar",
        detalhes: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      erro: true,
      mensagem: "Erro ao conectar com Supabase",
      detalhes: error.message,
    });
  }
});

//Insert

app.post("/api/clienteInsert", async (req, res) => {
  const { token, nome, telefone, endereco, descricao, genero, data_nasc } =
    req.body;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    const clienteData = {
      nome: nome ?? null,
      telefone: telefone ?? null,
      endereco: endereco ?? null,
      descricao: descricao ?? null,
      genero: genero == "" ? "Masculino" : genero,
      data_nasc: data_nasc == "" ? null : data_nasc,
    };

    const { data, error } = await supabase
      .from("cliente")
      .insert([clienteData])
      .select();

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

//Delete

app.post("/api/clienteDelete", async (req, res) => {
  const { token, id } = req.body;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    const { error: vendaError } = await supabase
      .from("venda")
      .delete()
      .eq("cliente_id", id);
    if (vendaError) throw vendaError;

    const { error: eventosError } = await supabase
      .from("eventos")
      .delete()
      .eq("cliente_id", id);
    if (eventosError) throw eventosError;

    const { error: clienteError } = await supabase
      .from("cliente")
      .delete()
      .eq("id", id);
    if (clienteError) throw clienteError;

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

//Update

app.post("/api/clienteUpdate", async (req, res) => {
  const { token, nome, telefone, endereco, descricao, genero, data_nasc, id } =
    req.body;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    const { data, error } = await supabase
      .from("cliente")
      .update({ nome, telefone, endereco, descricao, genero, data_nasc })
      .eq("id", id)
      .select();

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

app.get("/api/clienteGet/:token", async (req, res) => {
  const { token } = req.params;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

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

app.get("/api/clienteGet/:id/:token", async (req, res) => {
  const { id, token } = req.params;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    let { data, error } = await supabase
      .from("cliente")
      .select("*, eventos(*), venda(*)")
      .eq("id", id);

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
  const { token } = req.body;
  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

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
