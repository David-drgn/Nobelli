const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const ExcelJS = require("exceljs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const supabase = require("./Modules/BD/supabase");
const crypto = require("./Modules/Crypto/crypto");

require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "20mb" }));

const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//Gemini

app.post("/api/chat", async (req, res) => {
  const { token, history } = req.body;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    const clientes = await supabase.from("cliente").select("*");

    const eventos = await supabase.from("eventos").select("*");

    const funcionarios = await supabase.from("funcionario").select("*");

    const produtos = await supabase.from("produto").select("*");

    const sections = await supabase.from("section").select("*");

    const servicos = await supabase.from("servico").select("*");

    const vendas = await supabase.from("venda").select("*");

    const dataBase = {
      clientes,
      eventos,
      funcionarios,
      produtos,
      sections,
      servicos,
      vendas,
    };

    const systemPrompt = [
      {
        role: "user",
        parts: [
          {
            text: `
          FORMATE AS RESPOSTAS EM HTML, USANDO TAGS, ISSO É OBRIGATÓRIO.
          SEMPRE FORMATE AS DATAS PARA O MODELO dd/mm/yy hh:mm ou dd/mm/yy caso possível
          Você é uma assistente virtual treinada para ajudar funcionários da Nobelli.
          Este é o seu banco de dados em JSON: ${JSON.stringify(dataBase)}
          `,
          },
        ],
      },
    ];

    const result = await model.generateContent({
      contents: [...systemPrompt, ...history.contents],
    });

    let response = result.response.text();

    response = response.replace("```html", "");
    response = response.replace("```", "");

    res.status(200).json({
      erro: false,
      mensagem: response,
    });
  } catch (error) {
    res.status(500).json({
      erro: true,
      mensagem: "Erro ao conectar com Gemini",
      detalhes: error.message,
    });
  }
});

//Login

app.post("/api/login", async (req, res) => {
  try {
    const { login, password, check } = req.body;

    let { data: data, error } = await supabase
      .from("login")
      .select("*")
      .eq("email", login)
      .eq("password", password);

    if (error) throw new Error(error.message);

    if (data.length != 0) {
      const token = jwt.sign(
        {
          data: "autorizado",
        },
        process.env.SECRET,
        { expiresIn: check ? "1y" : "1800000" }
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

app.post("/api/funcionarioInsert", async (req, res) => {
  const { token, nome, telefone, email } = req.body;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    const funcionarioData = {
      nome: nome ?? null,
      telefone: telefone ?? null,
      email: email ?? null,
    };

    const { data, error } = await supabase
      .from("funcionario")
      .insert([funcionarioData])
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

app.post("/api/sectionInsert", async (req, res) => {
  const { token, title, descricao, tipo } = req.body;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    const { data, error } = await supabase
      .from("section")
      .insert({ title, descricao, tipo })
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

app.post("/api/produtoInsert", async (req, res) => {
  const { token, title, descricao, section_id, valorcusto, valorvenda, qtd } =
    req.body;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    const dadosNew = {
      title: title ?? "",
      descricao: descricao ?? "",
      valorcusto: valorcusto == "" || valorcusto == null ? 0 : valorcusto,
      valorvenda: valorvenda == "" || valorvenda == null ? 0 : valorvenda,
      qtd: qtd ?? 0,
    };

    const { data, error } = await supabase
      .from("produto")
      .insert({ ...dadosNew, section_id })
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

app.post("/api/serviceInsert", async (req, res) => {
  const { token, title, descricao, section_id, valor, duracao } = req.body;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    const dadosNew = {
      title: title ?? "",
      descricao: descricao ?? "",
      valor: valor == "" || valor == null ? 0 : valor,
      duracao: duracao ?? "00:00",
    };

    const { data, error } = await supabase
      .from("servico")
      .insert({ ...dadosNew, section_id })
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
    });
  } catch (error) {
    res.status(500).json({
      erro: true,
      mensagem: "Erro ao conectar com Supabase",
      detalhes: error.message,
    });
  }
});

app.post("/api/funcionarioDelete", async (req, res) => {
  const { token, id } = req.body;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    const { error: vendaError } = await supabase
      .from("venda")
      .delete()
      .eq("funcionario_id", id);
    if (vendaError) throw vendaError;

    const { error: eventosError } = await supabase
      .from("eventos")
      .delete()
      .eq("funcionario_id", id);
    if (eventosError) throw eventosError;

    const { error: funcionarioError } = await supabase
      .from("funcionario")
      .delete()
      .eq("id", id);
    if (funcionarioError) throw funcionarioError;

    res.status(200).json({
      erro: false,
      mensagem: "Conexão realizada com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      erro: true,
      mensagem: "Erro ao conectar com Supabase",
      detalhes: error.message,
    });
  }
});

app.post("/api/sectionDelete", async (req, res) => {
  const { token, id } = req.body;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    const { error: produtoError } = await supabase
      .from("produto")
      .delete()
      .eq("section_id", id);
    if (produtoError) throw produtoError;

    const { error: servicoError } = await supabase
      .from("servico")
      .delete()
      .eq("section_id", id);
    if (servicoError) throw servicoError;

    const { error: sectionError } = await supabase
      .from("section")
      .delete()
      .eq("id", id);
    if (sectionError) throw sectionError;

    res.status(200).json({
      erro: false,
      mensagem: "Conexão realizada com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      erro: true,
      mensagem: "Erro ao conectar com Supabase",
      detalhes: error.message,
    });
  }
});

app.post("/api/produtoDelete", async (req, res) => {
  const { token, id } = req.body;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    const { error: produtoError } = await supabase
      .from("produto")
      .delete()
      .eq("id", id);
    if (produtoError) throw produtoError;

    res.status(200).json({
      erro: false,
      mensagem: "Conexão realizada com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      erro: true,
      mensagem: "Erro ao conectar com Supabase",
      detalhes: error.message,
    });
  }
});

app.post("/api/servicoDelete", async (req, res) => {
  const { token, id } = req.body;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    const { error: eventosError } = await supabase
      .from("eventos")
      .delete()
      .eq("servico_id", id);
    if (eventosError) throw eventosError;

    const { error: servicoError } = await supabase
      .from("servico")
      .delete()
      .eq("id", id);
    if (servicoError) throw servicoError;

    res.status(200).json({
      erro: false,
      mensagem: "Conexão realizada com sucesso",
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

app.post("/api/funcionarioUpdate", async (req, res) => {
  const { token, nome, telefone, email, id } = req.body;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    const { data, error } = await supabase
      .from("funcionario")
      .update({ nome, telefone, email })
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

app.post("/api/sectionUpdate", async (req, res) => {
  const { token, title, descricao, id } = req.body;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    const { data, error } = await supabase
      .from("section")
      .update({ title, descricao })
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

app.post("/api/produtoUpdate", async (req, res) => {
  const { token, title, descricao, valorcusto, valorvenda, qtd, id } = req.body;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    const dadosAtualizados = {
      title: title ?? "",
      descricao: descricao ?? "",
      valorcusto: valorcusto == "" || valorcusto == null ? 0 : valorcusto,
      valorvenda: valorvenda == "" || valorvenda == null ? 0 : valorvenda,
      qtd: qtd ?? 0,
    };

    const { data, error } = await supabase
      .from("produto")
      .update(dadosAtualizados)
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

app.post("/api/serviceUpdate", async (req, res) => {
  const { token, title, descricao, valor, duracao, id } = req.body;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    const dadosAtualizados = {
      title: title ?? "",
      descricao: descricao ?? "",
      valor: valor == "" || valor == null ? 0 : valor,
      duracao: duracao ?? "00:00",
    };

    const { data, error } = await supabase
      .from("servico")
      .update(dadosAtualizados)
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

app.get("/api/funcionarioGet/:token", async (req, res) => {
  const { token } = req.params;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    let { data, error } = await supabase
      .from("funcionario")
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

app.get("/api/funcionarioGet/:id/:token", async (req, res) => {
  const { id, token } = req.params;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    let { data, error } = await supabase
      .from("funcionario")
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

app.get("/api/sectionGet/:token", async (req, res) => {
  const { token } = req.params;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    let { data, error } = await supabase
      .from("section")
      .select("*, produto(*), servico(*)");

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

app.get("/api/sectionGet/:id/:token", async (req, res) => {
  const { token, id } = req.params;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    let { data, error } = await supabase
      .from("section")
      .select("*")
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

app.get("/api/produtoGet/:id/:token", async (req, res) => {
  const { token, id } = req.params;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    let { data, error } = await supabase
      .from("produto")
      .select("*, section(*)")
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

app.get("/api/serviceGet/:id/:token", async (req, res) => {
  const { token, id } = req.params;

  try {
    var decoded = tokenVerify(token);

    if (decoded.erro) throw "Erro ao decodificar o token";

    let { data, error } = await supabase
      .from("servico")
      .select("*, section(*)")
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

//Excel

app.post("/api/excel/create", async (req, res) => {
  const {
    token,
    cliente,
    funcionario,
    produtos,
    estoque,
    servico,
    eventos,
    vendas,
  } = req.body;

  try {
    var decoded = tokenVerify(token);
    if (decoded.erro) throw "Erro ao decodificar o token";

    let aba_confirm_cliente = [];
    let aba_confirm_funcionario = [];
    let aba_confirm_produtos = [];
    let aba_confirm_estoque = [];
    let aba_confirm_servico = [];
    let aba_confirm_eventos = [];
    let aba_confirm_vendas = [];

    Object.entries(cliente).forEach(([chave, valor]) => {
      if (valor) {
        if (chave == "all") {
          aba_confirm_cliente.push("*");
          return;
        } else aba_confirm_cliente.push(chave);
      }
    });

    Object.entries(funcionario).forEach(([chave, valor]) => {
      if (valor) {
        if (chave == "all") {
          aba_confirm_funcionario.push("*");
          return;
        } else aba_confirm_funcionario.push(chave);
      }
    });

    Object.entries(produtos).forEach(([chave, valor]) => {
      if (valor) {
        if (chave == "all") {
          aba_confirm_produtos.push("*");
          return;
        } else aba_confirm_produtos.push(chave);
      }
    });

    Object.entries(estoque).forEach(([chave, valor]) => {
      if (valor) {
        if (chave == "all") {
          aba_confirm_estoque.push("*");
          return;
        } else aba_confirm_estoque.push(chave);
      }
    });

    Object.entries(servico).forEach(([chave, valor]) => {
      if (valor) {
        if (chave == "all") {
          aba_confirm_servico.push("*");
          return;
        } else aba_confirm_servico.push(chave);
      }
    });

    Object.entries(eventos).forEach(([chave, valor]) => {
      if (valor) {
        if (chave == "all") {
          aba_confirm_eventos.push("*");
          return;
        } else aba_confirm_eventos.push(chave);
      }
    });

    Object.entries(vendas).forEach(([chave, valor]) => {
      if (valor) {
        if (chave == "all") {
          aba_confirm_vendas.push("*");
          return;
        } else aba_confirm_vendas.push(chave);
      }
    });

    if (
      aba_confirm_cliente.length == 0 &&
      aba_confirm_funcionario.length == 0 &&
      aba_confirm_produtos.length == 0 &&
      aba_confirm_estoque.length == 0 &&
      aba_confirm_servico.length == 0 &&
      aba_confirm_eventos.length == 0 &&
      aba_confirm_vendas.length == 0
    )
      throw new Error("Nenhum campo foi selecionado");

    const workbook = new ExcelJS.Workbook();

    if (aba_confirm_cliente.length != 0) {
      const sheet = workbook.addWorksheet("Clientes");

      let { data, error } = await supabase
        .from("cliente")
        .select(aba_confirm_cliente.join(","));

      if (error) throw error;

      if (data.length != 0) {
        data = data.map(({ id, ...resto }) => resto);
        data = data.map(({ created_at, ...resto }) => resto);

        const chaves = Object.keys(data[0]);
        const chaveOrdenacao = chaves[0];

        if (aba_confirm_cliente.some((e) => e === "all"))
          data.sort((a, b) => a.nome.localeCompare(b.nome));
        else
          data.sort((a, b) =>
            a[chaveOrdenacao].localeCompare(b[chaveOrdenacao])
          );

        let colunas = [];

        for (let i = 0; i < chaves.length; i++) {
          const columnName = chaves[i];
          colunas.push({
            header:
              columnName == "data_nasc"
                ? "Data de nascimento"
                : columnName.charAt(0).toUpperCase() +
                  columnName.slice(1).toLowerCase(),
            key: columnName.toLocaleLowerCase(),
            width: 40,
            height: 30,
            style: {
              font: {
                bold: true,
                color: { argb: "ffffff" },
                size: 14,
              },
              fill: {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "df9c73" },
              },
            },
          });
        }

        sheet.columns = colunas;

        for (let objeto of data) {
          if (chaves.some((e) => e === "endereco" || e === "all")) {
            const endereco = await buscarEndereco(objeto.endereco);

            if (endereco && !endereco.erro)
              objeto.endereco = `${endereco.logradouro}, ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}`;
            else objeto.endereco = "";
          }

          if (chaves.some((e) => e === "descricao" || e === "all")) {
            objeto.descricao = "OIIII /n \n oiiii";
          }
        }

        for (let i = 0; i < data.length; i++) {
          const row = sheet.addRow(data[i]);

          row.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: i % 2 === 0 ? "FFE5E5E5" : "FFFFFFFF" },
            };
            cell.font = {
              color: { argb: "FF000000" },
            };
          });
        }
      }
    }

    if (aba_confirm_funcionario.length != 0) {
      const sheet = workbook.addWorksheet("Funcionários");

      let { data, error } = await supabase
        .from("funcionario")
        .select(aba_confirm_funcionario.join(","));

      if (error) throw error;

      if (data.length != 0) {
        data = data.map(({ id, ...resto }) => resto);
        data = data.map(({ created_at, ...resto }) => resto);

        const chaves = Object.keys(data[0]);
        const chaveOrdenacao = chaves[0];

        if (aba_confirm_funcionario.some((e) => e === "all"))
          data.sort((a, b) => a.nome.localeCompare(b.nome));
        else
          data.sort((a, b) =>
            a[chaveOrdenacao].localeCompare(b[chaveOrdenacao])
          );

        let colunas = [];

        for (let i = 0; i < chaves.length; i++) {
          const columnName = chaves[i];
          colunas.push({
            header:
              columnName.charAt(0).toUpperCase() +
              columnName.slice(1).toLowerCase(),
            key: columnName.toLocaleLowerCase(),
            width: 40,
            height: 30,
            style: {
              font: {
                bold: true,
                color: { argb: "ffffff" },
                size: 14,
              },
              fill: {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "df9c73" },
              },
            },
          });
        }

        sheet.columns = colunas;

        // for (let objeto of data) {

        //   if (chaves.some((e) => e === "descricao" || e === "all")) {
        //     objeto.descricao = "OIIII /n \n oiiii";
        //   }
        // }

        for (let i = 0; i < data.length; i++) {
          const row = sheet.addRow(data[i]);

          row.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: i % 2 === 0 ? "FFE5E5E5" : "FFFFFFFF" },
            };
            cell.font = {
              color: { argb: "FF000000" },
            };
          });
        }
      }
    }

    if (aba_confirm_produtos.length != 0) {
      const sheet = workbook.addWorksheet("Produtos");

      let { data, error } = await supabase
        .from("produto")
        .select([...aba_confirm_produtos, "section(*)"].join(","))
        .eq("section.tipo", "produto");
      if (error) throw error;

      if (data.length != 0) {
        data = data.map(({ id, ...resto }) => resto);
        data = data.map(({ created_at, ...resto }) => resto);
        data = data.map(({ section_id, ...resto }) => resto);
        data = data.map(({ section, ...resto }) => resto);

        const chaves = Object.keys(data[0]);
        const chaveOrdenacao = chaves[0];

        if (aba_confirm_produtos.some((e) => e === "all"))
          data.sort((a, b) => a.nome.localeCompare(b.nome));
        else
          data.sort((a, b) =>
            a[chaveOrdenacao].localeCompare(b[chaveOrdenacao])
          );

        let colunas = [];

        for (let i = 0; i < chaves.length; i++) {
          const columnName = chaves[i];
          colunas.push({
            header:
              columnName == "qtd"
                ? "Quantidade"
                : columnName == "valorcusto"
                ? "Valor de Custo"
                : columnName == "valorvenda"
                ? "Valor de Venda"
                : columnName.charAt(0).toUpperCase() +
                  columnName.slice(1).toLowerCase(),
            key: columnName.toLocaleLowerCase(),
            width: 40,
            height: 30,
            style: {
              font: {
                bold: true,
                color: { argb: "ffffff" },
                size: 14,
              },
              fill: {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "df9c73" },
              },
            },
          });
        }

        sheet.columns = colunas;

        for (let objeto of data) {
          if (chaves.some((e) => e === "valorcusto" || e === "all")) {
            objeto.valorcusto = `R$${objeto.valorcusto}`;
          }
          if (chaves.some((e) => e === "valorvenda" || e === "all")) {
            objeto.valorvenda = `R$${objeto.valorvenda}`;
          }
        }

        for (let i = 0; i < data.length; i++) {
          const row = sheet.addRow(data[i]);

          row.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: i % 2 === 0 ? "FFE5E5E5" : "FFFFFFFF" },
            };
            cell.font = {
              color: { argb: "FF000000" },
            };
          });
        }
      }
    }

    // // Criando duas abas
    // const sheet1 = workbook.addWorksheet("Teste1");
    // const sheet2 = workbook.addWorksheet("Teste2");

    // // Adicionando cabeçalhos
    // sheet1.columns = [
    //   { header: "Nome", key: "nome", width: 20 },
    //   { header: "Link", key: "link", width: 30 },
    // ];
    // sheet2.columns = [
    //   { header: "ID", key: "id", width: 10 },
    //   { header: "Nome", key: "nome", width: 20 },
    // ];

    // // Adicionando dados na aba Teste2
    // sheet2.addRow({ id: 1, nome: "David Raphael" });
    // sheet2.addRow({ id: 2, nome: "Leara" });

    // // Criando links na aba Teste1 para a aba Teste2
    // sheet1.addRow({
    //   nome: "Clique para ver",
    //   link: { text: "Ver Detalhes", hyperlink: "#Teste2!A2" }, // Link para a linha correspondente
    // });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader("Content-Disposition", 'attachment; filename="dados.xlsx"');

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    console.error("Erro ao gerar Excel:", error);
    res.status(500).send("Erro ao gerar Excel");
  }
});

// Starter

app.listen(port, () => {
  console.log(`Aplicação rodando na porta: ${port}`);
});

// Functions

async function buscarEndereco(cep) {
  const url = `https://viacep.com.br/ws/${cep}/json/`;

  try {
    if (!cep) throw new Error("Cep null");
    const resposta = await axios.get(url);
    return resposta.data;
  } catch (error) {
    return null;
  }
}
