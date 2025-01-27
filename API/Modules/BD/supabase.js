const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.PROJECT_URL, // URL do projeto Supabase
  process.env.ANON_KEY // Chave anônima de API
);

module.exports = supabase;
