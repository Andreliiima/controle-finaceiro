// Testa a migration num banco em memória: npm run test:db  (precisa Node 22.13+)
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const db = new DatabaseSync(":memory:");
db.exec("PRAGMA foreign_keys = ON"); // o app (sqlx) já liga isso por padrão
db.exec(readFileSync(new URL("../src-tauri/migrations/0001_inicial.sql", import.meta.url), "utf8"));

assert.equal(db.prepare("SELECT COUNT(*) n FROM categorias").get().n, 10);

db.exec("INSERT INTO contas (nome, saldo_inicial) VALUES ('Nubank', 80000)");
db.exec(`INSERT INTO transacoes (tipo, valor, data, descricao, conta_id, categoria_id)
         VALUES ('despesa', 2500, '2026-11-06', 'Lanche', 1, 1)`);

const falha = (sql) => assert.throws(() => db.exec(sql));
falha("INSERT INTO transacoes (tipo, valor, data, descricao, conta_id, categoria_id) VALUES ('despesa', 0, '2026-11-06', 'x', 1, 1)"); // valor > 0
falha("INSERT INTO transacoes (tipo, valor, data, descricao, conta_id, categoria_id) VALUES ('outro', 100, '2026-11-06', 'x', 1, 1)"); // tipo válido
falha("INSERT INTO transacoes (tipo, valor, data, descricao, conta_id, categoria_id) VALUES ('despesa', 100, '2026-11-06', 'x', 99, 1)"); // conta existe
falha("DELETE FROM categorias WHERE id = 1"); // categoria em uso não pode ser apagada

const { saldo } = db.prepare(`
  SELECT c.saldo_inicial
       + COALESCE(SUM(CASE t.tipo WHEN 'receita' THEN t.valor ELSE -t.valor END), 0) AS saldo
  FROM contas c LEFT JOIN transacoes t ON t.conta_id = c.id WHERE c.id = 1`).get();
assert.equal(saldo, 77500); // R$ 800,00 - R$ 25,00

console.log("Banco OK ✔");
