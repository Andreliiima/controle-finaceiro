import Database from "@tauri-apps/plugin-sql";

// Uma conexão só para o app inteiro. As migrations (tabelas + categorias padrão) rodam no primeiro load.
export const db = Database.load("sqlite:financas.db");
